# AL-M3-AUTH-01 — Persian V2 auth screen reuse (source-only preview)

**Status 2026-11-15: source-only / local synthetic runner candidate / NOT real authentication.** Frontend issues [#35](https://github.com/AL-LMS/quranFront/issues/35), [#36](https://github.com/AL-LMS/quranFront/issues/36); backend parent [#136](https://github.com/AL-LMS/quranBack/issues/136), local integration [#141](https://github.com/AL-LMS/quranBack/issues/141).

## What is present

- The existing RTL Persian **Login, Signup, ConfirmPhone, SendOTP, CheckOTP** components are reused without replacing their normal production routes or calling legacy APIs from the new opt-in branch.
- A separately gated `src/features/authV2` preview route mounts those forms at `/__preview/m3-auth/{login,signup,confirm-phone,send-otp,check-otp}`. The preview uses an ephemeral React challenge context, not localStorage phones, user roles or bearer tokens. Its dashboard loads `GET /me` to determine the current synthetic server session.
- `v2AuthApi` is a same-origin, cookie-credentials client for the **candidate** `/api/v2/auth` API contract; a server-issued `/csrf` token is required for every unsafe request. There is deliberately **no fallback** to legacy `/back_request`, demo-local auth, or credentials in localStorage. Codes/passwords stay in form memory only.
- Phone entry accepts ASCII, Persian and Arabic-Indic digits; `+98`/`0098` user input is invalid. The server owns final canonicalization.
- A preview-only recovery-request form records a support case. There is **no** client operation to reset a password using SMS alone.

## Explicit local HTTPS preview — only with the backend draft source

1. Check out the corresponding **draft backend branch from PR #140, with issue #141 changes**, next to the frontend branch. The backend is intentionally *not* available from the default backend `main` router. Install each repo's ordinary development dependencies; this runner never installs packages or configures PostgreSQL.
2. From the frontend repository run `bash scripts/run_m3_auth_v2_local.sh`. When the backend checkout is elsewhere, supply `AL_LMS_M3_AUTH_V2_BACKEND_DIR=/absolute/backend/path` before the command.
3. This script creates a private temporary folder (0700), generates a one-day, self-signed HTTPS certificate, starts FastAPI on `127.0.0.1:18443` and Vite on `127.0.0.1:15173`, and sets the dev-only preview gate. `/api/v2/auth` is proxied to **only** the fixed loopback FastAPI target. All other existing Vite routes are unchanged. The browser may require an explicit local self-signed certificate exception. No `http://` cookie bypass is provided.
4. Open `https://127.0.0.1:15173/__preview/m3-auth/signup`. Only use **fictional fixture numbers** `09120000001`, `09120000002` or `09120000003` and invented names/passwords. After requesting a challenge, read the six-digit code from the private fake-SMS file path printed by the script (last field of the latest line); the code never appears in the API response or ordinary server logs.
5. Verify phone; sign in with password; inspect `/me` and logout. Then use SMS OTP signin (subject remains the same account) and support-assisted recovery. The synthetic in-memory state disappears when the process stops.
6. Press **Ctrl+C** to stop both child processes and delete the generated local TLS key/certificate and fake-SMS file. The script does not deploy, run database services, or contact a real SMS provider.

The opt-in local runner is **not** a production security review. It must never be made public or wired into `app.main`. A production build with the preview flag remains disabled by `import.meta.env.DEV` and the Vite proxy gate.

This is not permission to expose the demo on any Internet host or to enable real accounts, external SMS, PostgreSQL or deployment.

## Scope / required follow-ups

- [x] Backend #138 supplies a **synthetic-only**, unmounted HTTP adapter, `/csrf` scheme, cookie and HTTPS/origin tests on draft PR #140. Not yet merged/authorized for production.
- [x] React UI journey tests cover signup→verification→password or SMS signin→dashboard→logout, support recovery and revoked sessions with mocked HTTP responses (merged frontend PR #38).
- [ ] Complete an actual local browser run against the loopback synthetic FastAPI service, including invalid code, expiry, browser-back, fake SMS and stop/cleanup evidence.
- [ ] Complete challenge resend/cooldown affordances and friendly 401/429/expired-code UI copy.
- [ ] Confirm phone input formatting, password policy, challenge resend UX, CSRF rotation and exact origin/HTTPS topology before any real identity release.
- [ ] Replace demo dashboard with resource-scoped student/teacher/admin navigation **only after** an authoritative `/me` membership/grant source, independent review and separate G9 release authorization.

Frontend transport tests: `npm test -- --run src/features/authV2/v2AuthApi.test.js`. Never run a real SMS service or database to evaluate these mocks.
