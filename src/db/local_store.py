"""
Thread-safe, zero-dependency local store for Emergency Passport.
Provides automated pre-seeding and local persistence so the app works
out of the box without any AWS credentials or cloud setup.
"""

import copy
import json
import logging
import os
import threading
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)

DEFAULT_TOURISTS: List[Dict[str, Any]] = [
    {
        "TouristID": "T-1001",
        "Name": "Aarav Sharma",
        "Age": 29,
        "BloodType": "O+",
        "Conditions": ["Asthma", "Mild Hypertension"],
        "Allergies": ["Penicillin", "Peanuts"],
        "EmergencyContacts": ["+91 98201 44521 (Spouse - Priya Sharma)", "+91 98110 99214 (Father - Vikram Sharma)"],
        "Language": "Hindi, English",
        "Notes": "Carries emergency albuterol inhaler.",
        "LastUpdated": "2026-09-22T09:00:00Z",
    },
    {
        "TouristID": "T-1002",
        "Name": "Rohan Kulkarni",
        "Age": 34,
        "BloodType": "A-",
        "Conditions": ["Type 1 Diabetes"],
        "Allergies": ["Latex", "Sulfa Drugs"],
        "EmergencyContacts": ["+91 98220 81190 (Sister - Neha Kulkarni)"],
        "Language": "Marathi, Hindi, English",
        "Notes": "Carries insulin pump on left abdominal quadrant.",
        "LastUpdated": "2026-09-22T09:00:00Z",
    },
    {
        "TouristID": "T-1003",
        "Name": "Ananya Iyer",
        "Age": 26,
        "BloodType": "B+",
        "Conditions": ["Cardiac Arrhythmia", "Epilepsy"],
        "Allergies": ["Aspirin", "Ibuprofen"],
        "EmergencyContacts": ["+91 94440 23118 (Brother - Siddharth Iyer)", "+91 94441 55667 (Dr. K. Swaminathan)"],
        "Language": "Tamil, Hindi, English",
        "Notes": "History of supraventricular tachycardia.",
        "LastUpdated": "2026-09-22T09:00:00Z",
    },
    {
        "TouristID": "T-1004",
        "Name": "Arjun Patel",
        "Age": 67,
        "BloodType": "O-",
        "Conditions": ["Type 2 Diabetes", "Coronary Artery Disease"],
        "Allergies": ["Iodine Contrast"],
        "EmergencyContacts": ["+91 98765 43210 (Son - Devansh Patel)"],
        "Language": "Gujarati, Hindi, English",
        "Notes": "Requires cardiac telemetry monitoring.",
        "LastUpdated": "2026-09-22T09:00:00Z",
    },
]

DEFAULT_HOSPITALS: List[Dict[str, Any]] = [
    {
        "HospitalID": "H-201",
        "Name": "AIIMS New Delhi — Apex Trauma Centre",
        "Latitude": 28.5672,
        "Longitude": 77.2100,
        "Services": ["Trauma Center Level 1", "ICU", "Cardiology", "Emergency Surgery", "Stroke Care", "Burn Unit"],
        "ContactInfo": "+91-11-2659-3677 (24x7 Apex Trauma Command)",
        "Capacity": 550,
        "AvailableBeds": 42,
    },
    {
        "HospitalID": "H-202",
        "Name": "Apollo Hospital Speciality & Critical Care",
        "Latitude": 28.5368,
        "Longitude": 77.2917,
        "Services": ["ICU", "Neurosurgery", "Cardiology", "Organ Transplant", "Air Ambulance"],
        "ContactInfo": "+91-11-2692-5858 (Emergency Dispatch)",
        "Capacity": 480,
        "AvailableBeds": 28,
    },
    {
        "HospitalID": "H-203",
        "Name": "Max Super Speciality Hospital (Saket Trauma Hub)",
        "Latitude": 28.5283,
        "Longitude": 77.2115,
        "Services": ["Emergency Surgery", "Cardiology", "Intensive Stroke Unit", "Level 1 Trauma"],
        "ContactInfo": "+91-11-2651-5050 (Saket ER Helpline)",
        "Capacity": 320,
        "AvailableBeds": 19,
    },
    {
        "HospitalID": "H-204",
        "Name": "Safdarjung Hospital Emergency & Burns Block",
        "Latitude": 28.5700,
        "Longitude": 77.2080,
        "Services": ["Trauma Center Level 1", "Burn Care", "Pediatric Emergency", "ICU"],
        "ContactInfo": "+91-11-2616-5060 (Emergency Desk)",
        "Capacity": 600,
        "AvailableBeds": 54,
    },
]


