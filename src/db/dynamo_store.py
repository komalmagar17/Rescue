"""
DynamoDB client implementation for Emergency Passport.
Encapsulates AWS DynamoDB operations with safe fallback and error handling.
"""

import logging
import os
from decimal import Decimal
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)

try:
    import boto3
    from botocore.exceptions import ClientError, NoCredentialsError
except ImportError:
    boto3 = None
    ClientError = Exception
    NoCredentialsError = Exception


class DynamoStore:
    def __init__(
        self,
        tourists_table: Optional[str] = None,
        hospitals_table: Optional[str] = None,
        region: Optional[str] = None,
    ):
        self.tourists_table_name = tourists_table or os.environ.get("TOURIST_PROFILES_TABLE", "TouristProfiles")
        self.hospitals_table_name = hospitals_table or os.environ.get("HOSPITALS_TABLE", "Hospitals")
        self.region = region or os.environ.get("AWS_REGION", "us-east-1")
        self._dynamodb = None
        self._init_client()

    def _init_client(self) -> None:
        if boto3 is None:
            logger.info("boto3 not installed, DynamoStore unavailable")
            return
        try:
            self._dynamodb = boto3.resource("dynamodb", region_name=self.region)
        except Exception as e:
            logger.warning("Could not initialize DynamoDB resource: %s", e)
            self._dynamodb = None

    def is_available(self) -> bool:
        if not self._dynamodb:
            return False
        # If running inside AWS Lambda (AWS_EXECUTION_ENV is set) or credentials are configured
        if os.environ.get("AWS_EXECUTION_ENV"):
            return True
        if os.environ.get("AWS_ACCESS_KEY_ID") and os.environ.get("AWS_SECRET_ACCESS_KEY"):
            return True
        return False

    @staticmethod
    def _convert_item(item: Dict[str, Any]) -> Dict[str, Any]:
        """Convert Decimal and set types to standard JSON-serializable Python types."""
        result = {}
        for k, v in item.items():
            if isinstance(v, Decimal):
                result[k] = float(v) if "." in str(v) else int(v)
            elif isinstance(v, set):
                result[k] = sorted(list(v))
            else:
                result[k] = v
        return result

    @staticmethod
    def _prepare_item_for_dynamo(item: Dict[str, Any]) -> Dict[str, Any]:
        """Prepare item for DynamoDB put_item (non-empty sets, etc.)."""
        result = {}
        for k, v in item.items():
            if isinstance(v, set):
                result[k] = v if len(v) > 0 else {"None Reported"}
            elif isinstance(v, list):
                # If list of strings, can be stored as list or string set if non-empty
                result[k] = v
            elif isinstance(v, float):
                result[k] = Decimal(str(v))
            else:
                result[k] = v
        return result

    def get_tourist(self, tourist_id: str) -> Optional[Dict[str, Any]]:
        if not self._dynamodb:
            return None
        try:
            table = self._dynamodb.Table(self.tourists_table_name)
            resp = table.get_item(Key={"TouristID": tourist_id})
            item = resp.get("Item")
            return self._convert_item(item) if item else None
        except Exception as e:
            logger.warning("DynamoDB get_item error: %s", e)
            return None

    def list_tourists(self) -> List[Dict[str, Any]]:
        if not self._dynamodb:
            return []
        try:
            table = self._dynamodb.Table(self.tourists_table_name)
            resp = table.scan()
            return [self._convert_item(i) for i in resp.get("Items", [])]
        except Exception as e:
            logger.warning("DynamoDB scan tourists error: %s", e)
            return []

    def save_tourist(self, data: Dict[str, Any]) -> Dict[str, Any]:
        if not self._dynamodb:
            raise RuntimeError("DynamoDB not available")
        table = self._dynamodb.Table(self.tourists_table_name)
        prepared = self._prepare_item_for_dynamo(data)
        table.put_item(Item=prepared)
        return self._convert_item(prepared)

    def delete_tourist(self, tourist_id: str) -> bool:
        if not self._dynamodb:
            return False
        try:
            table = self._dynamodb.Table(self.tourists_table_name)
            table.delete_item(Key={"TouristID": tourist_id})
            return True
        except Exception as e:
            logger.warning("DynamoDB delete_item error: %s", e)
            return False

    def get_hospital(self, hospital_id: str) -> Optional[Dict[str, Any]]:
        if not self._dynamodb:
            return None
        try:
            table = self._dynamodb.Table(self.hospitals_table_name)
            resp = table.get_item(Key={"HospitalID": hospital_id})
            item = resp.get("Item")
            return self._convert_item(item) if item else None
        except Exception as e:
            logger.warning("DynamoDB get_hospital error: %s", e)
            return None

    def list_hospitals(self) -> List[Dict[str, Any]]:
        if not self._dynamodb:
            return []
        try:
            table = self._dynamodb.Table(self.hospitals_table_name)
            resp = table.scan()
            return [self._convert_item(i) for i in resp.get("Items", [])]
        except Exception as e:
            logger.warning("DynamoDB scan hospitals error: %s", e)
            return []

    def save_hospital(self, data: Dict[str, Any]) -> Dict[str, Any]:
        if not self._dynamodb:
            raise RuntimeError("DynamoDB not available")
        table = self._dynamodb.Table(self.hospitals_table_name)
        prepared = self._prepare_item_for_dynamo(data)
        table.put_item(Item=prepared)
        return self._convert_item(prepared)
