# AL-M5 F1-R19 — detached Persian frontend catalog contract

Status: **source-only, not mounted, not merged, not deployed** (2026-11-20).

## Backend-to-frontend compatibility

- Canonical R19 endpoints: `GET /api/v2/courses?limit=12&after_id=<uuid>` and `GET /api/v2/courses/<uuid>`.
- List shape: `{ "items": [{"id":"<uuid>","title":"..." }], "next_after_id": "<uuid>|null" }`.
- Detail shape: `{ "id":"<uuid>","title":"..." }`. Missing or hidden is a generic 404, authority unavailable is a generic 503.
- Client rejects legacy integer identifiers, unknown/private fields, malformed titles, reordered or duplicate UUID items, inconsistent continuation tokens, and pagination outside 1–50.
- Institutional scope is server-provided; the browser does not send it.
- No raw response caching, private title leakage, automatic credential forwarding, or implicit enrollment.

## Current integration boundary

The existing `src/features/catalogPreview` UI and its integer-ID synthetic fixture remain unchanged to avoid breaking M8 local preview. The new `r19DetachedCatalog.js` is not imported by any page, router or production HTTP path. Its optional injected transport is for isolated contract tests only. There is no fallback to real browser `fetch`.

Before any integration or public activation, obtain independent approval of trusted authoritative publication/title-privacy source, institution scoping, SEC02 identity and DB01/DB02 concurrency/audit/recovery design, and explicit G9/DB authorization. Retain G9 lock and R12 synthetic-specimen limitations.

## Offline test

`npm test -- src/features/catalogPreview/r19DetachedCatalog.test.js`

No live backend/SQL/PostgreSQL, migrations, production API, credentials or deployment.
