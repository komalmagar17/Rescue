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
        "Name": "Elena Rostova",
        "Age": 29,
        "BloodType": "O+",
        "Conditions": ["Asthma", "Mild Hypertension"],
        "Allergies": ["Penicillin", "Peanuts"],
        "EmergencyContacts": ["+1-555-0199 (Spouse - Mark)", "+1-555-0123 (Father - Viktor)"],
        "Language": "English, Russian",
        "Notes": "Carries emergency albuterol inhaler.",
        "LastUpdated": "2026-09-22T09:00:00Z",
    },
    {
        "TouristID": "T-1002",
        "Name": "Kenji Sato",
        "Age": 34,
        "BloodType": "A-",
        "Conditions": ["Type 1 Diabetes"],
        "Allergies": ["Latex", "Sulfa Drugs"],
        "EmergencyContacts": ["+81-90-1234-5678 (Sister - Yuko)"],
        "Language": "Japanese, English",
        "Notes": "Carries insulin pump on left abdominal quadrant.",
        "LastUpdated": "2026-09-22T09:00:00Z",
    },
    {
        "TouristID": "T-1003",
        "Name": "Maria Gonzalez",
        "Age": 42,
        "BloodType": "B+",
        "Conditions": ["Cardiac Arrhythmia"],
        "Allergies": ["Aspirin"],
        "EmergencyContacts": ["+34-600-112233 (Partner - Carlos)", "+34-600-445566 (Dr. Morales)"],
        "Language": "Spanish, English",
        "Notes": "History of supraventricular tachycardia.",
        "LastUpdated": "2026-09-22T09:00:00Z",
    },
    {
        "TouristID": "T-1004",
        "Name": "Arjun Patel",
        "Age": 67,
        "BloodType": "O-",
        "Conditions": ["Type 2 Diabetes", "History of Heatstroke"],
        "Allergies": ["None Reported"],
        "EmergencyContacts": ["+91-98765-43210 (Son - Rohan)"],
        "Language": "Hindi, English",
        "Notes": "Sensitive to high heat. Check electrolyte balance.",
        "LastUpdated": "2026-09-22T09:00:00Z",
    },
]

DEFAULT_HOSPITALS: List[Dict[str, Any]] = [
    {
        "HospitalID": "H-201",
        "Name": "City General ICU & Cardiology Center",
        "Latitude": 26.8500,
        "Longitude": 80.9500,
        "Services": ["ICU", "Cardiology", "Emergency Surgery", "Stroke Care"],
        "ContactInfo": "+91-522-234-5000 (ER Hotline)",
        "Capacity": 420,
    },
    {
        "HospitalID": "H-202",
        "Name": "Riverside Trauma & Orthopedic Hospital",
        "Latitude": 26.7800,
        "Longitude": 80.9200,
        "Services": ["Trauma Center Level 1", "Orthopedics", "Emergency Surgery", "Air Ambulance"],
        "ContactInfo": "+91-522-234-6000 (Trauma Desk)",
        "Capacity": 280,
    },
    {
        "HospitalID": "H-203",
        "Name": "Community Primary Care Clinic",
        "Latitude": 26.8200,
        "Longitude": 80.8800,
        "Services": ["General ER", "Basic First Aid"],
        "ContactInfo": "+91-522-234-7000",
        "Capacity": 60,
    },
    {
        "HospitalID": "H-204",
        "Name": "Alpine High-Altitude & Hyperbaric Center",
        "Latitude": 26.9000,
        "Longitude": 80.9800,
        "Services": ["Hyperbaric Medicine", "ICU", "Orthopedics", "Air Ambulance"],
        "ContactInfo": "+91-522-234-8000 (Helipad)",
        "Capacity": 150,
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
