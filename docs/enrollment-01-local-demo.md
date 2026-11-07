# Synthetic enrollment and review preview

This is a **fictional, local-only UI demonstration**. The student and
administrator views are two public perspectives over the same synthetic
in-memory request store. The administrator button only changes a demo request
status. It is not an authorization action: approval never creates enrollment,
payment, lesson access, or a real account.

## Verified source revisions

- Frontend `main` baseline: `a6659fc306dade69f1673c6c1327508a27c28369`.
- Backend `main`: `845bb33f00c2ee2a8d65107385f04ef7f3a5d501`.
- Frontend enrollment UI: `feat/al-mvp-enrollment-01-demo` (PR #16).
- Backend demo entrypoint: `devtools.catalog_demo` on backend `main`.

Use new worktrees so these instructions do not switch existing checkouts. Pick
temporary paths that do not already exist:

```bash
git -C ~/Dev/AL-LMS/quranBack fetch origin
git -C ~/Dev/AL-LMS/quranBack worktree add --detach \
  /tmp/quranback-enrollment-demo 845bb33f00c2ee2a8d65107385f04ef7f3a5d501

git -C ~/Dev/AL-LMS/quranFront fetch origin
git -C ~/Dev/AL-LMS/quranFront worktree add --detach \
  /tmp/quranfront-enrollment-demo origin/feat/al-mvp-enrollment-01-demo
```

## Start the backend

From the backend worktree, run the explicit demo app. It binds only to
`127.0.0.1:8001`, uses synthetic courses and SQLite held in process memory, and
does not run migrations. Its enrollment endpoints are attached only to this
demo app; they are absent from normal FastAPI application entrypoints.

```bash
cd /tmp/quranback-enrollment-demo
uv run python -m devtools.catalog_demo
```

The demo intentionally has **no authentication**. Both the student and
simulated administrator are fictional, and anyone able to reach this loopback
process can use both views. Keep it bound to loopback and never deploy it.

## Start the frontend

In another terminal, from the frontend worktree:

```bash
cd /tmp/quranfront-enrollment-demo
npm ci
VITE_SERVER_HOST=127.0.0.1 \
VITE_ENABLE_CATALOG_UI_PREVIEW=true \
VITE_ALLOW_CATALOG_LOCAL_API=true \
VITE_ENABLE_ENROLLMENT_UI_PREVIEW=true \
VITE_V2_API_TARGET=http://127.0.0.1:8001 \
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

All four switches are required, and the routes are registered only in Vite
development mode. Browser calls use same-origin `/api/v2/...` paths; the Vite
proxy sends them to the explicitly configured loopback backend. Requests omit
credentials and have no production URL fallback.

Open `http://127.0.0.1:5173/__preview/catalog?source=api`, open synthetic
course `91001`, and use **ثبت درخواست آزمایشی**. Catalog synthetic mode does
not contact the API; the API source is a separate explicit choice.

## Acceptance scenarios

1. In catalog API mode, course `91001` is visible and may receive one pending
   synthetic request. The detail view shows the pending status.
2. Open `/__preview/requests` for the fictional student's request list.
3. Open `/__preview/admin/requests`; approve or reject the pending request.
   The screen labels this as a simulated administrator decision.
4. Refresh `/__preview/requests`; the updated status appears. Approval does not
   grant access or create an enrollment record.
5. Submit a duplicate request for the same course; the UI reports the conflict
   safely and the backend returns HTTP 409.
6. Courses `99001` (draft), `99002` (unapproved), `99003` (archived), and an
   unknown ID such as `999999` cannot be requested; the backend returns 404.
   Invalid IDs and request bodies are rejected.
7. Stop the backend and retry a read or write; the UI shows an error with a
   retry/update control. Restart it; the request list is empty because all
   request state lived in that process's memory.
8. Unset any one required flag or use a production build; the enrollment
   preview routes and sidebar link are unavailable.
9. Confirm the ordinary homepage, login, signup, OTP, and private dashboard
   navigation still use their existing routes. Unsupported roles do not gain
   dashboard access.

## Automated and browser verification

Automated frontend tests cover the four-flag development gate, same-origin
paths, omitted credentials, DTO projection, pending and reviewed states,
duplicate/error handling, retry, request cancellation on navigation, and
double-submit prevention. Backend tests cover the synthetic store, duplicate
and invalid requests, hidden courses, restart isolation between app instances,
and absence of these routes from the normal V2 application. Full frontend and
backend test commands are listed below.

Aborting a browser request while navigating away stops the UI from waiting or
updating an unmounted page; it cannot promise that a write already received by
the local server was rolled back. Reopen the fictional request list to
reconcile state. Backend duplicate and stale-review checks remain authoritative
for this demo process.

The real browser-to-loopback acceptance flow is a separate manual check. Use
the browser Network panel to confirm requests go only to `127.0.0.1:5173` and
that the same-origin `/api/v2/__demo/enrollment/...` calls return synthetic
data. Do not use production URLs, accounts, or credentials.

## Stop and clean up

Stop only the two foreground processes started above with Ctrl+C. Confirm ports
5173 and 8001 no longer have listeners. The backend's database and request
store disappear when that process exits. Remove only these clean temporary
worktrees, and omit removal if either contains local changes:

```bash
git -C ~/Dev/AL-LMS/quranFront worktree remove /tmp/quranfront-enrollment-demo
git -C ~/Dev/AL-LMS/quranBack worktree remove /tmp/quranback-enrollment-demo
```

## Local checks

```bash
# Frontend
npm test
npm run typecheck
npm run lint
npm run build

# Backend, from quranBack with its development environment
python -m ruff check app tests devtools
python -m pytest -q tests/test_catalog.py tests/test_catalog_demo.py tests/test_enrollment_demo.py
```

## Production prohibition

These public demo routes and fictional roles are not production authorization.
Do not reuse them for real students, accounts, sessions, phone numbers,
enrollment decisions, or course access. No production authentication, payment,
SMS, OTP, persistent enrollment, migration, deployment, or access-control grant
is implemented or authorized by this preview.
