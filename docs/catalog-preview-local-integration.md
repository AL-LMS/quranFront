# AL-MVP-CATALOG-06 — browser-to-V2 local preview

## What this proves

This is an isolated integration path between the existing catalog React client
and the **real V2 FastAPI course listing/detail endpoints**. The backend is a
localhost-only `uvicorn` process using a disposable in-memory SQLite database
with invented course records. No real users, database migration, or published
course records are used.

The frontend API mode is already implemented in
`src/features/catalogPreview/`; this milestone verifies the explicit opt-in,
routing, query parameters, error paths, and five-field projection.

## Terminal 1: backend (local machine only)

In `~/Dev/AL-LMS/quranBack`, use the backend Catalog-06 feature branch:

```bash
git fetch origin
git switch --track origin/feat/al-mvp-catalog-06-local-api-demo
python -m pip install -e ".[dev]"
python -m devtools.catalog_demo
```

The server binds only to `127.0.0.1:8001`. It uses only anonymous,
invented courses and no environment-configured database.

## Terminal 2: frontend

In `~/Dev/AL-LMS/quranFront`, switch to the frontend Catalog-06 branch and run:

```bash
git fetch origin
git switch --track origin/feat/al-mvp-front-catalog-06-api-integration
npm ci

VITE_ENABLE_CATALOG_UI_PREVIEW=true \
VITE_ALLOW_CATALOG_LOCAL_API=true \
VITE_V2_API_TARGET=http://127.0.0.1:8001 \
npm run dev
```

Open `http://localhost:5173/__preview/catalog` or the port Vite prints.
Choose **API محلی** in the source selector. The browser calls the local
same-origin `/api/v2/catalog/courses` path. The Vite development proxy sends
it to the backend process on the same machine.

The page defaults to **synthetic frontend fixtures** until you explicitly
switch the source; the local API flag must also be enabled. No API mode exists
in a production build.

## Manual acceptance checklist

1. Open the catalog in synthetic mode; no HTTP catalog request should occur.
2. Select API mode; the server should receive a GET for `/api/v2/catalog/courses`.
3. Check all displayed items; only five allowed public fields appear.
4. Select a category, search by course title, and switch online/in-person.
5. Open the course detail page and use the back link.
6. Try an unknown ID; it should show a not-found state without revealing hidden rows.
7. Stop the backend process; the frontend should show an error and retry action,
   **not** redirect to a historical production API.
8. Verify the old `/panel/all-courses` and `/panel/course/details/:id`
   routes remain untouched.

## Frontend automated verification

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

The tests mock HTTP responses. The live browser-to-loopback integration is
a separate manual acceptance check and is not automatically validated by
GitHub Actions.

## Strict boundaries

- No real database, remote network service, SMS, payment, or student account
- No runtime catalog migration, historical table mapping, or legacy route change
- No production hostname or production API traffic
- No enrollment or course-access grant
- G0–G8 remain PENDING and G9 remains NOT GRANTED; these files do not claim
  deployment authorization or resolve the independent-review requirement
