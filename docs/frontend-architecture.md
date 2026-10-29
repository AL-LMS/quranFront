# Frontend architecture and migration roadmap

## Current foundation

This is a React 18 / Vite application. The migration keeps the legacy page tree, routes, provider boundaries, and backend contracts in place.

```text
src/index.js
  BrowserRouter
    AppProviders (AuthProvider → DefiProvider → ThemeProvider)
      App.js (public and role-dependent route declarations, RTL cache)
        legacy pages / layouts / components

src/app/       application-level provider composition
src/features/  domain behavior (currently auth route access)
src/shared/    reserved for a real reusable extraction; no empty scaffold
src/api/       existing Axios defaults/interceptors
```

`src/shared/` is intentionally not created until code is actually migrated there. Existing code is still imported from its current paths to keep this incremental and backward compatible.

## Existing route map

All routes are declared in `src/App.js`. `Navbar` is rendered above the route switch. Private dashboard routes render the dashboard navbar, back control, sidebar, and outlet through `src/utils/PrivateRoutes.js`; users without the exact `student` or `teacher` role see the existing `SendOTP` flow. The new auth predicate preserves that exact role comparison. Frontend guards are navigation behavior only and do not replace backend authorization.

| Audience | Public/browser paths |
| --- | --- |
| Public | `/`, `/login`, `/signup`, `/confirm-phone`, `/send-otp`, `/check-otp`, `/websocket`, `/FAQ`, `/panel/all-courses`, `/panel/course/details/:id` |
| Student | `/panel/dashboard`, `/panel/payment/:id`, `/panel/wallet`, `/panel/profile`, `/panel/cart`, `/panel/my-course`, `/panel/course-page/:id`, `/panel/course/home-works/:id`, `/panel/course/resources/:id`, `/panel/course/quizes/:id`, `/panel/course/notifs/:id`, `/panel/my-course/forumlist/:id`, `/panel/my-course/forum/:id`, `/panel/my-course/exercise/:id`, `/panel/my-course/tags/file/:id`, `/panel/my-course/videos/:id`, `/panel/my-course/report/:id`, `/panel/my-course/tags/:id`, `/panel/course/exercise/:cid/:hid`, `/panel/payments`, `/panel/quiz`, `/panel/quiz/quiz-details/:id`, `/panel/quiz/quizt-details/:id`, `/panel/quiz/start/:id`, `/panel/quiz/start-t/:id`, `/panel/quiz/end-t-quiz/:id`, `/panel/quiz/start-single/:id`, `/panel/quiz/end/:id`, `/panel/quiz/score/:id`, `/panel/privacy-policy`, `/panel/notifications`, `/panel/package`, `/panel/packages/course/:id` |
| Teacher | `/panel/dashboard`, `/panel/all-courses`, `/panel/course/details/:id`, `/panel/payment/:id`, `/panel/profile`, `/panel/documents`, `/panel/my-coures`, `/panel/course/course-page/:id`, `/panel/course/home-works/:id`, `/panel/uploaded_homework/:id`, `/panel/course/resources/:id`, `/panel/course/quizes/:id`, `/panel/uploaded_quiz/:id`, `/panel/course/notifs/:id`, `/panel/course/students/:id`, `/panel/new-coures`, `/panel/coures`, `/panel/live`, `/panel/wallet`, `/panel/payments`, `/panel/course/course-homework/:id`, `/panel/course/quiz/:id`, `/panel/course/quiz/new/:courseid`, `/panel/course/quiz/edit/:courseid/:id`, `/panel/course/quiz/questions/:id`, `/panel/course/forum/:id`, `/panel/course/students/:id` |

The misspellings (`my-coures`, `new-coures`, `coures`, and `quizes`) are established public URLs and must remain until a compatibility redirect plan is approved. `/panel/course/details/:id` is declared both publicly and in both role route branches today.

## Providers and shared behavior

`src/index.js` mounts `BrowserRouter` outside `AppProviders`, preserving router availability and the existing provider order: `AuthProvider`, `DefiProvider`, then MUI `ThemeProvider`. `App.js` continues to create the Emotion RTL cache and Toastify container. Global styles and Persian fonts remain imported by the entry point. Jalali conversion and formatting remain in `src/helper/miladi.js`, `src/helper/shamsi.js`, and `src/helper/shamsi_format.js`; registration continues using the existing conversion helper.

Student and teacher dashboards stay in `src/pages/dashboard/{students,teacher}`. Components remain under their current page/domain component folders. There are duplicated student and teacher table components, broad route declarations in one component, direct Axios usage throughout page and component files, and some stale/unused helpers and imports. This change does not attempt a broad move or redesign.

## API base URL and endpoint usage

No endpoint contracts were changed. Existing callers use at least two conventions:

1. `src/api/axios.js` sets the default Axios base URL to `https://api.srvschool.ir/`. Relative calls use REST-like paths such as `authen/user`, `quiz/quizHeader/`, `course/coursehw/`, `dashboard/wallet`, `package/normalPackage`, `forum/forumDetail/`, `archive/archiveFiles/`, `notification/student/`, `zarinpal/report/`, and `live/getmeetings`.
2. `src/helper/getUrl.js` derives the current web origin, except localhost maps to `https://daarolquran.com/`. Numerous older calls override `baseURL` to `${getUrl()}back_request/{select_request|insert_request|update_request|register|token}/` and send query/form data there.
3. The student dashboard also calls `https://api.ipify.org/` directly for its device/IP flow.

