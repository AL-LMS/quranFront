# AL-MVP-ENROLLMENT-01 — temporary course-request prototype

This is a **demo-only** student request and simulated administrator review
flow. There is no authenticated student or admin identity; both perspectives
refer to the same fictional student and in-memory request store. A simulated
approval does **not** enroll anyone, process payment, or grant lesson access.

All new write routes live only in `quranBack/devtools/enrollment_demo.py`
and are attached to `devtools.catalog_demo.create_demo_app()`. They are
absent from the normal `app.main:app` and the legacy `main:app`.

## Run on your machine — two terminals

### Backend

From `~/Dev/AL-LMS/quranBack`, starting with a clean working tree:

```bash
git fetch origin
git switch --track origin/feat/al-mvp-enrollment-01-demo
source .venv/bin/activate
python -m devtools.catalog_demo
```

The server listens only on `127.0.0.1:8001` and recreates all data on
restart. Never use a live database or deploy this module.

### Frontend

From `~/Dev/AL-LMS/quranFront`, starting with a clean working tree:

```bash
git fetch origin
git switch --track origin/feat/al-mvp-enrollment-01-demo

VITE_ENABLE_CATALOG_UI_PREVIEW=true \
VITE_ALLOW_CATALOG_LOCAL_API=true \
VITE_ENABLE_ENROLLMENT_UI_PREVIEW=true \
VITE_V2_API_TARGET=http://127.0.0.1:8001 \
npm run dev
```

Open the localhost address Vite prints, followed by
`/__preview/catalog?source=api`. Open a course and select
**ثبت درخواست آزمایشی**.

For the fictional student's request status, open
`/__preview/requests`. To simulate a manager reviewing it, open
`/__preview/admin/requests`.

## Workflow acceptance

1. Submit a request for approved+published course 91001; response is 201
   with `status=pending`.
2. The fictional student's list shows it as awaiting review.
3. The simulated admin changes it to approved or rejected.
4. The student's list reflects the change after refresh.
5. Duplicate requests return HTTP 409; unknown, draft, rejected or archived
   courses return 404; invalid statuses return 422.
6. Approved requests do not create enrollments or lesson access.
7. Stop and restart the backend; all demo requests disappear.
8. With `VITE_ENABLE_ENROLLMENT_UI_PREVIEW` unset, new routes/buttons are absent.
9. Existing legacy course pages and catalog's synthetic-only mode are unchanged.

## Actual HTTP paths (LOCAL DEMO ONLY)

- `POST /api/v2/__demo/enrollment/requests` — JSON `{"course_id":91001}`
- `GET /api/v2/__demo/enrollment/requests`
- `GET /api/v2/__demo/enrollment/admin/requests`
- `PATCH /api/v2/__demo/enrollment/admin/requests/1`
  — JSON `{"action":"approve"}` or `{"action":"reject"}`

These endpoints intentionally have **no authentication** because they only
simulate roles on a loopback-only disposable process with invented records.
They must never be published or reused for real student or admin operations.

## Tests

Backend from an activated Python virtual environment:

```bash
python -m ruff check app tests devtools
python -m pytest -q tests/test_catalog.py tests/test_catalog_demo.py tests/test_enrollment_demo.py
```

Frontend:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

## Release boundary

No production auth, phone ownership, OTP, security authority, user identity,
course-access grant, database migration, or real enrollment flow is implied.
Project governance remains G0–G8 PENDING and G9 NOT GRANTED. This local-only
prototype does not satisfy deployment authorization or external review.