class LocalStore:
    """In-memory and JSON-file backed store."""

    def __init__(self, persistence_file: Optional[str] = None):
        self._lock = threading.RLock()
        self._persistence_file = persistence_file or os.path.join(
            os.path.dirname(os.path.abspath(__file__)), "data", "local_data.json"
        )
        self._tourists: Dict[str, Dict[str, Any]] = {}
        self._hospitals: Dict[str, Dict[str, Any]] = {}
        self._load_or_initialize()

    def _load_or_initialize(self) -> None:
        with self._lock:
            if os.path.exists(self._persistence_file):
                try:
                    with open(self._persistence_file, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        self._tourists = data.get("tourists", {})
                        self._hospitals = data.get("hospitals", {})
                        logger.info("Loaded local store from %s", self._persistence_file)
                        return
                except Exception as e:
                    logger.warning("Could not read persistence file %s: %s", self._persistence_file, e)

            # Initialize with default seeds
            self._tourists = {t["TouristID"]: copy.deepcopy(t) for t in DEFAULT_TOURISTS}
            self._hospitals = {h["HospitalID"]: copy.deepcopy(h) for h in DEFAULT_HOSPITALS}
            self._persist()

    def _persist(self) -> None:
        try:
            os.makedirs(os.path.dirname(self._persistence_file), exist_ok=True)
            with open(self._persistence_file, "w", encoding="utf-8") as f:
                json.dump(
                    {"tourists": self._tourists, "hospitals": self._hospitals},
                    f,
                    indent=2,
                    default=str,
                )
        except Exception as e:
            logger.warning("Failed to persist local store: %s", e)

    # Tourist operations
    def get_tourist(self, tourist_id: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            item = self._tourists.get(tourist_id)
            return copy.deepcopy(item) if item else None

    def list_tourists(self) -> List[Dict[str, Any]]:
        with self._lock:
            return copy.deepcopy(list(self._tourists.values()))

    def save_tourist(self, data: Dict[str, Any]) -> Dict[str, Any]:
        with self._lock:
            tourist_id = data.get("TouristID")
            if not tourist_id:
                # Generate unique ID
                existing_nums = [
                    int(k.split("-")[1]) for k in self._tourists if k.startswith("T-") and k.split("-")[1].isdigit()
                ]
                next_num = max(existing_nums, default=1000) + 1
                tourist_id = f"T-{next_num}"
                data["TouristID"] = tourist_id

            if "LastUpdated" not in data:
                data["LastUpdated"] = datetime.now(timezone.utc).isoformat()

            # Normalize conditions, allergies, contacts as lists
            for field in ["Conditions", "Allergies", "EmergencyContacts"]:
                val = data.get(field, [])
                if isinstance(val, set):
                    data[field] = sorted(list(val))
                elif isinstance(val, str):
                    data[field] = [s.strip() for s in val.split(",") if s.strip()]

            self._tourists[tourist_id] = copy.deepcopy(data)
            self._persist()
            return copy.deepcopy(data)

    def delete_tourist(self, tourist_id: str) -> bool:
        with self._lock:
            if tourist_id in self._tourists:
                del self._tourists[tourist_id]
                self._persist()
                return True
            return False

    # Hospital operations
    def get_hospital(self, hospital_id: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            item = self._hospitals.get(hospital_id)
            return copy.deepcopy(item) if item else None

    def list_hospitals(self) -> List[Dict[str, Any]]:
        with self._lock:
            return copy.deepcopy(list(self._hospitals.values()))

    def save_hospital(self, data: Dict[str, Any]) -> Dict[str, Any]:
        with self._lock:
            hospital_id = data.get("HospitalID")
            if not hospital_id:
                existing_nums = [
                    int(k.split("-")[1]) for k in self._hospitals if k.startswith("H-") and k.split("-")[1].isdigit()
                ]
                next_num = max(existing_nums, default=200) + 1
                hospital_id = f"H-{next_num}"
                data["HospitalID"] = hospital_id

            if isinstance(data.get("Services"), set):
                data["Services"] = sorted(list(data["Services"]))
            elif isinstance(data.get("Services"), str):
                data["Services"] = [s.strip() for s in data["Services"].split(",") if s.strip()]

            self._hospitals[hospital_id] = copy.deepcopy(data)
            self._persist()
            return copy.deepcopy(data)

    def delete_hospital(self, hospital_id: str) -> bool:
        with self._lock:
            if hospital_id in self._hospitals:
                del self._hospitals[hospital_id]
                self._persist()
                return True
            return False

    def reset_to_defaults(self) -> None:
        """Reset state back to clean test defaults."""
        with self._lock:
            self._tourists = {t["TouristID"]: copy.deepcopy(t) for t in DEFAULT_TOURISTS}
            self._hospitals = {h["HospitalID"]: copy.deepcopy(h) for h in DEFAULT_HOSPITALS}
            self._persist()