The API client interceptor currently clears local storage and reloads once on a 401. Endpoint ownership and current backend contracts have not been verified in this frontend-only task. Centralizing clients or changing origins, paths, HTTP methods, payload shape, or auth behavior needs contract evidence and separate regression coverage.

## Baseline (2026-10-29)

Baseline was captured on the requested branch before source changes, using Node `v24.22.1` and npm `11.19.1` in this environment:

| Command | Result |
| --- | --- |
| `npm ci` | Exit 0 using the committed `.npmrc`; emitted upstream deprecation and audit/install-script notices. |
| `npm test -- --watchAll=false` | Exit 0; 1 suite and 7 auth role tests passed. |
| `CI=false npm run build` | Exit 0. Existing ESLint warnings across the app, outdated caniuse-lite, CRA/Babel undeclared plugin warning, missing `stylis-plugin-rtl` source map, and large JS bundle warning. |

The repository uses npm (`package-lock.json`) and `.npmrc` enables legacy peer resolution because the existing `mui-rte` dependency tree has a React 17 peer constraint despite the app running React 18. Clean installation is performed with `npm ci`.

## Vite toolchain and environment

The HTML entry is the repository-root `index.html`; `public/` files are copied unchanged and `src/index.js` remains the JavaScript application entry. Vite writes the production artifact to `build/`, matching the previous CRA deployment directory. `npm run dev` (or `npm start`) starts development; `npm run build` creates production assets; `npm run preview` serves the build locally. The Vite config includes a narrowly scoped transform for the legacy convention of JSX inside `.js` files and preserves the Persian date picker’s CSS-as-text import semantics.

No `REACT_APP_*` variables, `process.env` reads, Node built-in imports, or CRA `%PUBLIC_URL%` references were found in application code. No Vite variables are currently used. If public client configuration is added, use `import.meta.env.VITE_*` only for non-secret values. API endpoints stay as they are: Axios defaults to `https://api.srvschool.ir/`; legacy `getUrl()` maps localhost to `https://daarolquran.com/`; websocket localhost remains `wss://127.0.0.1:5000/`; other websocket hosts retain the current `wss://{hostname}/` behavior. `getUrl()` and `getUrlWs()` use browser location and are not replaced with build-time settings.

`BrowserRouter` requires the hosting server to rewrite unknown paths to `/index.html`, including nested `/panel/...` paths. The build assumes deployment at `/`, as the prior CRA build did. Root-served icons and manifest stay under `public/`; imported application images and custom fonts are emitted under `build/assets/`. Persian `lang="fa"`, `dir="rtl"`, Emotion RTL cache, global RTL styles, Jalali helpers, and font sources remain in place.

## Post-change validation (AL-01B)

Validation is run on Node `v24.22.1` / npm `11.19.1`. The existing seven auth role tests remain, with five added compatibility checks for route patterns, RTL document/assets, API base URL, legacy web/socket origins, and Jalali conversion. The Vite build emits a large single-bundle warning. Lint runs separately and reports 249 warnings without errors. The pre-migration CRA build also had app-wide lint warnings, outdated Browserslist data, a missing `stylis-plugin-rtl` source map, CRA/Babel deprecation notices, and a large bundle warning. The Vite build no longer runs CRA lint or emits its missing-source-map warning. Preview smoke checks returned HTTP 200 for `/`, `/panel/dashboard`, `/logo.png`, and `/manifest.json`.

The install reports inherited npm audit findings and install-script notices; no broad security/dependency upgrades are included. Tests do not make network calls to production, payment, or SMS services.

## Manual verification still required

- Student and teacher login, OTP, registration, and role-based direct route navigation.
- Student and teacher course, homework, quiz, payment/wallet screens, using safe test accounts and payment sandboxing.
- Student and teacher live class entry against an approved non-production backend. The app uses backend-returned meeting URLs; no embedded Jitsi SDK import was found. The teacher create-live form and `/websocket` demo source were already fully commented out, and are represented by inert components so existing routes/build imports remain valid.
- Production hosting rewrite/fallback and all deployment environment values/origins.

These flows are not claimed as manually verified by build/test results.

## Migration roadmap

1. **AL-01A:** preserve CRA and public behavior; introduce provider composition and auth feature boundary; add smoke tests, npm/Node CI, route/API documentation, migration ADR.
2. **AL-01B (this change):** migrate the build and tests to Vite/Vitest, preserve the existing routes and endpoints, and document any manual verification still required.
3. **AL-01C:** convert leaf utilities and isolated components to TypeScript, then feature modules incrementally. Keep JS imports and public component contracts working during transition; type API payloads only after backend contracts are verified.
4. **AL-02+:** extract student and teacher domains and centralize API clients only alongside backend contract tests. Retire legacy paths only with an explicit route/data migration plan.

## Local validation

```sh
npm ci
npm run dev
npm test
npm run lint
npm run build
npm run preview
```

GitHub Actions runs clean install, tests, standalone lint, and production build on pinned Node `24.22.1` LTS.
