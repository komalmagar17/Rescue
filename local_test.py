"""
Local offline test for Emergency Passport handler.
Run with:  python local_test.py
No AWS credentials required.
"""

import json
import sys
from decimal import Decimal
from unittest.mock import MagicMock, patch

# Ensure UTF-8 output encoding for emojis on Windows terminals
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Import the handler
from src.emergency_handler.app import lambda_handler, match_hospital, summarize_with_bedrock


# ---------------------------------------------------------------------------
# Fake data (same shape as your seed data)
# ---------------------------------------------------------------------------
FAKE_PROFILE = {
    "TouristID": "T-1002",
    "Name": "Kenji Sato",
    "Age": 34,
    "BloodType": "A-",
    "Conditions": {"Type 1 Diabetes"},
    "Allergies": {"Latex", "Sulfa Drugs"},
    "EmergencyContacts": {"+81-90-1234-5678 (Sister - Yuko)"},
    "Language": "Japanese, English",
}

FAKE_HOSPITALS = [
    {
        "HospitalID": "H-201",
        "Name": "Central Metropolitan Hospital",
        "Latitude": Decimal("40.7128"),
        "Longitude": Decimal("-74.0060"),
        "Services": {"Trauma Center Level 1", "Cardiology", "Burn Unit"},
        "ContactInfo": "+1-212-555-9000",
        "Capacity": 450,
    },
    {
        "HospitalID": "H-202",
        "Name": "St. Jude Emergency Medical Center",
        "Latitude": Decimal("34.0522"),
        "Longitude": Decimal("-118.2437"),
        "Services": {"Emergency Surgery", "ICU", "Stroke Care", "Neurology"},
        "ContactInfo": "+1-310-555-4321",
        "Capacity": 320,
    },
    {
        "HospitalID": "H-203",
        "Name": "Alpine Regional Trauma & Rescue Clinic",
        "Latitude": Decimal("39.7392"),
        "Longitude": Decimal("-104.9903"),
        "Services": {"Hyperbaric Medicine", "Orthopedics", "Trauma Care"},
        "ContactInfo": "+1-303-555-7788",
        "Capacity": 180,
    },
]


def test_hospital_matching():
    print("\n=== Test 1: Hospital Matching ===")
    matched = match_hospital(FAKE_PROFILE, FAKE_HOSPITALS)
    print(f"Recommended hospital: {matched['Name']}")
    print(f"Services: {matched['Services']}")
    assert "ICU" in matched["Services"] or any("ICU" in s for s in matched["Services"])
    print("✅ Matching logic works (diabetic patient → prefers ICU hospital)")


def test_fallback_summary():
    print("\n=== Test 2: Fallback Summary (no Bedrock) ===")
    summary = summarize_with_bedrock(FAKE_PROFILE, location="Mountain trail")
    print(summary)
    assert "34" in summary
    assert "Diabetes" in summary or "diabetes" in summary.lower()
    print("✅ Fallback summary works")


def test_health_endpoint():
    print("\n=== Test 3: /health endpoint ===")
    event = {
        "requestContext": {"http": {"method": "GET", "path": "/health"}},
        "path": "/health",
    }
    result = lambda_handler(event, None)
    body = json.loads(result["body"])
    print(json.dumps(body, indent=2))
    assert result["statusCode"] == 200
    assert body["status"] == "healthy"
    print("✅ /health works")


def test_emergency_flow_with_mocks():
    print("\n=== Test 4: Full /emergency flow (mocked DynamoDB) ===")

    with patch("src.emergency_handler.app.get_profile", return_value=FAKE_PROFILE), \
         patch("src.emergency_handler.app.list_hospitals", return_value=FAKE_HOSPITALS):

        event = {
            "requestContext": {"http": {"method": "GET", "path": "/emergency"}},
            "path": "/emergency",
            "queryStringParameters": {
                "tourist_id": "T-1002",
                "location": "Himalayan trail, altitude 3200m"
            },
        }
        result = lambda_handler(event, None)
        body = json.loads(result["body"])

        print("Status code:", result["statusCode"])
        print("AI Summary:\n", body.get("ai_summary"))
        print("Recommended hospital:", body.get("recommended_hospital", {}).get("Name"))

        assert result["statusCode"] == 200
        assert body["status"] == "emergency_processed"
        assert "ai_summary" in body
        assert body["recommended_hospital"] is not None
        print("✅ Full emergency flow works with mocks")


if __name__ == "__main__":
    print("Running offline tests for Emergency Passport...\n")
    test_hospital_matching()
    test_fallback_summary()
    test_health_endpoint()
    test_emergency_flow_with_mocks()
    print("\n🎉 All local tests passed! Ready for the next stage.")
