"""Comprehensive Unit Tests for Emergency Passport API and Services."""

import json
import unittest
from unittest.mock import patch

from src.emergency_handler.app import (
    calculate_haversine_distance,
    lambda_handler,
    match_hospital,
    summarize_with_bedrock,
)


class TestEmergencyHandler(unittest.TestCase):
    def test_health_check(self):
        event = {
            "rawPath": "/health",
            "requestContext": {"http": {"method": "GET", "path": "/health"}},
        }
        response = lambda_handler(event, None)
        self.assertEqual(response["statusCode"], 200)
        body = json.loads(response["body"])
        self.assertEqual(body["status"], "healthy")
        self.assertEqual(body["service"], "emergency-passport")
        self.assertIn("database", body)
        self.assertIn("features", body)

    def test_cors_preflight(self):
        event = {
            "rawPath": "/tourists",
            "requestContext": {"http": {"method": "OPTIONS", "path": "/tourists"}},
        }
        response = lambda_handler(event, None)
        self.assertEqual(response["statusCode"], 200)
        self.assertEqual(response["headers"]["Access-Control-Allow-Origin"], "*")
        self.assertIn("OPTIONS", response["headers"]["Access-Control-Allow-Methods"])

    def test_emergency_missing_tourist_id(self):
        event = {
            "rawPath": "/emergency",
            "requestContext": {"http": {"method": "POST", "path": "/emergency"}},
            "body": json.dumps({}),
        }
        response = lambda_handler(event, None)
        self.assertEqual(response["statusCode"], 400)
        body = json.loads(response["body"])
        self.assertIn("error", body)

    def test_emergency_invalid_json(self):
        event = {
            "rawPath": "/emergency",
            "requestContext": {"http": {"method": "POST", "path": "/emergency"}},
            "body": "{invalid-json",
        }
        response = lambda_handler(event, None)
        self.assertEqual(response["statusCode"], 400)
        body = json.loads(response["body"])
        self.assertIn("error", body)

    def test_emergency_tourist_not_found(self):
        event = {
            "rawPath": "/emergency",
            "requestContext": {"http": {"method": "GET", "path": "/emergency"}},
            "queryStringParameters": {"tourist_id": "T-NONEXISTENT"},
        }
        response = lambda_handler(event, None)
        self.assertEqual(response["statusCode"], 404)
        body = json.loads(response["body"])
        self.assertIn("error", body)

    @patch("src.emergency_handler.app.get_profile")
    @patch("src.emergency_handler.app.list_hospitals")
    def test_emergency_endpoint_success(self, mock_hospitals, mock_profile):
        mock_profile.return_value = {
            "TouristID": "T-1001",
            "Name": "Elena Rostova",
            "Age": 29,
            "BloodType": "O+",
            "Conditions": ["Asthma"],
            "Allergies": ["Penicillin"],
            "EmergencyContacts": ["+1-555-0199"],
        }
        mock_hospitals.return_value = [
            {
                "HospitalID": "H-201",
                "Name": "City General Hospital",
                "Services": ["ICU"],
                "Capacity": 100,
                "Latitude": 26.8500,
                "Longitude": 80.9500,
            }
        ]
        event = {
            "rawPath": "/emergency",
            "requestContext": {"http": {"method": "POST", "path": "/emergency"}},
            "body": json.dumps({
                "tourist_id": "T-1001",
                "location": "Central Station",
                "latitude": 26.8400,
                "longitude": 80.9400,
            }),
        }
        response = lambda_handler(event, None)
        self.assertEqual(response["statusCode"], 200)
        body = json.loads(response["body"])
        self.assertEqual(body["status"], "emergency_processed")
        self.assertEqual(body["tourist_id"], "T-1001")
        self.assertIn("ai_summary", body)
        self.assertIn("recommended_hospital", body)
        self.assertIn("DistanceKm", body["recommended_hospital"])

    def test_list_tourists(self):
        event = {
            "rawPath": "/tourists",
            "requestContext": {"http": {"method": "GET", "path": "/tourists"}},
        }
        response = lambda_handler(event, None)
        self.assertEqual(response["statusCode"], 200)
        body = json.loads(response["body"])
        self.assertIn("tourists", body)
        self.assertGreaterEqual(body["count"], 1)

    def test_get_single_tourist(self):
        event = {
            "rawPath": "/tourists/T-1001",
            "requestContext": {"http": {"method": "GET", "path": "/tourists/T-1001"}},
        }
        response = lambda_handler(event, None)
        self.assertEqual(response["statusCode"], 200)
        body = json.loads(response["body"])
        self.assertEqual(body["tourist"]["TouristID"], "T-1001")

    def test_get_tourist_qr(self):
        event = {
            "rawPath": "/tourists/T-1001/qr",
            "requestContext": {"http": {"method": "GET", "path": "/tourists/T-1001/qr"}},
        }
        response = lambda_handler(event, None)
        self.assertEqual(response["statusCode"], 200)
        body = json.loads(response["body"])
        self.assertEqual(body["tourist_id"], "T-1001")
        self.assertEqual(body["status"], "valid")
        self.assertIn("triage_url", body)

    def test_get_nonexistent_tourist(self):
        event = {
            "rawPath": "/tourists/T-99999",
            "requestContext": {"http": {"method": "GET", "path": "/tourists/T-99999"}},
        }
        response = lambda_handler(event, None)
        self.assertEqual(response["statusCode"], 404)

    def test_create_and_delete_tourist(self):
        # Create
        create_event = {
            "rawPath": "/tourists",
            "requestContext": {"http": {"method": "POST", "path": "/tourists"}},
            "body": json.dumps({
                "TouristID": "T-9999",
                "Name": "Test Traveler",
                "Age": 25,
                "BloodType": "AB+",
                "Conditions": ["None"],
                "Allergies": ["None"],
                "EmergencyContacts": ["+1-555-0000"],
            }),
        }
        create_resp = lambda_handler(create_event, None)
        self.assertEqual(create_resp["statusCode"], 201)

        # Delete
        del_event = {
            "rawPath": "/tourists/T-9999",
            "requestContext": {"http": {"method": "DELETE", "path": "/tourists/T-9999"}},
        }
        del_resp = lambda_handler(del_event, None)
        self.assertEqual(del_resp["statusCode"], 200)

    def test_list_hospitals(self):
        event = {
            "rawPath": "/hospitals",
            "requestContext": {"http": {"method": "GET", "path": "/hospitals"}},
        }
        response = lambda_handler(event, None)
        self.assertEqual(response["statusCode"], 200)
        body = json.loads(response["body"])
        self.assertIn("hospitals", body)
        self.assertGreaterEqual(body["count"], 1)

    def test_haversine_calculation(self):
        dist = calculate_haversine_distance(26.8500, 80.9500, 26.7800, 80.9200)
        self.assertGreater(dist, 5.0)
        self.assertLess(dist, 15.0)

    def test_disaster_alerts(self):
        event = {
            "rawPath": "/alerts",
            "requestContext": {"http": {"method": "GET", "path": "/alerts"}},
            "queryStringParameters": {"latitude": "35.6812", "longitude": "139.7671"},
        }
        response = lambda_handler(event, None)
        self.assertEqual(response["statusCode"], 200)
        body = json.loads(response["body"])
        self.assertEqual(body["status"], "active_alerts")
        self.assertIn("alerts", body)
        self.assertGreaterEqual(body["total_active"], 1)
        alert = body["alerts"][0]
        self.assertIn("headline", alert)
        self.assertIn("disaster_type", alert)
        self.assertIn("safe_shelters", alert)

    @patch("src.emergency_handler.app.urllib.request.urlopen")
    def test_groq_ai_summarization(self, mock_urlopen):
        import io
        import os
        mock_response = io.BytesIO(json.dumps({
            "choices": [{
                "message": {
                    "content": "• Elena Rostova (29 y/o, Blood: O+)\n• CONTRAINDICATION: Penicillin, Peanuts\n• Chronic: Asthma, Hypertension\n• Lang: English, Russian\n• Contact: Mark Rostova (+1-555-0199)"
                }
            }]
        }).encode("utf-8"))
        mock_urlopen.return_value.__enter__.return_value = mock_response

        with patch.dict(os.environ, {"GROQ_API_KEY": "gsk_test_mock_12345"}):
            event = {
                "rawPath": "/emergency",
                "requestContext": {"http": {"method": "GET", "path": "/emergency"}},
                "queryStringParameters": {"tourist_id": "T-1001"},
            }
            response = lambda_handler(event, None)
            self.assertEqual(response["statusCode"], 200)
            body = json.loads(response["body"])
            self.assertEqual(body["ai_provider"], "groq")
            self.assertIn("Elena Rostova", body["ai_summary"])
            self.assertIn("Penicillin", body["ai_summary"])

    @patch("src.emergency_handler.app.urllib.request.urlopen")
    def test_groq_ai_fallback_on_network_error(self, mock_urlopen):
        import os
        import urllib.error
        mock_urlopen.side_effect = urllib.error.URLError("Connection refused")

        with patch.dict(os.environ, {"GROQ_API_KEY": "gsk_test_mock_12345"}):
            event = {
                "rawPath": "/emergency",
                "requestContext": {"http": {"method": "GET", "path": "/emergency"}},
                "queryStringParameters": {"tourist_id": "T-1001"},
            }
            response = lambda_handler(event, None)
            self.assertEqual(response["statusCode"], 200)
            body = json.loads(response["body"])
            self.assertIn("ai_summary", body)
            self.assertIn("CRITICAL ALLERGIES", body["ai_summary"])


if __name__ == "__main__":
    unittest.main()
