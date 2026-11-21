# AL-M5 F1-R26 — detached catalog response and boundary hardening

Status: **source-only / synthetic-only / draft / not mounted**.
Parent: frontend R25 `3596238f567554e6395850a6a7cdd22ba35a00c3`.
Backend contract pin: R23 `a3152bf6301528d92075d55320af71f8169ec97e`,
`app/modules/catalog/public_catalog_http_r19.py` and
`app/modules/catalog/canonical_http_contract_r5.py`.

## Confirmed adversarial case

The unmounted backend R19 returns **exactly HTTP 200** for successful list
and detail, 404 for missing/hidden detail, 422 for invalid request, and 503 for
missing or broken read authority. The detached frontend consumer previously
treated any mocked response with `ok: true` and a parseable body as successful.
An injected test transport returning `{status: 503, ok: true}` could therefore
display the supplied body, contrary to the backend wire contract. This is a
synthetic response-integrity flaw, not evidence of a live endpoint exploit.

R26 now requires both `response.status === 200` and
`response.ok === true`; status 404 still yields the same private-or-absent
detail state; every other status fails closed with generic Persian text.
AbortError thrown while reading `response.json()` is propagated unchanged
rather than masked, allowing cancellation-aware callers to identify it.

## Offline adversarial coverage

- Contradictory `ok: true` with statuses 201, 204, 206, 299, 422, and 503.
- Contradictory `ok: false` for status 200.
- Detail 404 indistinguishable from private/missing; list 404 not accepted.
- Abort during JSON body read vs generic private/SQL-flavored read failure.
- Control characters, bidi overrides/isolation, leading/trailing U+FEFF
  conservatively rejected by frontend; valid mixed Persian/astral title accepted.
- Empty/full keyset continuation and stale/invalid cursors fail closed.
- R21 RTL UI does not display a private-looking title from a contradictory
  HTTP 503 detail response.

`str.strip()` / `String.trim()` Unicode differences remain a **tracked
review item** from R25; R26 does not change backend text-privacy policy or
claim full cross-language Unicode identity.

## Execution and gates

Dedicated CI is restricted to the R26 branch or PR into the R25 branch:
install from lock, entire frontend test suite, typecheck, lint, build,
prove detached UI has no active source importer, and prove its synthetic
specimen strings are absent from the production bundle.

No real fetch, mounted API, real institution, PostgreSQL/SQL, credentialed
transport, enrollment action, migration, deployment or merge.
Independent security/privacy review #99, physical schema #82,
real catalog API #109, C-01 #144, and G9 remain pending.
A green workflow is verification of synthetic source changes only.
