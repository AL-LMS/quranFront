# AL-M3-AUTH-01 — Persian V2 authentication (source-only preview)

**Status 2026-11-15: source-only / local synthetic runner candidate / NOT real authentication.** Frontend issues [#35](https://github.com/AL-LMS/quranFront/issues/35), [#36](https://github.com/AL-LMS/quranFront/issues/36); backend parent [#136](https://github.com/AL-LMS/quranBack/issues/136), local integration [#141](https://github.com/AL-LMS/quranBack/issues/141).

## What is present

- The existing RTL Persian **Login, Signup, ConfirmPhone, SendOTP, CheckOTP** components and their production/legacy routes remain unchanged. A new, dedicated responsive preview experience now lives entirely under `src/features/authV2/V2PreviewExperience.jsx` and its scoped CSS. It uses the locally bundled Yekan Bakh fonts, an editorial auth layout, accessible form labels and errors, password visibility controls, and a preview-specific header instead of the legacy Navbar.
- A separately gated `src/features/authV2` preview route mounts those forms at `/__preview/m3-auth/{login,signup,confirm-phone,send-otp,check-otp}`. The preview uses an ephemeral React challenge context, not localStorage phones, user roles or bearer tokens. Its dashboard loads `GET /me` to determine the current synthetic server session.
- `v2AuthApi` is a same-origin, cookie-credentials client for the **candidate** `/api/v2/auth` API contract; a server-issued `/csrf` token is required for every unsafe request. There is deliberately **no fallback** to legacy `/back_request`, demo-local auth, or credentials in localStorage. Codes/passwords stay in form memory only.
- Phone entry accepts ASCII, Persian and Arabic-Indic digits; `+98`/`0098` user input is invalid. The server owns final canonicalization.
- The preview form enforces the synthetic backend's minimum 12-character password length before issuing a request; phone verification pre-fills the phone number on the subsequent login screen but deliberately **never auto-logs in**. The dev-only dashboard displays server-authoritative synthetic `/me` data and truthful empty states, not invented courses/grades or an activated real LMS dashboard. Account UUID is inside collapsed technical details.
- A preview-only recovery-request form records a support case. There is **no** client operation to reset a password using SMS alone.

## Explicit local HTTPS preview — only with the backend draft source

1. Check out the corresponding **draft backend branch from PR #140, with issue #141 changes**, next to the frontend branch. The backend is intentionally *not* available from the default backend `main` router. Install each repo's ordinary development dependencies; this runner never installs packages or configures PostgreSQL.
2. From the frontend repository run `bash scripts/run_m3_auth_v2_local.sh`. When the backend checkout is elsewhere, supply `AL_LMS_M3_AUTH_V2_BACKEND_DIR=/absolute/backend/path` before the command.
3. This script creates a private temporary folder (0700), generates a one-day, self-signed HTTPS certificate, starts FastAPI on `127.0.0.1:18443` and Vite on `127.0.0.1:15173`, and sets the dev-only preview gate. `/api/v2/auth` is proxied to **only** the fixed loopback FastAPI target. All other existing Vite routes are unchanged. The browser may require an explicit local self-signed certificate exception. No `http://` cookie bypass is provided.
4. Open `https://127.0.0.1:15173/__preview/m3-auth/signup`. Only use **fictional fixture numbers** `09120000001`, `09120000002` or `09120000003` and invented names/passwords. After requesting a challenge, read the six-digit code from the private fake-SMS file path printed by the script (last field of the latest line); the code never appears in the API response or ordinary server logs.
5. Verify phone; sign in with password; inspect `/me` and logout. Then use SMS OTP signin (subject remains the same account) and support-assisted recovery. **The synthetic accounts, pending challenges, and sessions all disappear when the process stops.** Every new server run requires fresh signup and verification; a fake SMS may still be generated for an unregistered number to avoid disclosing whether an account exists, but that code cannot sign in. Codes expire after five minutes, are single use, and requests for the same number have a 60-second cooldown.
6. Press **Ctrl+C** to stop both child processes and delete the generated local TLS key/certificate and fake-SMS file. The script does not deploy, run database services, or contact a real SMS provider.

### Repeatable local HTTPS integration smoke

After installing the frontend `npm ci` dependencies and the backend's Python development dependencies, run **`python3 scripts/check_m3_auth_v2_local.py`** from the frontend checkout. This one-shot command starts and stops both loopback services automatically; it uses only fictional phone `09120000001`, reads the private fake SMS inbox, and tests the actual HTTPS Vite→FastAPI proxy, CSRF and host-only session cookies, signup, verification without auto-login, password signin, `/me`, logout, 60-second resend block and recovery. Optional **`--extended-sms`** waits out the real local cooldown and then also checks SMS signin, wrong-code denial, code reuse rejection, same-subject identity and logout revocation. It tests real HTTP, **not** visual browser interaction. The helper requires Python `httpx` from the backend development environment and intentionally trusts a newly generated self-signed certificate only for its fixed localhost origin.

The companion browser-click acceptance remains pending; it must validate the Persian form inputs, code entry, both login methods and responsive behavior against the same fake service. This local setup cannot be considered a real-user security gate or production readiness evidence.

### AL-M3-UX-01 visual preview

The new auth/dash design is in the opt-in preview only. `App.js` suppresses the production Navbar on exactly `/__preview/m3-auth` and its child routes, avoiding its legacy `/back_request` calls. Normal `/login`, `/signup`, `/panel/*` and production routes are untouched. The preview provides clear local-only labels and does not imply that course/enrollment persistence is available.

Source-only validation: `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`; the auth journey tests also check password-length validation, post-verification phone prefill, clearing the verification notice after sign-in/logout, bidirectional names, rejected OTP feedback and rate limits. A subsequent readability polish strengthens small-label contrast and makes the mobile dashboard header more compact.

The owner provided desktop (~1838px) and mobile (400px) screenshots of signup/login/dashboard, observed a synthetic signed-in dashboard, and showed navigation back to login after logout on 2026-11-18. The owner then confirmed **fresh signup → verification → logout → successful SMS-code login** in the browser after discovering that an in-memory test account had been cleared on server restart. This is direct browser evidence for the happy-path SMS login, not for every invalid/expired/browser-back or breakpoint case. The extended live HTTPS smoke also verified invalid/reused code denial and server-side session revocation. Browser review at 360/390/768/1024/1440 widths and the full live negative-case matrix remain pending. This environment's headless Chromium has failed with `socket(): Operation not permitted`.

The opt-in local runner is **not** a production security review. It must never be made public or wired into `app.main`. A production build with the preview flag remains disabled by `import.meta.env.DEV` and the Vite proxy gate.

This is not permission to expose the demo on any Internet host or to enable real accounts, external SMS, PostgreSQL or deployment.

## Scope / required follow-ups

- [x] Backend #138 supplies a **synthetic-only**, unmounted HTTP adapter, `/csrf` scheme, cookie and HTTPS/origin tests on draft PR #140. Not yet merged/authorized for production.
- [x] React UI journey tests cover signup→verification→password or SMS signin→dashboard→logout, support recovery and revoked sessions with mocked HTTP responses (merged frontend PR #38).
- [x] Complete a **live HTTPS HTTP integration smoke** of the Vite proxy→synthetic FastAPI app with private fake SMS, CSRF, session cookie, logout and cleanup.
- [ ] Complete remaining actual browser-click negative cases (invalid/expired code, browser-back after logout, 360/390/768/1024/1440 widths). Owner-observed fresh signup, verified-phone, password signin, logout, and later SMS signin on the local synthetic preview passed; automated live HTTPS checks cover the server-side denials.
- [x] Add the isolated responsive preview layout, inline synthetic form errors and locally consistent password validation without altering legacy forms.
- [x] Review the initial desktop/400px screenshots and refine mobile header spacing, helper-text contrast and mixed-script account names.
- [ ] Complete challenge resend/cooldown affordances and further refine 401/429/expired-code UI copy (backend verification-resend endpoint is not yet available).
- [ ] Confirm phone input formatting, password policy, challenge resend UX, CSRF rotation and exact origin/HTTPS topology before any real identity release.
- [ ] Replace demo dashboard with resource-scoped student/teacher/admin navigation **only after** an authoritative `/me` membership/grant source, independent review and separate G9 release authorization.

Frontend transport tests: `npm test -- --run src/features/authV2/v2AuthApi.test.js`. Never run a real SMS service or database to evaluate these mocks.
