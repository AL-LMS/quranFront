# AL-M3-AUTH-01 — Persian V2 auth screen reuse (source-only preview)

**Status 2026-11-15: source-only / unconnected / NOT real authentication.** Frontend issues [#35](https://github.com/AL-LMS/quranFront/issues/35), [#36](https://github.com/AL-LMS/quranFront/issues/36); backend parent [#136](https://github.com/AL-LMS/quranBack/issues/136).

## What is present

- The existing RTL Persian **Login, Signup, ConfirmPhone, SendOTP, CheckOTP** components are reused without replacing their normal production routes or calling legacy APIs from the new opt-in branch.
- A separately gated `src/features/authV2` preview route mounts those forms at `/__preview/m3-auth/{login,signup,confirm-phone,send-otp,check-otp}`. The preview uses an ephemeral React challenge context, not localStorage phones, user roles or bearer tokens. Its dashboard loads `GET /me` to determine the current synthetic server session.
- `v2AuthApi` is a same-origin, cookie-credentials client for the **candidate** `/api/v2/auth` API contract; a server-issued `/csrf` token is required for every unsafe request. There is deliberately **no fallback** to legacy `/back_request`, demo-local auth, or credentials in localStorage. Codes/passwords stay in form memory only.
- Phone entry accepts ASCII, Persian and Arabic-Indic digits; `+98`/`0098` user input is invalid. The server owns final canonicalization.
- A preview-only recovery-request form records a support case. There is **no** client operation to reset a password using SMS alone.

## How a developer will preview it — AFTER backend adapter exists

1. Use only invented identities and the **fake** SMS provider in a private local development/test environment.
2. Set `VITE_ENABLE_M3_AUTH_V2_PREVIEW=true` for the **Vite development server only**. `import.meta.env.DEV` is an additional mandatory compile-time guard. There is no production preview route.
3. Configure the development proxy for the future `/api/v2/auth` FastAPI adapter with a same-origin HTTPS browser path, Secure host-only cookies and its reviewed CSRF transport. The **backend adapter is not yet mounted**; the preview currently fails closed (404/CSRF unavailable) until [backend #138](https://github.com/AL-LMS/quranBack/issues/138) is separately implemented.
4. Open `/__preview/m3-auth/signup`, confirm the fake-sent OTP through test fixtures, sign in with password or OTP, check `/me`, logout and request support recovery.

This is not permission to expose the demo on any Internet host or to enable real accounts, external SMS, PostgreSQL or deployment.

## Scope / required follow-ups

- [ ] Backend #138 supplies a tested **synthetic-only** HTTP adapter, `/csrf` scheme, cookie, status and reviewable origin policy; the frontend must match its pinned version.
- [ ] A dedicated synthetic browser test should exercise signup→verification→signin→dashboard→logout and login OTP, including invalid code, revoked session and browser-back handling.
- [ ] Confirm phone input formatting, password policy, challenge resend UX, CSRF rotation and exact origin/HTTPS topology before any real identity release.
- [ ] Replace demo dashboard with resource-scoped student/teacher/admin navigation **only after** an authoritative `/me` membership/grant source, independent review and separate G9 release authorization.

Frontend transport tests: `npm test -- --run src/features/authV2/v2AuthApi.test.js`. Never run a real SMS service or database to evaluate these mocks.
