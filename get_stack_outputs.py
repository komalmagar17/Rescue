#!/usr/bin/env python3
"""Helper script to describe Emergency Passport CloudFormation stack outputs."""

import argparse
import json
import os
import sys

try:
    import boto3
    from botocore.exceptions import ClientError, NoCredentialsError
except ImportError:
    print("[!] boto3 is not installed. Please run: pip install boto3")
    sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Get CloudFormation stack outputs.")
    parser.add_argument("--stack-name", default="emergency-passport", help="CloudFormation stack name")
    parser.add_argument(
        "--region",
        default=os.environ.get("AWS_REGION", os.environ.get("AWS_DEFAULT_REGION", "us-east-1")),
        help="AWS region (default: us-east-1)",
    )
    args = parser.parse_args()

    try:
        cfn = boto3.client("cloudformation", region_name=args.region)
        response = cfn.describe_stacks(StackName=args.stack_name)
        stacks = response.get("Stacks", [])
        if not stacks:
            print(f"[!] Stack '{args.stack_name}' not found in region {args.region}.")
            sys.exit(1)

        outputs = stacks[0].get("Outputs", [])
        print(json.dumps(outputs, indent=2))

    except NoCredentialsError:
        print("[!] ERROR: Unable to locate AWS credentials.")
        print("    Please set your credentials before querying the stack:")
        print('    $env:AWS_ACCESS_KEY_ID = "your-access-key"')
        print('    $env:AWS_SECRET_ACCESS_KEY = "your-secret-key"')
        print('    $env:AWS_DEFAULT_REGION = "us-east-1"')
        sys.exit(1)
    except ClientError as e:
        error_code = e.response.get("Error", {}).get("Code")
        error_msg = e.response.get("Error", {}).get("Message")
        print(f"[!] AWS Error ({error_code}): {error_msg}")
        sys.exit(1)


if __name__ == "__main__":
    main()
