# Local Demo Frontend Authentication Runbook

This runbook connects the development-only frontend authentication pages to the synthetic authentication API in the isolated local-demo backend. It does not change the normal LMS login, SMS OTP, token handling, or production API routing.

## Demo services and prerequisites

The verified demo Compose project is `al-lms-local-04g-20261109`. Its only long-running services are the task-owned `postgres` and `auth-api` containers. They share the project's internal network; PostgreSQL and the API have no published host ports. The frontend browser never connects directly to the Docker network.

Prerequisites:

- The backend's task-owned PostgreSQL and auth API containers exist, carry the `al-lms-local-04g-20261109` Compose project labels, and are healthy.
- Docker CLI access is available to the Vite development process so it can inspect those labels and the private network.
- `127.0.0.1:15173` is free.
- Synthetic credentials are kept only in `/tmp/al-lms-local-04g-20261109/account-secrets/accounts.tsv`. The containing directory is mode `0700`; the report is mode `0600`. Do not print, copy into shell history, or place credentials in transcripts, screenshots, browser automation logs, issue trackers, or source files.

The Vite development configuration discovers exactly one healthy `auth-api` by Compose project and service labels. It inspects the container and its project-owned internal network, then resolves the current private container address dynamically. It proxies only `/api/local-demo/auth/v1` to the API's container port. The address is not pinned in source or sent to the browser. Browser requests remain same-origin and use the API's HttpOnly cookie.

## Start the task-owned backend services

Start only the existing containers for this demo. These commands do not create containers or volumes. They verify Compose ownership before starting either service and wait for PostgreSQL health before starting the API.

```sh
local_demo_start_backend() {
  set +x
  local project=al-lms-local-04g-20261109
  local postgres="${project}-postgres-1"
  local auth_api="${project}-auth-api-1" owner

  owner="$(docker inspect --format '{{ index .Config.Labels "com.docker.compose.project" }} {{ index .Config.Labels "com.docker.compose.service" }}' "$postgres")" || return 1
  if test "$owner" != "$project postgres"; then echo 'PostgreSQL ownership check failed' >&2; return 1; fi
  owner="$(docker inspect --format '{{ index .Config.Labels "com.docker.compose.project" }} {{ index .Config.Labels "com.docker.compose.service" }}' "$auth_api")" || return 1
  if test "$owner" != "$project auth-api"; then echo 'API ownership check failed' >&2; return 1; fi

  if test "$(docker inspect --format '{{.State.Running}}' "$postgres")" != true; then
    docker start "$postgres" >/dev/null || return 1
  fi
  local attempt=0
  until test "$(docker inspect --format '{{.State.Health.Status}}' "$postgres")" = healthy; do
    attempt=$((attempt + 1)); test "$attempt" -lt 60 || { echo 'PostgreSQL health timeout' >&2; return 1; }
    sleep 2
  done

  if test "$(docker inspect --format '{{.State.Running}}' "$auth_api")" != true; then
    docker start "$auth_api" >/dev/null || return 1
  fi
  attempt=0
  until test "$(docker inspect --format '{{.State.Health.Status}}' "$auth_api")" = healthy; do
    attempt=$((attempt + 1)); test "$attempt" -lt 60 || { echo 'API health timeout' >&2; return 1; }
    sleep 2
  done
}
local_demo_start_backend && unset -f local_demo_start_backend
```

Do not run the `initialize` service or any account initializer for a normal demo restart. Do not publish a port, change Docker networking, or start another Compose project. If either exact container is missing or its labels differ, stop and inspect the task-owned environment before proceeding; do not substitute another database or service.

## Start the frontend

From the PR #26 frontend worktree, use the explicit local-demo flag and exact backend project name:

```sh
VITE_ENABLE_LOCAL_DEMO_AUTH=true \
AL_LMS_LOCAL_DEMO_COMPOSE_PROJECT=al-lms-local-04g-20261109 \
npm run dev -- --host 127.0.0.1 --port 15173 --strictPort
```

Vite binds only to `127.0.0.1:15173` and exits if that port is occupied. Open <http://127.0.0.1:15173/local-demo/login>. Use one of the synthetic aliases and its matching private credential. The frontend's local-demo requests use `fetch` with same-origin paths and `credentials: "include"`; they do not use the production Axios authentication interceptor. The ordinary routes `/login`, `/send-otp`, and `/check-otp` retain their existing behavior.

Local-demo routes:

