# Frontend architecture and migration roadmap

## Current foundation

This is a React 18 / Create React App 5 application. This task establishes working boundaries without relocating page trees or changing browser URLs and backend contracts.

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
| `npm ci` | Failed with `ERESOLVE`: `mui-rte` peers on `@mui/styles`, whose peer requires React 17; app resolves React 18.2.0. |
| `npm ci --legacy-peer-deps` | Completed; emitted upstream deprecation warnings. This allowed baseline tests/build to run. |
| `CI=true npm test -- --watchAll=false --passWithNoTests` | Exit 0; no tests found. |
| `npm run build` | Exit 0. Existing ESLint warnings across the app, outdated caniuse-lite, CRA/Babel undeclared plugin warning, missing `stylis-plugin-rtl` source map, and large JS bundle warning. |

The repository originally tracked both `package-lock.json` and `yarn.lock` but documented neither a supported Node version nor a package manager. This foundation selects npm and makes its necessary peer resolution explicit. Build warnings outside the touched code are pre-existing cleanup work.

## Post-change validation

On Node `v24.22.1` / npm `11.19.1`, `npm ci` completed using the committed `.npmrc`, `CI=true npm test -- --watchAll=false` passed (1 suite, 7 tests), and `CI=false npm run build` completed. The build still reports the baseline CRA/Babel and source-map warnings, app-wide lint warnings, stale Browserslist data, and bundle-size warning. CRA treats any lint warning as a build failure when `CI=true`, so CI sets `CI=false` for the production build step only; warnings remain printed, while tests remain under `CI=true`. This is temporary until [the lint-warning follow-up](https://github.com/AL-LMS/quranFront/issues/3) removes the legacy warning debt. npm reports 95 dependency advisories (22 low, 22 moderate, 41 high, 10 critical) and install-script approval notices during clean installation; this task does not perform dependency upgrades or audit remediation.

## Migration roadmap

1. **AL-01A (this task):** preserve CRA and public behavior; introduce provider composition and auth feature boundary; add smoke tests, npm/Node CI, route/API documentation, migration ADR.
2. **AL-01B:** move CRA-specific assumptions to a documented compatibility checklist, add parity checks for direct route loading, RTL, Jalali date conversion, auth/login, payments, quiz, and live-class flows; then migrate the build to Vite while preserving browser paths and environment variable semantics. CRA `REACT_APP_*` variables must be mapped deliberately to Vite `import.meta.env` names, deployment-time injection, and WebSocket/API origins. No secrets belong in either client bundle.
3. **AL-01C:** convert leaf utilities and isolated components to TypeScript, then feature modules incrementally. Keep JS imports and public component contracts working during transition; type API payloads only after backend contracts are verified.
4. **AL-02+:** extract student and teacher domains and centralize API clients only alongside backend contract tests. Retire legacy paths only with an explicit route/data migration plan.

## Local validation

```sh
npm ci
npm start
npm test -- --watchAll=false
npm run build
```

GitHub Actions runs clean install, non-watch tests, and production build on pinned Node `24.22.1` LTS.
