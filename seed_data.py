#!/usr/bin/env python3
"""Seed script for Emergency Passport DynamoDB tables.

Populates TouristProfiles and Hospitals tables with sample records.
Uses boto3 and formats attributes (including DynamoDB String Sets and Decimals).
"""

import argparse
from datetime import datetime, timezone
from decimal import Decimal
import os
import sys
from typing import Any, Dict, List

try:
    import boto3
    from botocore.exceptions import ClientError, NoCredentialsError
except ImportError:
    boto3 = None
    ClientError = None
    NoCredentialsError = None


# ==============================================================================
# Sample Data Definitions
# ==============================================================================

SAMPLE_TOURISTS: List[Dict[str, Any]] = [
    {
        "TouristID": "T-1001",
        "Name": "Aarav Sharma",
        "Age": 29,
        "BloodType": "O+",
        "Conditions": {"Asthma", "Mild Hypertension"},
        "Allergies": {"Penicillin", "Peanuts"},
        "EmergencyContacts": {"+91 98201 44521 (Spouse - Priya Sharma)", "+91 98110 99214 (Father - Vikram Sharma)"},
        "Language": "Hindi, English",
        "LastUpdated": datetime.now(timezone.utc).isoformat(),
    },
    {
        "TouristID": "T-1002",
        "Name": "Rohan Kulkarni",
        "Age": 34,
        "BloodType": "A-",
        "Conditions": {"Type 1 Diabetes"},
        "Allergies": {"Latex", "Sulfa Drugs"},
        "EmergencyContacts": {"+91 98220 81190 (Sister - Neha Kulkarni)"},
        "Language": "Marathi, Hindi, English",
        "LastUpdated": datetime.now(timezone.utc).isoformat(),
    },
    {
        "TouristID": "T-1003",
        "Name": "Ananya Iyer",
        "Age": 26,
        "BloodType": "B+",
        "Conditions": {"Cardiac Arrhythmia", "Epilepsy"},
        "Allergies": {"Aspirin", "Ibuprofen"},
        "EmergencyContacts": {"+91 94440 23118 (Brother - Siddharth Iyer)", "+91 94441 55667 (Dr. K. Swaminathan)"},
        "Language": "Tamil, Hindi, English",
        "LastUpdated": datetime.now(timezone.utc).isoformat(),
    },
    {
        "TouristID": "T-1004",
        "Name": "Arjun Patel",
        "Age": 67,
        "BloodType": "O-",
        "Conditions": {"Type 2 Diabetes", "Coronary Artery Disease"},
        "Allergies": {"Iodine Contrast"},
        "EmergencyContacts": {"+91 98765 43210 (Son - Devansh Patel)"},
        "Language": "Gujarati, Hindi, English",
        "LastUpdated": datetime.now(timezone.utc).isoformat(),
    },
]

SAMPLE_HOSPITALS: List[Dict[str, Any]] = [
    {
        "HospitalID": "H-201",
        "Name": "AIIMS New Delhi — Apex Trauma Centre",
        "Latitude": Decimal("28.5672"),
        "Longitude": Decimal("77.2100"),
        "Services": {"Trauma Center Level 1", "ICU", "Cardiology", "Emergency Surgery", "Stroke Care", "Burn Unit"},
        "ContactInfo": "+91-11-2659-3677 (24x7 Apex Trauma Command)",
        "Capacity": 550,
    },
    {
        "HospitalID": "H-202",
        "Name": "Apollo Hospital Speciality & Critical Care",
        "Latitude": Decimal("28.5368"),
        "Longitude": Decimal("77.2917"),
        "Services": {"ICU", "Neurosurgery", "Cardiology", "Organ Transplant", "Air Ambulance"},
        "ContactInfo": "+91-11-2692-5858 (Emergency Dispatch)",
        "Capacity": 480,
    },
    {
        "HospitalID": "H-203",
        "Name": "Max Super Speciality Hospital (Saket Trauma Hub)",
        "Latitude": Decimal("28.5283"),
        "Longitude": Decimal("77.2115"),
        "Services": {"Emergency Surgery", "Cardiology", "Intensive Stroke Unit", "Level 1 Trauma"},
        "ContactInfo": "+91-11-2651-5050 (Saket ER Helpline)",
        "Capacity": 320,
    },
    {
        "HospitalID": "H-204",
        "Name": "Safdarjung Hospital Emergency & Burns Block",
        "Latitude": Decimal("28.5700"),
        "Longitude": Decimal("77.2080"),
        "Services": {"Trauma Center Level 1", "Burn Care", "Pediatric Emergency", "ICU"},
        "ContactInfo": "+91-11-2616-5060 (Emergency Desk)",
        "Capacity": 600,
    },
]


