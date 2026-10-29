# API ownership and compatibility gaps

## Evidence boundary

This audit inspected only frontend source, `quranBack` source (`main.py`, imported legacy modules, and `app/`), and the admin app configuration. A missing route means “not found in these checked source trees,” not “does not exist in production.” No endpoint was called. The admin repository configures AdminJS resources for users, teachers, students, courses and course registrations; it does not declare frontend API routes and therefore does not establish ownership of the frontend HTTP API.

## Confirmed backend matches

| Frontend capability | Evidence in legacy backend | Confidence |
|---|---|---|
| Login | `POST /back_request/token/` delegates to `User.user.login` | Handler confirmed; exact response schema remains inferred from frontend reads. |
| Registration | `POST /back_request/register/` delegates to `register` | Handler confirmed. |
| OTP send/check/confirm | Generic insert/select handlers dispatch `send_otp`, `check_otp`, `confirm_phone` | Dispatch confirmed; SMS and Redis behavior need service-level contract confirmation. |
| Catalog and course/student/teacher data | Generic select dispatcher covers the action names listed in the inventory and delegates to imported `Course` / `User` helpers | Dispatch confirmed; data helper behavior and authorization rules not fully audited. |
| Course enrollment, content creation, notifications, homework, resources, quizzes, session creation | Generic insert dispatcher contains the frontend action labels | Dispatch confirmed; payload/response schemas uncertain. |
| Profile update and submission/grading changes | Generic update dispatcher contains `edit_user`, upload edits, and score actions | Dispatch confirmed. |
| File and image retrieval | Legacy handlers serve course/teacher pictures, resources, homework, uploaded homework and certificates under `/back_request/...` | Handler confirmed; direct links and authorization behavior require review. |
| WebSocket echo | Legacy `WS /back_request/ws` accepts text and responds `You sent: ...` | Handler confirmed; no active frontend caller found. |
| Modular foundation | `app.main:app` includes `GET /health/live` only through `app.api.router` | Confirmed. This app is separate from the legacy `main:app` deployment noted in backend docs. |

## Not found, possible external ownership

The following route families used in the frontend were not found in either backend app inspected. They may belong to another deployed API, a retired service, or a separately maintained service; source evidence does not establish which:

| Frontend route family | Likely functional owner (assumption) | Compatibility question |
|---|---|---|
| `/authen/*`, `/refresh` | Authentication/user service | Are these DRF-style routes on `api.srvschool.ir`? What are token, cookie, expiry, and refresh contracts? |
| `/course/*` REST paths | Course/LMS service | Which paths overlap semantically with legacy generic course actions, and which are canonical? |
| `/quiz/*`, `/forum/*`, `/archive/*` | Learning-content service | What are exact response schemas, scoring rules and file access rules? |
| `/dashboard/*`, `/notification/*` | Dashboard/notification service | Are wallet, basket and search endpoints served by the same API origin? |
| `/package/*` | Commerce/catalog service | How do package registration and product payment relate to legacy course enrollment? |
| `/zarinpal/*` | Payment integration | What are gateway callback, idempotency, status reconciliation and return URL contracts? |
| `/live/*` and `meet.daarolquran.com` | Live-class / meeting service | Which backend creates meetings, authenticates joins and issues room links? |
| `/slider/*` | CMS/content service | Which origin owns banners and slider assets? |

External `https://api.ipify.org/` is directly evident as a third-party IP lookup. Image and download links under `api.srvschool.ir` and `daarolquran.com/back_request/...` are served outside Axios and may have separate ownership and access policy.

## Compatibility and security risks

1. **Multiple origins and environment rules:** shared Axios points at `api.srvschool.ir`, while legacy operations derive `back_request` from page origin and force production `daarolquran.com` on localhost. Cross-origin cookies, CORS and local development behavior need explicit design.
2. **Split auth behavior:** many calls pass a local-storage bearer token manually; `axiosPrivate` refresh behavior is not used by most features. `useRefreshToken` calls `/refresh` with credentials, which was not found in the inspected backend. A 401 causes page reload; an error without `response` can break the global interceptor while reading `error.response.status`.
3. **Legacy response coupling:** generic handlers return helper results; UI often assumes `tracking_code`, `response`, and `error`, while REST paths expect unwrapped data. No shared schema or generated contract ties these forms together.
4. **File authorization:** direct links do not attach Axios bearer credentials. Public availability, signed URL handling, filename validation and access checks require confirmation before migration.
5. **Sensitive values in source:** the legacy `main.py` contains hardcoded object-storage access credentials. Values are intentionally omitted here. Treat as exposed: rotate them, move secrets to deployment configuration, and inspect repository history. The same app configures wildcard CORS origins while enabling credentials; the browser/CORS combination should be reviewed and replaced with explicit origins.
6. **Payment flow:** card checkout redirects to a URL returned by the API, and frontend payment report queries use a phone value as `s_id`. Verify that ownership is enforced server-side and that redirects, callbacks, totals and payment state are validated by the payment service.
7. **Potential URL typo:** `StartQuiz.js` includes an extra `}` in the `quizHeader` query URL. Confirm against the owning API and correct in a separate behavior-change task.
8. **Unverified endpoint ownership:** backend absence is not evidence of production breakage. Obtain service ownership, deployment routing and OpenAPI/contract artifacts before consolidating APIs.

## Recommended migration sequence

1. Establish a service ownership map and capture deployed OpenAPI documents / route manifests for each origin. Keep secrets and customer data out of fixtures.
2. Record representative sanitized request/response examples from authorized staging, including error statuses and auth expiry. Validate legacy action payloads separately from REST endpoints.
3. Define versioned schemas and typed clients for auth, catalog/course, learning activity, files, payments and live classes. Avoid changing runtime clients until contracts are signed off.
4. Make environment-specific base URLs explicit; centralize token attachment, cookie policy, refresh, timeout and normalized error handling with compatibility coverage.
5. Prioritize credential rotation, file access review and payment authorization/idempotency review. Then migrate legacy action dispatch incrementally and preserve a rollback path.
6. Add CI checks that compare frontend endpoint ownership and schemas against published backend contracts. The modular FastAPI app should be treated as health-only until additional routers are actually registered.
