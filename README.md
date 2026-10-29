# AL-LMS frontend

React 18 application built with Create React App (`react-scripts` 5). The production entry, public URLs, Persian RTL styling, and Jalali date helpers remain on the existing stack during this foundation task.

## Development commands

Use Node.js 24 LTS and npm 11 (the committed `package-lock.json` is authoritative).

```sh
npm ci
npm start
npm test -- --watchAll=false
npm run build
```

`npm ci` uses the repository `.npmrc` peer resolution setting to accommodate the existing `mui-rte` / `@mui/styles` React 17 peer declaration alongside the app's React 18 installation. This preserves the locked dependency graph; see [the baseline and known issues](docs/frontend-architecture.md#baseline-2026-10-29).

## Architecture

See [Frontend architecture and migration roadmap](docs/frontend-architecture.md) for current boundaries, route and API maps, compatibility notes, and the staged Vite/TypeScript migration plan. An architectural decision record is in [ADR 001](docs/adr/001-frontend-toolchain-migration.md).

The current extraction is intentionally small: provider composition lives under `src/app/`, and the shared student/teacher dashboard role predicate lives under `src/features/auth/`. Existing page modules and legacy imports remain in place.
