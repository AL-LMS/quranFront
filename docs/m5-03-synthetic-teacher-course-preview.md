# AL-LMS M5-03 — Synthetic teacher/admin course UI preview

**Status:** isolated development-only proposal. **NOT a production course-management feature.**

This frontend draft consumes the matching **backend draft [M5-02 PR #78](https://github.com/AL-LMS/quranBack/pull/78)** and shares its **disposable in-memory SQLite** catalog. It is independent of the unmerged [M5-01 catalog read projection PR #77](https://github.com/AL-LMS/quranBack/pull/77) and [M5-01 product contract PR #76](https://github.com/AL-LMS/quranBack/pull/76). No production or legacy accounts, persistent databases, student records, SMS, payments, or real authorization are used.

## Explicit local-only startup (never on a server or in production)

Use clean, separate local worktrees. Do not change existing worktrees containing untracked work. The following commands assume you have independently checked out the **exact branches** specified here.

Backend terminal — `AL-LMS/quranBack` branch `feat/al-mvp-m5-02-synthetic-teacher-workflow`:

```bash
python -m pip install -e ".[dev]"
python -m pytest -q tests/test_m5_teacher_course_demo.py
python -m uvicorn 'devtools.m5_teacher_course_demo:create_teacher_course_demo_app' \
  --factory --host 127.0.0.1 --port 8002
```

Frontend terminal — `AL-LMS/quranFront` branch `feat/al-mvp-m5-03-teacher-review-preview`:

```bash
npm ci
VITE_ENABLE_CATALOG_UI_PREVIEW=true \
VITE_ALLOW_CATALOG_LOCAL_API=true \
VITE_ENABLE_M5_TEACHER_PREVIEW=true \
VITE_ALLOW_M5_LOCAL_API=true \
VITE_M5_DEMO_TARGET=http://127.0.0.1:8002 \
VITE_V2_API_TARGET=http://127.0.0.1:8002 \
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Open `http://127.0.0.1:5173/__preview/m5-02`.

**Do not run these commands on any shared/VPS host.** The feature route is absent unless all four opt-in flags and development build are present. When enabled, Vite binds to loopback and proxies only `/__demo/m5-02` to the explicitly validated `127.0.0.1` HTTP port. The public catalog GET preview uses the existing same-origin `/api` proxy to the same M5-02 backend.

The `X-Demo-Actor` values are **client-controlled, spoofable fixtures**. They are not authentication, authorization, or production access checks. No real users or personal data may be entered into the form.

## Synthetic browser acceptance flow

1. With “مربی آزمایشی اول”, create a Persian-titled course draft. It should appear under that teacher, but not in the public catalog.
2. Submit it for review. Switch to “مدیر آزمایشی”, verify it is pending, and approve it.
3. Follow the “مشاهده عمومی” link or open `/__preview/catalog?source=api`. The course should now appear with **exactly** the five public catalog fields provided by the existing backend read router.
4. Switch to “مربی آزمایشی دوم”. That fictional teacher must not see or edit teacher A's course; switching role is a **demo perspective**, not real identity proof.
5. Edit the approved course under teacher A. It must disappear from public list/detail until re-submitted and reviewed.
6. As the reviewer, revoke or archive it and verify the course is no longer public.
7. Stop the backend and reload. The UI must show an explicit error; it must not fall back to fixtures, the legacy REST API, or a production host. Restarting recreates only empty disposable data.

## Local checks

```bash
npm test -- --reporter=dot
npm run typecheck
npm run lint
npm run build
```

The frontend tests cover fixture API path/methods and response projection, no credentials, disabled preview flags, loopback-only Vite proxy, role-switch UI, approval controls, failed save, and no fallback.

## Boundaries / release HOLD

- UI and role control are **demonstration only**; M5-02's fixture actor header can be spoofed by any local caller.
- Teacher ownership is stored only in synthetic in-memory fixture state. There is no canonical course ID or production teacher grant.
- The current publication policy is conservative: editing a published course immediately removes it from public view until reapproval. Full production versioning and cache invalidation are undecided.
- Current fixed categories, text handling and public summary filter are not an approved content-moderation/privacy control.
- The backend PR #78 and this frontend PR must be reviewed together. Existing production/legacy routes must remain unchanged.
- Formal G0–G8 security gates, Issue #24 Gate 1, G9 production integration, legacy 60-operation review, independently verified data authority, staging and deployment approvals remain **pending/not granted**.
- **Do not merge or deploy from this draft** without specific, recorded approval and independent review. No background/automatic rollout.
