# Integration hardening 02: frontend navigation

## Behavior

- Guests reach `/login` from the site wide `ورود` action; signup remains `/signup`.
- Existing contextual signup and OTP recovery links remain in place, including `/send-otp` and `/check-otp` routes and the Navbar cross-links from `/signup` and `/send-otp`.
- Signed-in students and teachers see their first and last name and go to `/panel/dashboard`. `App.js` continues resolving that route to the existing student or teacher dashboard based on the authenticated role.
- The mobile drawer is anchored on the right for RTL, retains MUI modal keyboard and focus behavior, closes after navigation, and shows login/signup only to guests. Signed-in users get a dashboard link.
- Catalog routes still require development mode and `VITE_ENABLE_CATALOG_UI_PREVIEW=true`. Enrollment request routes additionally require `VITE_ALLOW_CATALOG_LOCAL_API=true` and `VITE_ENABLE_ENROLLMENT_UI_PREVIEW=true`; production builds do not register preview routes.

## Scope and limitations

No login, signup, OTP, `useAuth`, `PrivateRoutes`, role authorization, payment, student data, backend, database, or deployment behavior was changed. Dashboard access remains governed by the existing private route and role routing. These are compatibility improvements for the current frontend demo baseline; they do not enable real authentication or enrollment.

The existing local enrollment API remains a demo API using `credentials: "omit"`. It is not an authenticated production API and was not moved or connected to production routes.

## Validation

- `npm ci`: passed.
- `npm test -- --reporter=dot`: passed, 8 test files and 54 tests.
- `npm run typecheck`: passed.
- `npm run lint`: passed with existing repository warnings (242 warnings, no errors).
- `npm run build -- --outDir /tmp/quranFront-build-check`: passed. The exact `npm run build` command could not clear the pre-existing `build/assets` output directory because it contains root-owned files (`EACCES`); those files were left untouched.

GitHub Actions status will be recorded on the pull request after it is opened.
