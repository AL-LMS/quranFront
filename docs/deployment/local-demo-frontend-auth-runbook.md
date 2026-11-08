# Local Demo Frontend Authentication Runbook

This runbook connects the development-only frontend authentication pages to the separate synthetic authentication API. It does not change the normal LMS login, SMS OTP, token handling, or production API routing.

## Prerequisites

- The backend local-demo Compose project is already running and healthy.
- The local-demo API is attached to its Compose project's internal network.
- Docker CLI access is available to the frontend development process.
- `127.0.0.1:15173` is free.
- Synthetic credentials are read privately from the backend worktree's mode-`0600` credential report. Do not paste them into terminal transcripts, issue trackers, screenshots, browser automation logs, or source files.

The frontend does not use the previously unreliable published API port. When the explicit development flag is enabled, Vite finds the single healthy `auth-api` container by Compose project/service labels, verifies its project network is internal, reads its current private address from Docker, and proxies only the auth API prefix to port `8000`. The container address is never pinned in source or browser configuration.

## Start the frontend

From the frontend worktree:

```sh
VITE_ENABLE_LOCAL_DEMO_AUTH=true \
AL_LMS_LOCAL_DEMO_COMPOSE_PROJECT=al-lms-local-03c-hostcheck \
npm run dev
```

When enabled, Vite binds strictly to `127.0.0.1:15173`; it exits if that port is occupied. Open <http://127.0.0.1:15173/local-demo/login>. Use an alias such as `student-01` or `teacher-01` and the matching synthetic credential from the private report. The public legacy routes `/login`, `/send-otp`, and `/check-otp` keep their existing behavior.

Local-demo routes:

- `/local-demo/login` — alias/password login.
- `/local-demo/otp` — request a synthetic OTP challenge and enter its six-digit code.
- `/local-demo/dashboard` — a minimal role-aware synthetic identity page. It does not expose course management, enrollment, payments, or real LMS data.

## Local OTP retrieval

The browser can create an OTP challenge but cannot reach the test inbox through Vite. The development middleware returns `404` for every browser request under `/api/local-demo/auth/v1/test-inbox/`. After the OTP page displays a challenge ID, retrieve its code from inside the API container using the Docker CLI:

```sh
AUTH_CONTAINER_ID=$(docker ps \
  --filter label=com.docker.compose.project=al-lms-local-03c-hostcheck \
  --filter label=com.docker.compose.service=auth-api \
  --format '{{.ID}}')
read -r -s -p 'Challenge ID: ' CHALLENGE_ID
printf '\n'
printf '%s\n' "$CHALLENGE_ID" | docker exec -i "$AUTH_CONTAINER_ID" python -c '
import json, sys, urllib.request
challenge = sys.stdin.readline().strip()
url = "http://127.0.0.1:8000/api/local-demo/auth/v1/test-inbox/" + challenge
with urllib.request.urlopen(url, timeout=5) as response:
    print(json.load(response)["code"])
'
unset CHALLENGE_ID AUTH_CONTAINER_ID
```

Enter the code in the frontend before the five-minute expiry. The inbox entry is one-use. Do not save or log the displayed OTP. This is a local synthetic delivery adapter; it does not send SMS or contact Kavenegar.

## Session and storage behavior

- Frontend calls use same-origin paths and `credentials: "include"`.
- The browser stores the API's HttpOnly, SameSite=Strict cookie; application JavaScript cannot read it.
- The frontend keeps only the returned synthetic alias and role in React memory.
- Passwords, OTPs, session tokens, and challenge IDs are not written to `localStorage` or `sessionStorage`.
- On route entry, the frontend restores session state with `GET /me`; it also rechecks an authenticated session every 60 seconds. A rejected/expired session returns the demo to its login page.
- Logout calls `POST /logout`; the server revokes the session and clears the cookie.

## Stop and verify

Stop the frontend with `Ctrl-C`. This does not stop the backend Compose project. No Compose teardown is needed to stop the frontend.

For a production-bundle isolation check:

```sh
npm run build
```

The build uses Vite production mode, so `VITE_ENABLE_LOCAL_DEMO_AUTH=true` does not register the local-demo routes or emit their dynamic module. The existing production API base URL and global Axios interceptor are unchanged.

## Security and limitations

- This is only a local development demonstration, not production authentication or authorization.
- The local auth API must remain on its private Compose network. Vite's local proxy target is dynamically inspected and must be private and internal.
- The test inbox is never proxied to browser users; use `docker exec` from the host workflow above.
- Dashboard content is deliberately limited to the synthetic identity and role. Existing dashboard components depend on legacy API/session contracts and are not represented as working under this cookie-auth service.
- Do not expose the Vite server to a LAN or public interface, enable this flag in a production build, reuse credentials, or connect this feature to real accounts, SMS, payment, or enrollment.
