"""One-shot loopback HTTPS integration smoke with synthetic-only AL-LMS V2.

Runs both local services, verifies the *real* Vite→FastAPI HTTPS transport,
then stops both and removes generated test credentials. Never contacts SMS/PG.
Requires frontend npm deps and backend development Python deps already installed.
"""

from __future__ import annotations

import os
import signal
import subprocess
import sys
import time
from pathlib import Path

import httpx

FRONT = Path(__file__).resolve().parents[1]
BASE = "https://127.0.0.1:15173"
API = f"{BASE}/api/v2/auth"
PHONE = "09120000001"  # hard-coded fictional fixture, never a user-entered phone
PASSWORD = "fictional-password-2026"


def expect(response: httpx.Response, status: int) -> dict:
    if response.status_code != status:
        raise AssertionError(f"Expected {status}, got {response.status_code} at {response.url}")
    return response.json() if status != 204 else {}


def main() -> None:
    launcher = subprocess.Popen(
        ["bash", "scripts/run_m3_auth_v2_local.sh"],
        cwd=FRONT,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        start_new_session=True,
        env=os.environ.copy(),
    )
    inbox: Path | None = None
    try:
        assert launcher.stdout is not None
        # The launcher prints its fake inbox path before the Vite readiness line.
        for line in launcher.stdout:
            if line.startswith("Read fake OTPs from the private inbox after requesting a code: "):
                inbox = Path(line.strip().split(": ", 1)[1])
            if line.startswith("Press Ctrl+C"):
                break
        if inbox is None:
            raise RuntimeError("synthetic launcher stopped before reporting its private test inbox")

        # The only intentionally unverified certificates belong to this fixed
        # loopback synthetic fixture. Never generalize verify=False to remote URLs.
        with httpx.Client(verify=False, trust_env=False, timeout=3.0) as client:
            deadline = time.monotonic() + 15
            while True:
                try:
                    csrf_response = client.get(f"{API}/csrf")
                    if csrf_response.status_code == 200:
                        break
                except httpx.RequestError:
                    pass
                if time.monotonic() >= deadline:
                    raise RuntimeError("local synthetic HTTPS proxy did not become ready")
                time.sleep(0.2)

            page = client.get(f"{BASE}/__preview/m3-auth/signup")
            if page.status_code != 200 or "<html" not in page.text.lower():
                raise AssertionError("Persian preview page did not load through local Vite HTTPS")

            def post(path: str, data: dict, csrf: str | None = None) -> httpx.Response:
                if csrf is None:
                    csrf = expect(client.get(f"{API}/csrf"), 200)["csrf_token"]
                return client.post(
                    f"{API}{path}",
                    json=data,
                    headers={"Origin": BASE, "X-CSRF-Token": csrf},
                )

            expect(client.get(f"{API}/me"), 401)
            signup = expect(post("/signup", {
                "phone": PHONE,
                "password": PASSWORD,
                "first_name": "آزمایشی",
                "last_name": "دانش‌آموز",
            }), 202)
            challenge = signup["challenge_id"]
            if "code" in signup or "token" in signup:
                raise AssertionError("OTP/session secret leaked into signup response")
            if not inbox.is_file() or inbox.stat().st_mode & 0o077:
                raise AssertionError("private fake-SMS inbox missing or permissions too broad")
            entry = inbox.read_text(encoding="utf-8").splitlines()[-1].split(" ")
            if entry[:2] != [challenge, "+989120000001"]:
                raise AssertionError("fake-SMS message did not match synthetic signup")
            code = entry[2]

            verified = expect(post("/phone/verify", {
                "challenge_id": challenge, "code": code,
            }), 200)
            if verified.get("phone_verified") is not True:
                raise AssertionError("synthetic phone was not verified")
            expect(client.get(f"{API}/me"), 401)  # no auto login

            account = expect(post("/signin/password", {"phone": PHONE, "password": PASSWORD}), 200)
            if account["account_id"] != verified["account_id"] or account["role"] != "student":
                raise AssertionError("synthetic identity or role changed between journeys")
            if "token" in account:
                raise AssertionError("session secret leaked into password signin response")
            if expect(client.get(f"{API}/me"), 200)["account_id"] != account["account_id"]:
                raise AssertionError("session cookie was not accepted through Vite HTTPS proxy")

            expect(post("/logout", {}), 204)
            expect(client.get(f"{API}/me"), 401)
            expect(post("/signin/otp/request", {"phone": PHONE}), 429)  # 60s cooldown
            recovery = expect(post("/recovery/requests", {"phone": PHONE}), 202)
            if not recovery.get("case_id"):
                raise AssertionError("support-assisted recovery request missing tracking id")
            if len(inbox.read_text(encoding="utf-8").splitlines()) != 1:
                raise AssertionError("recovery unexpectedly sent an SMS")

        print("PASS: live loopback HTTPS Vite→FastAPI synthetic signup, fake OTP, session, logout, recovery")
        print("PASS: 60s OTP cooldown and no auto-login, account role escalation, or token in JSON")
    finally:
        if launcher.poll() is None:
            launcher.send_signal(signal.SIGINT)
        try:
            launcher.communicate(timeout=10)
        except subprocess.TimeoutExpired:
            # The launcher is a dedicated process group created just for this
            # local synthetic acceptance command; terminate it if it stalled.
            os.killpg(launcher.pid, signal.SIGTERM)
            launcher.communicate(timeout=5)
        if inbox is not None and inbox.parent.exists():
            raise AssertionError("synthetic launcher left private test state behind")


if __name__ == "__main__":
    try:
        main()
    except (AssertionError, RuntimeError, httpx.HTTPError, OSError) as error:
        print(f"FAIL: {error}", file=sys.stderr)
        sys.exit(1)
