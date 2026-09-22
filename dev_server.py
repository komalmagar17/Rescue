#!/usr/bin/env python3
"""
Emergency Passport — Local Development & Demo Server
Serves the frontend static UI and forwards API requests directly to the Lambda handler.
Zero external dependencies required (uses standard library http.server).

Run with:
    python dev_server.py
    # or
    python3 dev_server.py --port 3000
"""

import argparse
import json
import logging
import mimetypes
import os
import sys
import urllib.parse
from http.server import BaseHTTPRequestHandler, HTTPServer

# Add repo root to python path
REPO_ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, REPO_ROOT)

def load_env():
    """Load key-value pairs from .env into os.environ if not already set."""
    env_path = os.path.join(REPO_ROOT, ".env")
    if os.path.exists(env_path):
        try:
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith("#") or "=" not in line:
                        continue
                    k, v = line.split("=", 1)
                    k = k.strip()
                    v = v.strip().strip('"').strip("'")
                    if k and k not in os.environ:
                        os.environ[k] = v
        except Exception as e:
            sys.stderr.write(f"[!] Warning reading .env: {e}\n")

load_env()

from src.emergency_handler.app import lambda_handler
from src.db.repository import db_repository

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("DevServer")

PUBLIC_DIR = os.path.join(REPO_ROOT, "public")


class EmergencyPassportHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        # Clean logging
        sys.stderr.write(f"[{self.log_date_time_string()}] {self.command} {self.path} - {format % args}\n")

    def _serve_static_file(self, rel_path: str):
        if rel_path == "" or rel_path == "/":
            rel_path = "index.html"
        else:
            rel_path = rel_path.lstrip("/")

        file_path = os.path.join(PUBLIC_DIR, rel_path)
        if not os.path.exists(file_path) or os.path.isdir(file_path):
            file_path = os.path.join(PUBLIC_DIR, "index.html")

        content_type, _ = mimetypes.guess_type(file_path)
        if not content_type:
            content_type = "text/plain"

        try:
            with open(file_path, "rb") as f:
                content = f.read()

            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(content)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(f"Error reading file: {e}".encode("utf-8"))

    def _dispatch_lambda(self, method: str):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        query_str = parsed_url.query

        # Query parameters dict
        query_params = {}
        if query_str:
            raw_queries = urllib.parse.parse_qs(query_str)
            query_params = {k: v[0] if len(v) == 1 else v for k, v in raw_queries.items()}

        # Read body if present
        body = None
        content_length = self.headers.get("Content-Length")
        if content_length:
            try:
                body = self.rfile.read(int(content_length)).decode("utf-8")
            except Exception:
                body = None

        # Build HTTP API v2 Event
        event = {
            "version": "2.0",
            "routeKey": f"{method} {path}",
            "rawPath": path,
            "rawQueryString": query_str,
            "headers": dict(self.headers),
            "queryStringParameters": query_params,
            "requestContext": {
                "http": {
                    "method": method,
                    "path": path,
                    "protocol": "HTTP/1.1",
                    "sourceIp": self.client_address[0],
                }
            },
            "body": body,
            "isBase64Encoded": False,
        }

        # Invoke Lambda Handler
        result = lambda_handler(event, None)
        status_code = result.get("statusCode", 200)
        resp_headers = result.get("headers", {})
        resp_body = result.get("body", "")

        self.send_response(status_code)
        for h_key, h_val in resp_headers.items():
            self.send_header(h_key, h_val)
        self.send_header("Content-Length", str(len(resp_body.encode("utf-8"))))
        self.end_headers()
        self.wfile.write(resp_body.encode("utf-8"))

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        # Check if API route
        if parsed.path.startswith(("/health", "/tourists", "/hospitals", "/emergency", "/alerts")):
            self._dispatch_lambda("GET")
        else:
            self._serve_static_file(parsed.path)

    def do_HEAD(self):
        self.do_GET()

    def do_POST(self):
        self._dispatch_lambda("POST")

    def do_PUT(self):
        self._dispatch_lambda("PUT")

    def do_DELETE(self):
        self._dispatch_lambda("DELETE")

    def do_OPTIONS(self):
        self._dispatch_lambda("OPTIONS")


def run_server(port: int = 3000):
    server_address = ("", port)
    httpd = HTTPServer(server_address, EmergencyPassportHandler)
    db_info = db_repository.get_info()

    groq_key = os.environ.get("GROQ_API_KEY")
    groq_model = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")
    if groq_key:
        masked_key = groq_key[:8] + "..." + groq_key[-4:] if len(groq_key) > 12 else "Configured"
        ai_status = f"GROQ AI ({groq_model}, Key: {masked_key})"
    else:
        ai_status = "Clinical Algorithm (Add GROQ_API_KEY in .env for Llama 3)"

    print("=" * 65)
    print("      🚑 EMERGENCY PASSPORT — LOCAL PRODUCTION SERVER 🌍    ")
    print("=" * 65)
    print(f"  Server URL:        http://localhost:{port}")
    print(f"  Active Database:   {db_info['active_backend'].upper()}")
    print(f"  AI Triage Engine:  {ai_status}")
    print(f"  Supabase Config:   {'Configured' if db_info['supabase_configured'] else 'Not set (using zero-config local engine)'}")
    print(f"  DynamoDB Status:   {'Available' if db_info['dynamo_available'] else 'Not active'}")
    print("=" * 65)
    print("  Endpoints Available:")
    print(f"    • UI Web App:    http://localhost:{port}/")
    print(f"    • Health Check:  http://localhost:{port}/health")
    print(f"    • Tourists API:  http://localhost:{port}/tourists")
    print(f"    • Hospitals API: http://localhost:{port}/hospitals")
    print(f"    • Emergency API: http://localhost:{port}/emergency?tourist_id=T-1001")
    print(f"    • Disaster Alert: http://localhost:{port}/alerts")
    print("=" * 65)
    print("  Press Ctrl+C to stop the server.\n")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[!] Shutting down Emergency Passport server...")
        httpd.server_close()
        sys.exit(0)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Start Emergency Passport local server")
    parser.add_argument("--port", type=int, default=3000, help="Port to listen on (default: 3000)")
    args = parser.parse_args()
    run_server(args.port)
