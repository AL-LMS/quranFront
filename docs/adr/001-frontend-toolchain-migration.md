# ADR 001: staged frontend toolchain migration

- Status: accepted; implemented in AL-01B
- Date: 2026-10-29

## Context

The production application is React 18 and JavaScript. Routes, RTL styling, Jalali date behavior, and API requests are coupled to existing modules. The npm install requires legacy peer resolution because `mui-rte` brings a React 17 peer constraint through `@mui/styles` despite the application using React 18.

## Decision

Use Vite 6 with the React plugin, Vitest, and jsdom while retaining React 18, JavaScript, npm, the existing page architecture, browser route declarations, provider order, API call sites, and the CRA-compatible `build/` output directory. Keep a narrow transform for the existing JSX-in-`.js` convention. Keep a targeted CSS-as-text compatibility transform for `@persian-tools/persian-mobile-datepicker`, whose bundled module consumes the `rmc-picker` stylesheet as a string. Preserve npm's legacy-peer setting. TypeScript remains a separate AL-01C task.

No `REACT_APP_*` or `process.env` reads were found in the app, so no environment mapping is needed. Any future public build-time setting must use `VITE_*`; secrets remain server-side. Production hosting must rewrite BrowserRouter paths to `/index.html`. The app continues to derive legacy API and websocket origins from `window.location` as before.

## Consequences

- Existing peer constraints and legacy lint warnings remain documented; no unrelated dependency upgrades are part of this decision.
- The picker stylesheet shim restores the CSS string contract expected by the existing dependency. The legacy teacher create-live form and WebSocket demo were commented out before migration and remain inactive.
- The build and automated compatibility checks establish toolchain parity, but do not verify authenticated production integrations or backend-returned meeting URLs.
