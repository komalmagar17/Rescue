"""
Supabase REST client for Emergency Passport.
Uses standard library urllib.request for zero external dependencies.
"""

import json
import logging
import os
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class SupabaseStore:
    def __init__(self, url: Optional[str] = None, key: Optional[str] = None):
        self.url = (url or os.environ.get("SUPABASE_URL", "")).rstrip("/")
        self.key = key or os.environ.get("SUPABASE_KEY", os.environ.get("SUPABASE_SERVICE_ROLE_KEY", ""))

    def is_configured(self) -> bool:
        return bool(self.url and self.key)

    def _request(
        self,
        endpoint: str,
        method: str = "GET",
        params: Optional[Dict[str, str]] = None,
        data: Optional[Any] = None,
        prefer: Optional[str] = None,
    ) -> Any:
        query_str = f"?{urllib.parse.urlencode(params)}" if params else ""
        req_url = f"{self.url}/rest/v1/{endpoint}{query_str}"

        headers = {
            "apikey": self.key,
            "Authorization": f"Bearer {self.key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        if prefer:
            headers["Prefer"] = prefer

        body_bytes = json.dumps(data).encode("utf-8") if data is not None else None
        req = urllib.request.Request(req_url, data=body_bytes, headers=headers, method=method)

        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                content = resp.read().decode("utf-8")
                if content:
                    return json.loads(content)
                return []
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="ignore")
            logger.error("Supabase API error %s on %s: %s", e.code, req_url, err_body)
            raise RuntimeError(f"Supabase error {e.code}: {err_body}") from e
        except Exception as e:
            logger.error("Supabase request failed: %s", e)
            raise

    # Adapter mapping functions between camelCase / DynamoDB format and Supabase snake_case
    @staticmethod
    def _to_supabase_tourist(item: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "tourist_id": item.get("TouristID"),
            "name": item.get("Name"),
            "age": int(item.get("Age", 0)),
            "blood_type": item.get("BloodType"),
            "conditions": list(item.get("Conditions", [])),
            "allergies": list(item.get("Allergies", [])),
            "emergency_contacts": list(item.get("EmergencyContacts", [])),
            "language": item.get("Language", "English"),
            "notes": item.get("Notes", ""),
        }

    @staticmethod
    def _from_supabase_tourist(row: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "TouristID": row.get("tourist_id"),
            "Name": row.get("name"),
            "Age": row.get("age"),
            "BloodType": row.get("blood_type"),
            "Conditions": row.get("conditions") or [],
            "Allergies": row.get("allergies") or [],
            "EmergencyContacts": row.get("emergency_contacts") or [],
            "Language": row.get("language") or "English",
            "Notes": row.get("notes") or "",
            "LastUpdated": row.get("last_updated") or row.get("created_at"),
        }

    @staticmethod
    def _to_supabase_hospital(item: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "hospital_id": item.get("HospitalID"),
            "name": item.get("Name"),
            "latitude": float(item.get("Latitude", 0)),
            "longitude": float(item.get("Longitude", 0)),
            "services": list(item.get("Services", [])),
            "contact_info": item.get("ContactInfo"),
            "capacity": int(item.get("Capacity", 0)),
        }

    @staticmethod
    def _from_supabase_hospital(row: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "HospitalID": row.get("hospital_id"),
            "Name": row.get("name"),
            "Latitude": float(row.get("latitude", 0)),
            "Longitude": float(row.get("longitude", 0)),
            "Services": row.get("services") or [],
            "ContactInfo": row.get("contact_info") or "",
            "Capacity": row.get("capacity") or 0,
            "LastUpdated": row.get("last_updated") or row.get("created_at"),
        }

    def get_tourist(self, tourist_id: str) -> Optional[Dict[str, Any]]:
        rows = self._request("tourist_profiles", params={"tourist_id": f"eq.{tourist_id}", "select": "*"})
        if rows and len(rows) > 0:
            return self._from_supabase_tourist(rows[0])
        return None

    def list_tourists(self) -> List[Dict[str, Any]]:
        rows = self._request("tourist_profiles", params={"select": "*"})
        return [self._from_supabase_tourist(r) for r in rows]

    def save_tourist(self, data: Dict[str, Any]) -> Dict[str, Any]:
        payload = self._to_supabase_tourist(data)
        rows = self._request(
            "tourist_profiles",
            method="POST",
            data=payload,
            prefer="resolution=merge-duplicates,return=representation",
        )
        if rows and len(rows) > 0:
            return self._from_supabase_tourist(rows[0])
        return data

    def delete_tourist(self, tourist_id: str) -> bool:
        self._request("tourist_profiles", method="DELETE", params={"tourist_id": f"eq.{tourist_id}"})
        return True

    def get_hospital(self, hospital_id: str) -> Optional[Dict[str, Any]]:
        rows = self._request("hospitals", params={"hospital_id": f"eq.{hospital_id}", "select": "*"})
        if rows and len(rows) > 0:
            return self._from_supabase_hospital(rows[0])
        return None

    def list_hospitals(self) -> List[Dict[str, Any]]:
        rows = self._request("hospitals", params={"select": "*"})
        return [self._from_supabase_hospital(r) for r in rows]

    def save_hospital(self, data: Dict[str, Any]) -> Dict[str, Any]:
        payload = self._to_supabase_hospital(data)
        rows = self._request(
            "hospitals",
            method="POST",
            data=payload,
            prefer="resolution=merge-duplicates,return=representation",
        )
        if rows and len(rows) > 0:
            return self._from_supabase_hospital(rows[0])
        return data
