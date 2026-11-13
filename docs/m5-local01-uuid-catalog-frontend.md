# M5-LOCAL-01 — Persian RTL UUID catalog preview (local synthetic only)

**Source:** [backend PR #114](https://github.com/AL-LMS/quranBack/pull/114), isolated loopback API `127.0.0.1:8003`, `GET /api/v2/local-catalog/courses` and UUID detail. This frontend does **not** adapt the legacy integer-ID `/api/v2/catalog/courses` API.

**Safety:** only explicit `vite serve` in `development` can register the proxy and routes. The Vite proxy accepts only `http://127.0.0.1:<explicit port>`, never remote hosts, localhost alias, HTTPS, authentication, query, or path. Production builds do not include this preview route. No student account, token, enrollment, protected course content, backend secrets, database or public deployment.

## Host-only run

Use an isolated backend worktree on PR #114, not backend `main` while #114 is awaiting its GitHub Actions artifact check:

```bash
cd ~/Dev/AL-LMS/quranBack-m5-local
../quranBack/.venv/bin/python -m devtools.m5_local_uuid_catalog
```

Expected: `AL-LMS UUID SYNTHETIC ONLY | http://127.0.0.1:8003 | NO DATABASE`.

In the frontend checkout on this PR branch (a separate shell):

```bash
npm ci
VITE_ENABLE_M5_UUID_CATALOG_PREVIEW=true \
VITE_ALLOW_M5_UUID_LOCAL_API=true \
VITE_M5_UUID_TARGET=http://127.0.0.1:8003 \
npm run dev -- --host 127.0.0.1 --port 5173
```

Visit: `http://127.0.0.1:5173/__preview/m5-uuid`.

The screen is intentionally labeled `فقط آزمایش محلی • دادهٔ ساختگی`. The browser requests `/__demo/m5-uuid/courses` from Vite's **same origin**, which proxies to the backend's `/api/v2/local-catalog/courses`. Only 2 public fields `id` (UUID) and `title` are accepted, along with the pagination envelope. The HTTP response **must** have `X-AL-LMS-Data-Scope: synthetic-only`; if the header is missing, or a private/legacy field appears, the UI fails closed. Browser credentials/cookies are omitted.

Test listing, next/previous page, UUID detail, invalid/unknown UUID, and stopping backend (visible retry/error, no fallback to legacy or static sample data). Stop both processes with Ctrl+C. No SQLite/PostgreSQL container or persistent store is started.

## Guardrails

- Two explicit Vite variables are required: `VITE_ENABLE_M5_UUID_CATALOG_PREVIEW=true` and `VITE_ALLOW_M5_UUID_LOCAL_API=true`; both *together*, dev mode only.
- Neither the legacy catalog preview nor the historical teacher/reviewer demo is modified or repurposed. This frontend cannot publish or approve courses and has no login, enrollment or payment actions.
- Backend PR #114 remains pending its existing artifact-storage CI requirement. This frontend PR is independently reviewable and **must not trigger** a backend merge, dev database/DDL, production deployment or real students. Independent security #99 and G4/G9 source authority remain pre-pilot/real-data blockers.