- `/local-demo/login` — alias and password login.
- `/local-demo/otp` — request a synthetic OTP challenge and enter its six-digit code.
- `/local-demo/dashboard` — a minimal role-aware synthetic identity page. It does not provide real course management, enrollment, quizzes, grading, payments, or administrative features.

## Retrieve a local OTP

The browser cannot reach the test inbox: Vite returns `404` for the exact inbox path and paths encoded up to two times. Retrieve the one-time code only inside the API container. The helper below captures the response without printing the code and copies it to the local clipboard using `wl-copy` or `xclip`. It requires one of those clipboard utilities. Do not run it with shell tracing enabled.

After the OTP page displays a challenge ID, run this in a private terminal:

```sh
local_demo_copy_otp() {
  set +x
  local project=al-lms-local-04g-20261109
  local container="${project}-auth-api-1"
  local challenge otp owner
  owner="$(docker inspect --format '{{ index .Config.Labels "com.docker.compose.project" }} {{ index .Config.Labels "com.docker.compose.service" }}' "$container" 2>/dev/null)" || return 1
  test "$owner" = "$project auth-api" || return 1
  read -r -s -p 'Challenge ID (input hidden): ' challenge
  printf '\n'
  otp="$(printf '%s\n' "$challenge" | docker exec -i "$container" python -c '
import json, sys, urllib.request
challenge = sys.stdin.readline().strip()
url = "http://127.0.0.1:8000/api/local-demo/auth/v1/test-inbox/" + challenge
with urllib.request.urlopen(url, timeout=5) as response:
    sys.stdout.write(json.load(response)["code"])
' 2>/dev/null)"
  unset challenge owner
  if [[ ! "$otp" =~ ^[0-9]{6}$ ]]; then unset otp; return 1; fi
  if command -v wl-copy >/dev/null 2>&1; then
    if ! printf '%s' "$otp" | wl-copy --trim-newline; then unset otp; return 1; fi
  elif command -v xclip >/dev/null 2>&1; then
    if ! printf '%s' "$otp" | xclip -selection clipboard; then unset otp; return 1; fi
  else
    unset otp
    echo 'Install or enable wl-copy or xclip, then request a fresh challenge.' >&2
    return 1
  fi
  unset otp
}
local_demo_copy_otp
unset -f local_demo_copy_otp
```

Paste the code into the browser before its five-minute expiry, then clear the clipboard with `wl-copy --clear` or `printf '' | xclip -selection clipboard`. The inbox entry is single-use. This adapter sends no SMS and makes no Kavenegar request. Never redirect the inbox response to a file or terminal transcript.

## Session and storage behavior

- The API sets an HttpOnly, SameSite=Strict cookie scoped to the local-demo auth path. It is non-Secure only for this loopback HTTP demonstration.
- The frontend keeps the synthetic alias and role in React memory. Passwords, OTPs, session tokens, and challenge IDs are not written to `localStorage` or `sessionStorage`.
- On route entry, the frontend restores the session with `GET /me` and rechecks an authenticated session periodically. Expired or revoked sessions return to the demo login page.
- Logout calls `POST /logout`; the API revokes the session and clears the cookie.

## Stop and clean up

Stop Vite with `Ctrl-C`. This affects only the frontend development server.

To stop the exact demo services later, first verify the project and service labels as shown above, then stop only the named containers:

```sh
docker stop al-lms-local-04g-20261109-auth-api-1 al-lms-local-04g-20261109-postgres-1
```

This retains the task-owned database volume and network for the next local demo. Do not use `docker compose down --volumes`, `docker system prune`, wildcard container commands, or cleanup commands for any other project. Permanent removal of the 04G database volume requires a separate explicit decision after verifying its exact project ownership.

For the production-bundle isolation check, build with the local-demo flag set if desired:

```sh
VITE_ENABLE_LOCAL_DEMO_AUTH=true npm run build -- --outDir /tmp/al-lms-local-demo-production-build
```

The production Vite mode does not register the local-demo routes or include their module, even when the flag is set. The existing production API base URL and Axios behavior are unchanged.

## Security boundaries and limitations

- This is a local synthetic demonstration, not production authentication or authorization.
- Keep the API on its private Compose network. Do not publish its port or access it directly from browser code; the Vite proxy resolves its current private address dynamically.
- The local test inbox is available only through container-side access and is never proxied to the browser.
- The dashboard shows only synthetic identity and role. Existing LMS dashboard components depend on legacy API/session contracts and are not represented as working under this cookie-auth service.
- Do not expose Vite to a LAN or public interface, enable this feature in a production environment, reuse synthetic credentials, or connect it to real accounts, SMS, payment, enrollment, quizzes, or grading.
