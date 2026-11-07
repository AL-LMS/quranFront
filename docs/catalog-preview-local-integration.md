# Local catalog preview integration

This guide runs the catalog preview against the actual V2 FastAPI catalog
router using only synthetic in-memory SQLite fixtures.

## Verified revisions

- Backend `main`: `845bb33f00c2ee2a8d65107385f04ef7f3a5d501` (includes the
  merged backend catalog demo entrypoint).
- Frontend `main` baseline before this integration: `32127bf29dbb6ff4d2af6698f779cb2b4a3edca6`.
- Frontend changes are on `feat/al-mvp-front-catalog-06-api-integration`.

Use separate disposable worktrees so these steps do not switch or alter an
existing development checkout. Run the commands from each repository's
existing clone. The destination paths must not already exist:

```bash
git -C ~/Dev/AL-LMS/quranBack fetch origin
git -C ~/Dev/AL-LMS/quranBack worktree add --detach \
  /tmp/quranback-catalog-demo 845bb33f00c2ee2a8d65107385f04ef7f3a5d501

git -C ~/Dev/AL-LMS/quranFront fetch origin
git -C ~/Dev/AL-LMS/quranFront worktree add --detach \
  /tmp/quranfront-catalog-demo origin/feat/al-mvp-front-catalog-06-api-integration
```

The frontend branch includes the catalog-preview stack. No feature-branch
checkout is required in the original worktrees.

## Terminal 1: local backend

The backend demo binds specifically to `127.0.0.1:8001`. It builds an
in-memory SQLite database and synthetic records, does not read database URL
environment variables, and applies no migrations. Do not change its bind
address or expose it to a network interface.

```bash
cd /tmp/quranback-catalog-demo
python3 -m venv .venv
.venv/bin/python -m pip install -e '.[dev]'
.venv/bin/python -m devtools.catalog_demo
```

The demo prints its loopback-only identity when it starts. In another terminal,
check the actual service directly:

```bash
curl -fsS 'http://127.0.0.1:8001/api/v2/catalog/courses?limit=2' | jq .
curl -i 'http://127.0.0.1:8001/api/v2/catalog/courses/91001'
curl -i 'http://127.0.0.1:8001/api/v2/catalog/courses/999999'
```

## Terminal 2: local frontend and same-origin proxy

```bash
cd /tmp/quranfront-catalog-demo
npm ci
VITE_SERVER_HOST=127.0.0.1 \
VITE_ENABLE_CATALOG_UI_PREVIEW=true \
VITE_ALLOW_CATALOG_LOCAL_API=true \
VITE_V2_API_TARGET=http://127.0.0.1:8001 \
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Open `http://127.0.0.1:5173/__preview/catalog`. The initial source is synthetic
frontend data and makes no catalog HTTP request. Choose **API محلی** to enable
the backend request. The browser requests the same-origin path
`/api/v2/catalog/courses`; Vite proxies that path to the explicitly configured
loopback backend. The client omits credentials and projects responses to the
approved fields: `id`, `name`, `summary`, `category`, and `is_online`.

The API mode has no historical production-endpoint fallback. If the local
backend is unavailable, the preview shows an error and retry action. Search,
category, modality, and page offset are sent as bounded query parameters.
Course details use the selected course ID; unknown or invalid IDs fail safely.

## Verification coverage

- `catalogLocalApi.test.js`: six automated Vitest tests with mocked HTTP. They
  cover same-origin GETs, explicit flags, omitted credentials, field
  projection, safe IDs, 404 handling, retry behavior, and filtering parameters.
- Other catalog Vitest tests cover offline synthetic mode, search, category and
  modality controls, pagination, URL state, details, and return navigation.
- The commands below are automated local checks. The curl commands above are
  direct loopback HTTP checks through both FastAPI and the Vite proxy.
- No browser automation package is configured in this frontend repository;
  visual browser Network-panel verification remains a manual check.

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Manual acceptance: in the preview, inspect synthetic mode before selecting the
API source; then search and filter, change pages, open a course and return,
and inspect the unknown-ID and backend-offline states. The API response and
rendered cards must not expose any fields beyond the five-field public DTO.
The legacy homepage and `/panel/*` routes remain separate and unchanged.

## Stop and cleanup

Stop each foreground server with Ctrl+C. This stops only the processes started
in these terminals. Confirm the demo no longer answers on port 8001. The SQLite
database exists only in process memory and is discarded when the backend exits.

After stopping both servers, remove only the clean temporary worktrees created
above (omit a removal if that worktree has local changes):

```bash
git -C ~/Dev/AL-LMS/quranBack worktree remove /tmp/quranback-catalog-demo
git -C ~/Dev/AL-LMS/quranFront worktree remove /tmp/quranfront-catalog-demo
```

## Safety boundary

This is an offline development preview, not production authorization or a
production catalog integration. It uses no real identity, student data,
database, enrollment activation, payment, SMS, or production service. The
backend demo also attaches a separate in-memory synthetic enrollment prototype
under `/api/v2/__demo/enrollment`. Its fictional student/admin routes have no
authentication and do not grant course access; they are unrelated to this
catalog integration and must never be treated as production permissions. The
demo does not prove production readiness.
