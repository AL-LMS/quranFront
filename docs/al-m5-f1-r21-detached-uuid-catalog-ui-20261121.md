# AL-M5 F1-R21 — detached Persian UUID catalog UI and synthetic navigation

**2026-11-21 | SOURCE-ONLY / NO ROUTE / NO REAL API / NOT G9.**
Parent: R19 frontend contract at `415fd140de2d863ea762ff5ff8976dd16067dfed`. Backend R19 HTTP specimen at `26ada425b7384ef93b4e786bd8196327ebbd5b5e` is not a real route, and the R20 title-review revocation candidate is not a real authority. Their restrictions remain unchanged.

## What the isolated UI does

- Adds `R21DetachedCatalogPreview.js`, a reusable right-to-left Persian React list/detail component. It accepts **only an explicitly injected `transport` function**, never imports `fetch` or assumes a backend URL. When the function is absent it displays a disconnected state.
- Uses the existing strict R19 `id,title` public DTO and canonical UUID parser. The list has a keyset continuation stack (`after_id`) with previous/next navigation, no numeric-ID casting, offset, total count, category/search filter, institution selector, enrollment or payment UI.
- Shows generic loading, empty, unavailable, hidden-or-missing detail and disconnected states. React renders titles as text; no `dangerouslySetInnerHTML`, no private payload fields, server errors or automatic credentials.
- Adds `r21SyntheticCatalogTransport.js` with 25 fabricated UUID/title examples. This fake is strictly for tests and explicitly injected by the test caller. It rejects extra/duplicate query keys, out-of-range limits, legacy IDs and included credentials.
- Tightens the detached R19 client to reject a `200` detail response whose public UUID does not match the requested UUID (a defensive consistency check).

The **existing M8 preview** still has its older integer IDs and five-field search/filter UX. R21 does not change its routes, code, fixtures or production bundle. R21 is not imported by `App.js`, site pages, active routers, public transport or the old M8 preview. There is no URL from which a user could open R21 in the running site.

## Test and security boundaries

`npm test -- src/features/catalogPreview/r19DetachedCatalog.test.js src/features/catalogPreview/r21DetachedCatalog.test.js`

New tests cover:
- synthetic-only rows and strict UUID sorting,
- exact UUID keyset pages, list/hidden detail shape,
- scope injection/duplicate/offset/credentials rejection,
- default disconnected and no browser `fetch`,
- Persian RTL list, forward/back keyset and matching detail,
- safe 404/503-like error copy without private details,
- rejection of extra private row fields and mismatched detail UUID,
- stale in-flight transport response discarded on source change,
- empty catalog and disabled next action.

Branch-only CI runs all frontend tests, typecheck, lint, build and absence checks. A green build proves only source/UX consistency, **not** human publication approval, authenticated issuer, real SQL, session, G4/G9 or production readiness.

## Future live integration (separately gated)

1. Qualified review and physically approved canonical course/publication/title privacy authority (#109, #144, #99, #82). R20's proposed ledger and independent transaction writer have not been approved.
2. Explicitly authorized trusted server-side institution scope and transaction-consistent list/detail read port with current revocation and PUB-08 semantics.
3. Separate executable G9, negative integration tests and field/privacy review before mounting a real backend route.
4. Only then, separately approved real frontend data binding, E2E navigation tests and deployment plan. Do not activate this isolated component by an environment flag or route before that decision.

**Current state: detached local-test specimen only.**
