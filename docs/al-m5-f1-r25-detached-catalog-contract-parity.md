# AL-M5 F1-R25 — detached catalog Unicode contract parity

Status: **source-only, synthetic/offline, unmounted; not approved for G9 or production**.

## Frozen comparison points

- Backend: `AL-LMS/quranBack` R23 at `a3152bf6301528d92075d55320af71f8169ec97e`,
  `app/modules/catalog/canonical_http_contract_r5.py` and
  `app/modules/catalog/public_catalog_http_r19.py`. No backend runtime was invoked.
- Frontend: `AL-LMS/quranFront` R21 at `94981c75bf5ba0c40a5ff33a1d1d8778019a3113`,
  `src/features/catalogPreview/r19DetachedCatalog.js` and the R21 RTL UI specimen.

## Confirmed mismatch and R25 correction

Backend R5 validates `0 < len(title) <= 160` with Python `str` codepoint counting.
The original frontend used JS `title.length`, which counts UTF-16 code units.
For example, 160 book emoji are 160 Unicode codepoints but 320 UTF-16 units.
The backend accepts this length (assuming other policy checks pass); the frontend
previously rejected it.

R25 counts frontend title length with `Array.from(title).length` and adds
regression tests for 160 astral codepoints, 161 astral codepoints, mixed Persian
and astral text, and empty titles. Existing C0/C1 and bidi-control rejection
remains in place; no extra public fields were introduced.

## Contract review matrix

| Area | Backend detached contract | Frontend detached consumer | R25 outcome |
| --- | --- | --- | --- |
| Course ID | Canonical lowercase nonzero UUID | Rejects numeric, uppercase and noncanonical IDs | Aligned |
| Public DTO | Exact `{id,title}` | Rejects extra keys, including private fields | Aligned |
| Title limit | 1–160 Unicode codepoints | Counts codepoints after R25 | Fixed |
| List | `{items,next_after_id}`, sorted UUID keyset, max 50 | Enforces strict shape/order, full-page cursor | Aligned on inspected paths |
| Detail | Not found is 404; failures fail closed | 404 yields absent/private; service errors do not expose server body | Aligned on inspected paths |
| Access | Institution scope is server-controlled | No institution selector, credentials, or production fetch | Detached |

**Residual review item:** Python `str.strip()` and JavaScript `String.trim()`
are not identical for every Unicode whitespace character (e.g. U+FEFF).
The frontend is stricter for at least this case. R25 deliberately does not
loosen text acceptance without a shared Unicode policy/security review.
This is not a claim of bit-for-bit parity for arbitrary Unicode strings.

## Verification and release gates

R25 CI runs `npm ci --ignore-scripts`, the full `npm test`, typecheck,
lint, build, and explicit checks that the detached R21 specimen is unimported
from active source and absent from the production bundle.
It must not call a real backend, issue a database query, mount a public route,
or deploy. Browser/UI preview remains synthetic.

Independent security/privacy review (#99), physical schema review (#82),
real API authorization (#109), C-01 (#144), and G9 remain blocked.
A green R25 check is **not** permission to merge, migrate, expose the API, use
a real institution/identity, or perform PostgreSQL integration testing.
