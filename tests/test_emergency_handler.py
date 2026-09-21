"""Unit tests for EmergencyHandler Lambda function."""

import json
import unittest
from unittest.mock import patch
from src.emergency_handler.app import lambda_handler


class TestEmergencyHandler(unittest.TestCase):
    def test_health_check(self):
        event = {
            "rawPath": "/health",
            "requestContext": {
                "http": {
                    "method": "GET",
                    "path": "/health",
                }
            },
        }
        response = lambda_handler(event, None)
        self.assertEqual(response["statusCode"], 200)
        body = json.loads(response["body"])
        self.assertEqual(body["status"], "healthy")
        self.assertEqual(body["service"], "emergency-passport")

    def test_emergency_missing_tourist_id(self):
        event = {
            "rawPath": "/emergency",
            "requestContext": {
                "http": {
                    "method": "POST",
                    "path": "/emergency",
                }
            },
        }
        response = lambda_handler(event, None)
        self.assertEqual(response["statusCode"], 400)
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
            "Conditions": {"Asthma"},
            "Allergies": {"Penicillin"},
            "EmergencyContacts": {"+1-555-0199"},
        }
        mock_hospitals.return_value = [
            {
                "HospitalID": "H-201",
                "Name": "City General Hospital",
                "Services": {"ICU"},
                "Capacity": 100,
            }
        ]
        event = {
            "rawPath": "/emergency",
            "requestContext": {
                "http": {
                    "method": "POST",
                    "path": "/emergency",
                }
            },
            "body": json.dumps({"tourist_id": "T-1001", "location": "Central Station"}),
        }
        response = lambda_handler(event, None)
        self.assertEqual(response["statusCode"], 200)
        body = json.loads(response["body"])
        self.assertEqual(body["status"], "emergency_processed")
        self.assertEqual(body["tourist_id"], "T-1001")
        self.assertIn("ai_summary", body)
        self.assertIn("recommended_hospital", body)


if __name__ == "__main__":
    unittest.main()
