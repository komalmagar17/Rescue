"""
Unified Data Repository for Emergency Passport.
Provides seamless switching between DynamoDB, Supabase, and LocalStore.
"""

import logging
import os
from typing import Any, Dict, List, Optional

from src.db.dynamo_store import DynamoStore
from src.db.local_store import LocalStore
from src.db.supabase_store import SupabaseStore

logger = logging.getLogger(__name__)


class DatabaseRepository:
    def __init__(self):
        self._local_store = LocalStore()
        self._supabase_store = SupabaseStore()
        self._dynamo_store = DynamoStore()

    def get_active_backend_name(self) -> str:
        explicit = os.environ.get("DB_BACKEND", "").lower()
        if explicit in ("dynamodb", "dynamo"):
            return "dynamodb"
        if explicit == "supabase":
            return "supabase"
        if explicit in ("local", "memory", "json"):
            return "local"

        # Auto-detection
        if self._supabase_store.is_configured():
            return "supabase"
        if self._dynamo_store.is_available():
            return "dynamodb"
        return "local"

    def get_info(self) -> Dict[str, Any]:
        backend = self.get_active_backend_name()
        return {
            "active_backend": backend,
            "supabase_configured": self._supabase_store.is_configured(),
            "dynamo_available": self._dynamo_store.is_available(),
            "tourist_table": self._dynamo_store.tourists_table_name,
            "hospitals_table": self._dynamo_store.hospitals_table_name,
        }

    # -----------------------------------------------------------------------
    # Tourist Profiles CRUD
    # -----------------------------------------------------------------------
    def get_tourist(self, tourist_id: str) -> Optional[Dict[str, Any]]:
        backend = self.get_active_backend_name()
        if backend == "supabase":
            try:
                res = self._supabase_store.get_tourist(tourist_id)
                if res:
                    return res
            except Exception as e:
                logger.warning("Supabase get_tourist failed: %s; falling back to local", e)

        elif backend == "dynamodb":
            try:
                res = self._dynamo_store.get_tourist(tourist_id)
                if res:
                    return res
            except Exception as e:
                logger.warning("DynamoDB get_tourist failed: %s; falling back to local", e)

        # Fallback to local store
        return self._local_store.get_tourist(tourist_id)

    def list_tourists(self) -> List[Dict[str, Any]]:
        backend = self.get_active_backend_name()
        if backend == "supabase":
            try:
                return self._supabase_store.list_tourists()
            except Exception as e:
                logger.warning("Supabase list_tourists failed: %s; falling back to local", e)

        elif backend == "dynamodb":
            try:
                items = self._dynamo_store.list_tourists()
                if items:
                    return items
            except Exception as e:
                logger.warning("DynamoDB list_tourists failed: %s; falling back to local", e)

        return self._local_store.list_tourists()

    def save_tourist(self, data: Dict[str, Any]) -> Dict[str, Any]:
        backend = self.get_active_backend_name()
        if backend == "supabase":
            try:
                saved = self._supabase_store.save_tourist(data)
                self._local_store.save_tourist(saved)  # Mirror locally
                return saved
            except Exception as e:
                logger.warning("Supabase save_tourist failed: %s; saving locally", e)

        elif backend == "dynamodb":
            try:
                saved = self._dynamo_store.save_tourist(data)
                self._local_store.save_tourist(saved)  # Mirror locally
                return saved
            except Exception as e:
                logger.warning("DynamoDB save_tourist failed: %s; saving locally", e)

        return self._local_store.save_tourist(data)

    def delete_tourist(self, tourist_id: str) -> bool:
        backend = self.get_active_backend_name()
        if backend == "supabase":
            try:
                self._supabase_store.delete_tourist(tourist_id)
            except Exception as e:
                logger.warning("Supabase delete_tourist error: %s", e)
        elif backend == "dynamodb":
            try:
                self._dynamo_store.delete_tourist(tourist_id)
            except Exception as e:
                logger.warning("DynamoDB delete_tourist error: %s", e)

        return self._local_store.delete_tourist(tourist_id)

    # -----------------------------------------------------------------------
    # Hospitals Directory CRUD
    # -----------------------------------------------------------------------
    def get_hospital(self, hospital_id: str) -> Optional[Dict[str, Any]]:
        backend = self.get_active_backend_name()
        if backend == "supabase":
            try:
                res = self._supabase_store.get_hospital(hospital_id)
                if res:
                    return res
            except Exception as e:
                logger.warning("Supabase get_hospital failed: %s; falling back to local", e)

        elif backend == "dynamodb":
            try:
                res = self._dynamo_store.get_hospital(hospital_id)
                if res:
                    return res
            except Exception as e:
                logger.warning("DynamoDB get_hospital failed: %s; falling back to local", e)

        return self._local_store.get_hospital(hospital_id)

    def list_hospitals(self) -> List[Dict[str, Any]]:
        backend = self.get_active_backend_name()
        if backend == "supabase":
            try:
                items = self._supabase_store.list_hospitals()
                if items:
                    return items
            except Exception as e:
                logger.warning("Supabase list_hospitals failed: %s; falling back to local", e)

        elif backend == "dynamodb":
            try:
                items = self._dynamo_store.list_hospitals()
                if items:
                    return items
            except Exception as e:
                logger.warning("DynamoDB list_hospitals failed: %s; falling back to local", e)

        return self._local_store.list_hospitals()

    def save_hospital(self, data: Dict[str, Any]) -> Dict[str, Any]:
        backend = self.get_active_backend_name()
        if backend == "supabase":
            try:
                saved = self._supabase_store.save_hospital(data)
                self._local_store.save_hospital(saved)
                return saved
            except Exception as e:
                logger.warning("Supabase save_hospital failed: %s; saving locally", e)

        elif backend == "dynamodb":
            try:
                saved = self._dynamo_store.save_hospital(data)
                self._local_store.save_hospital(saved)
                return saved
            except Exception as e:
                logger.warning("DynamoDB save_hospital failed: %s; saving locally", e)

        return self._local_store.save_hospital(data)

    def delete_hospital(self, hospital_id: str) -> bool:
        backend = self.get_active_backend_name()
        if backend == "supabase":
            try:
                self._supabase_store.delete_tourist(hospital_id)
            except Exception as e:
                logger.warning("Supabase delete_hospital error: %s", e)
        elif backend == "dynamodb":
            try:
                self._dynamo_store.delete_tourist(hospital_id)
            except Exception as e:
                logger.warning("DynamoDB delete_hospital error: %s", e)

        return self._local_store.delete_hospital(hospital_id)


db_repository = DatabaseRepository()
