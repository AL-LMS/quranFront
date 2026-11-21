# AL-M5 F1-R27 — shared synthetic catalog wire vectors

Status: **source-only, offline, draft, not mounted**.

## Two pinned implementations

- Backend source-only R5 on R24 lint branch `128a3f54983d9be1aa0446d6e8ff52c37d575aba`
  (semantic wire baseline R23 `a3152bf6301528d92075d55320af71f8169ec97e`).
  R27 branch: `test/al-m5-f1-r27-shared-wire-vectors-source-only-20261121`.
- Frontend detached R26 `495ffa965cae542b1f382650d2677c5cb9bc1cf4`.
  R27 branch: `test/al-m5-f1-r27-shared-wire-vectors-20261121`.

Both repositories contain the **same exact JSON fixture** (GitHub content blob
SHA `0d1a49420f47ff65cd94dbff5f99145df8364d22`, verified at upload):

| Repository | Fixture | Consumer |
| --- | --- | --- |
| `quranBack` | `tests/catalog_f1/fixtures/r27_shared_wire_vectors.json` | `tests/catalog_f1/test_r27_shared_wire_vectors.py` |
| `quranFront` | `src/features/catalogPreview/r27SharedWireVectors.json` | `src/features/catalogPreview/r27SharedWireVectors.test.js` |

The 26 fabricated cases cover seven canonical/rejected UUIDs, ten Unicode
title acceptance boundaries, and nine valid/invalid ordered keyset pages.
Valid rows contain **only** `id` and `title`; no institution or real user
records. The test corpus includes 160/161 astral Unicode boundaries and
actual uppercase hexadecimal UUIDs.

Each consumer executes the **same input expectations** independently against
its pinned implementation. This is a snapshot conformance test, **not**
a runtime frontend-to-backend API call or proof that future code automatically
stays synchronized. Any change to either semantic baseline requires a reviewed
fixture update and matching re-verification.

## Limits and observed asymmetries

- Backend `parse_list_query` defaults to limit 20; the frontend explicitly
  sends its chosen limit 12. These are not conflicting wire responses.
- Python `str.strip()` and JS `String.trim()` differ on some Unicode inputs
  (notably U+FEFF). This deliberately remains a review item. The shared
  positive corpus uses only values accepted by both.
- A matching synthetic projection does not prove server-side title privacy,
  institution isolation, live authorization, or transactional consistency.
- Backend branch-only CI is used because generic backend PR CI would launch
  PostgreSQL, which has **not** been authorized here. Therefore R27 backend
  is **not** opened as a backend PR or merged.

## Tests and release gates

Backend: four R27 `unittest` cases plus 336 inherited source-only checks in
a branch-only workflow, full Ruff lint; no PostgreSQL, Docker, SQL, or live
HTTP. Frontend: five R27 Vitest cases plus inherited tests, typecheck, lint,
build and production-exclusion gates in the R27 draft PR.

Independent security/privacy review #99, physical schema #82, real catalog
API #109, C-01 #144, and G9 remain pending. No merge, deployment,
migration, real identity, credentialed fetch or public route activation.
