# M6-LOCAL-UI-01 — Persian course-management browser acceptance (synthetic only)

**Scope:** [frontend issue #31](https://github.com/AL-LMS/quranFront/issues/31) and accepted backend [M6-LOCAL-01 #117](https://github.com/AL-LMS/quranBack/issues/117). This is an entirely local development preview for UUID course create/edit/archive on an explicitly disposable PostgreSQL test fixture. **It is not a trusted admin login, publication authorization, real student data or release.**

## Exact local processes

Use an isolated or clean backend checkout at merged backend PR #118 or newer. Prior disposable PostgreSQL acceptance was cleaned up; start **one new** labelled, tmpfs-backed target. Don't reuse existing project containers or volumes.

Backend terminal:

```bash
cd ~/Dev/AL-LMS/quranBack
git status --short
git switch main
git pull --ff-only origin main
.venv/bin/python -m pytest -q tests/test_m6_local_course_management.py
docker image inspect postgres:16.6-alpine >/dev/null 2>&1 || docker pull postgres:16.6-alpine
bash scripts/m5-local-pg.sh up
.venv/bin/python -m devtools.m5_disposable_pg_catalog --enable-course-management
```

The backend binds **127.0.0.1:8004**, reports a verified synthetic-only PG target, and prints a **new random** `X-AL-LMS-Local-Admin-Token`. Do **not** paste it into chat, GitHub, any `.env` file, shell history, URL or frontend env variable. Leave the backend process running.

Frontend terminal on this frontend PR (or frontend main after merge):

```bash
cd ~/Dev/AL-LMS/quranFront
git status --short
git switch main
git pull --ff-only origin main
npm ci

VITE_ENABLE_M6_MANAGEMENT_PREVIEW=true \
VITE_ALLOW_M6_LOCAL_API=true \
VITE_M6_MANAGEMENT_TARGET=http://127.0.0.1:8004 \
npm run dev -- --host 127.0.0.1 --port 5174 --strictPort
```

Visit **http://127.0.0.1:5174/__preview/m6-management**. (Stop any previous Vite server using this port first; don't kill unrelated listeners.) Paste the short-lived token **into the page's password field**, then connect. The token remains only in React component memory, is passed on same-origin proxied API requests via a header, and disappears on disconnect/navigation/refresh. The UI never stores tokens in cookies, localStorage, sessionStorage, query strings, logs, or persistent files.

Vite exposes only the explicitly gated `__demo/m6-management` path and rewrites to the local backend's `/api/v2/local-course-management`. The proxy refuses non-`http://127.0.0.1:8004` targets. Both `VITE_ENABLE_M6_MANAGEMENT_PREVIEW=true` and `VITE_ALLOW_M6_LOCAL_API=true`, plus a dev-only Vite command, are required; no route is registered in production build.

## Browser acceptance

Using the synthetic-only list: create a draft titled `آموزش جدید`, select the new course (status draft, version 1), edit its title (version becomes 2), click archive **then confirm**, and observe status archived/version 3. The management page must never present a publish/approve operation. The backend's public UUID catalog must return HTTP 404 for this draft/archived course. You may separately check the old public UUID preview with its own M5 flags pointed to the **same** 8004 test server; do not use the old integer-ID catalog.

The UI must show a safe error for a wrong/expired token (403), stale write version (409, refresh required), missing course (404) or stopped backend (connection unavailable); private backend exception details must not surface. The browser sends no cookies/credentials, and accepts exactly the synthetic header and four-field `id,title,status,version` contract. No tenant, role or publication privilege may be selected by the browser.

## Cleanup

Stop Vite and the backend Python runner with Ctrl+C. Then, **from backend root**:

```bash
cd ~/Dev/AL-LMS/quranBack
bash scripts/m5-local-pg.sh status
bash scripts/m5-local-pg.sh down
```

This removes only the exact labelled tmpfs-only synthetic container; no named or bind volumes are created. If the runner or container does not match, investigate rather than cleaning arbitrary Docker objects.

**Release gates unchanged:** qualified independent security reviewer (backend #99) remains pre-pilot; real identity/issuer G4 and physical schema G9 are unapproved. Browser acceptance with a synthetic temporary token must never be presented as real administrative authorization or as a production-ready LMS.