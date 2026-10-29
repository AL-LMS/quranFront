# AL-LMS frontend

React 18 and JavaScript application built with Vite. Browser routes, provider order, backend API behavior, Persian RTL presentation, and Jalali date helpers remain in the existing application modules.

## Development commands

Use Node.js 24 LTS and npm 11. The committed `package-lock.json` is authoritative.

```sh
npm ci
npm run dev       # or npm start
npm test          # one-shot Vitest run
npm run test:watch
npm run typecheck # strict checks for the migrated TypeScript modules
npm run lint      # separate from the production build
npm run build     # writes to build/
npm run preview   # serves the production build locally
```

`npm ci` uses the repository `.npmrc` peer resolution setting to accommodate the existing `mui-rte` / `@mui/styles` React 17 peer declaration alongside the app's React 18 installation. No `REACT_APP_*` or `process.env` variables are currently used. New public build-time settings use `import.meta.env.VITE_*`; never put secrets in client variables.

Production hosting must serve the app from `/` and rewrite unknown BrowserRouter paths, including `/panel/...`, to `/index.html`. The output remains in `build/` to match existing deployment paths.

## Architecture

See [Frontend architecture](docs/frontend-architecture.md) for route and API inventories, compatibility notes, deployment fallback requirements, and the manual verification checklist. The build decision is recorded in [ADR 001](docs/adr/001-frontend-toolchain-migration.md).

Provider composition remains under `src/app/`, and the shared student/teacher dashboard role predicate remains under `src/features/auth/`. Existing page modules and legacy imports remain in place.

TypeScript adoption is incremental: `tsconfig.json` enables strict checks, allows JavaScript/TypeScript coexistence, and currently includes only the migrated auth predicate and Jalali display formatter. JavaScript lint remains enabled for the existing source tree; `npm run typecheck` is the TypeScript correctness check. When converting a React feature later, add its `.tsx` source to the TypeScript include scope and add compatible React types only if the module needs them. Keep Vite's legacy JSX-in-`.js` compatibility transform unchanged while JavaScript files remain.
