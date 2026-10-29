# ADR 001: staged frontend toolchain migration

- Status: accepted for planning; no toolchain migration in AL-01A
- Date: 2026-10-29

## Context

The production application is React 18 on Create React App 5. Routes, RTL styling, Jalali date behavior, and API requests are coupled to existing modules. A build baseline succeeds only after npm legacy peer resolution because `mui-rte` brings a React 17 peer constraint through `@mui/styles`. A build-tool replacement or TypeScript conversion without parity evidence would combine too many risks for a foundation task.

## Decision

Keep CRA, JavaScript, existing dependencies, browser routes, provider order, and endpoint calls in AL-01A. Use npm as the sole package manager, commit `package-lock.json`, and configure npm's legacy peer resolution explicitly for clean installs. Establish application and feature boundaries with a provider composition and a tested route-role predicate.

Plan Vite migration as AL-01B after direct-route and user-flow parity evidence. Plan TypeScript as AL-01C using progressive conversion after the build migration.

## Environment and deployment handling

Before the Vite transition, inventory every `REACT_APP_*` use and deployment injection point. CRA exposes prefixed variables at build time; Vite has different naming and access semantics. AL-01B must map names, distinguish build-time public configuration from runtime deployment configuration, and verify API and WebSocket origins in each deployment environment. No secret may be moved into browser-visible environment variables. Preserve public route fallback/rewrite behavior and verify Persian RTL CSS and Jalali date handling in production builds.

## Consequences

- AL-01A remains deployable by existing CRA hosting assumptions.
- Existing unresolved peer compatibility and CRA maintenance warnings remain visible and documented.
- The Vite change requires a separate parity-focused review; this ADR does not authorize endpoint, route, or UI changes.