# ==============================================================================
# Seeding Logic
# ==============================================================================

def print_record_summary(table_name: str, item_id: str, item_data: Dict[str, Any]) -> None:
    """Print a clean preview of an item."""
    print(f"  [+] [{table_name}] ID: {item_id}")
    for k, v in item_data.items():
        if isinstance(v, set):
            print(f"      - {k} (StringSet): {sorted(list(v))}")
        else:
            print(f"      - {k}: {v}")


def seed_table(
    dynamodb_resource: Any,
    table_name: str,
    items: List[Dict[str, Any]],
    id_key: str,
    dry_run: bool = False,
) -> None:
    """Seed items into a specific DynamoDB table."""
    print(f"\nSeeding table '{table_name}' ({len(items)} items)...")

    if dry_run:
        print("  [DRY RUN] No database writes performed. Items to be inserted:")
        for item in items:
            print_record_summary(table_name, str(item.get(id_key)), item)
        return

    table = dynamodb_resource.Table(table_name)

    # Verify table existence
    try:
        table.load()
    except NoCredentialsError:
        print("  [!] ERROR: Unable to locate AWS credentials.")
        print("      Configure credentials with 'aws configure' or set AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.")
        print("      To preview data without credentials, run: python seed_data.py --dry-run")
        sys.exit(1)
    except ClientError as e:
        error_code = e.response.get("Error", {}).get("Code")
        if error_code == "ResourceNotFoundException":
            print(f"  [!] ERROR: Table '{table_name}' does not exist in region.")
            print("      Please deploy your SAM template first: `sam deploy --guided`")
            sys.exit(1)
        raise

    for item in items:
        # Sanitize item: convert empty sets to None or non-empty sets
        sanitized_item = {}
        for k, v in item.items():
            if isinstance(v, set) and len(v) == 0:
                sanitized_item[k] = {"None Reported"}
            else:
                sanitized_item[k] = v

        item_id = str(sanitized_item.get(id_key))
        try:
            table.put_item(Item=sanitized_item)
            print(f"  [OK] Inserted {id_key}={item_id} ({sanitized_item.get('Name')})")
        except ClientError as e:
            print(f"  [FAIL] Failed inserting {id_key}={item_id}: {e}")
            raise


def main() -> None:
    """CLI parser and seed coordinator."""
    parser = argparse.ArgumentParser(
        description="Seed sample data for Emergency Passport DynamoDB tables."
    )
    parser.add_argument(
        "--tourists-table",
        default=os.environ.get("TOURIST_PROFILES_TABLE", "TouristProfiles"),
        help="Name of TouristProfiles table (default: TouristProfiles or $TOURIST_PROFILES_TABLE)",
    )
    parser.add_argument(
        "--hospitals-table",
        default=os.environ.get("HOSPITALS_TABLE", "Hospitals"),
        help="Name of Hospitals table (default: Hospitals or $HOSPITALS_TABLE)",
    )
    parser.add_argument(
        "--region",
        default=os.environ.get("AWS_REGION", os.environ.get("AWS_DEFAULT_REGION", "us-east-1")),
        help="AWS Region (default: us-east-1 or $AWS_REGION)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview sample records without writing to AWS DynamoDB",
    )

    args = parser.parse_args()

    print("==================================================")
    print("      Emergency Passport - DynamoDB Data Seeder    ")
    print("==================================================")
    print(f"Region:          {args.region}")
    print(f"Tourists Table:  {args.tourists_table}")
    print(f"Hospitals Table: {args.hospitals_table}")
    print(f"Dry Run:         {args.dry_run}")
    print("==================================================")

    if not args.dry_run:
        if boto3 is None:
            print("[!] boto3 is not installed. Please run: pip install boto3")
            sys.exit(1)
        try:
            dynamodb = boto3.resource("dynamodb", region_name=args.region)
        except NoCredentialsError:
            print("[!] AWS credentials not found.")
            print("    Configure credentials with `aws configure` or pass `--dry-run` to preview data.")
            sys.exit(1)
    else:
        dynamodb = None

    # Seed TouristProfiles table
    seed_table(
        dynamodb_resource=dynamodb,
        table_name=args.tourists_table,
        items=SAMPLE_TOURISTS,
        id_key="TouristID",
        dry_run=args.dry_run,
    )

    # Seed Hospitals table
    seed_table(
        dynamodb_resource=dynamodb,
        table_name=args.hospitals_table,
        items=SAMPLE_HOSPITALS,
        id_key="HospitalID",
        dry_run=args.dry_run,
    )

    print("\n[OK] Data seeding process finished successfully!")


if __name__ == "__main__":
    main()
