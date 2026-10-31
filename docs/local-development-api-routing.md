# Local development API routing and gaps

## Routing

| Browser path | Local target | Contract status |
|---|---|---|
| `/legacy/back_request/*` | Legacy `main:app` at `legacy-api:8000`; Vite removes `/legacy` | Route families and action dispatch are present in source. Backing database schema is absent from this local database, so DB operations are not usable until an authorized schema is provided. OTP routes retain their existing authentication/SMS behavior; outbound provider access is blocked by the internal Docker network. |
| `/api/*` | V2 `app.main:app` at `v2-api:8000` | V2 exposes `/health/live` and, only when separately enabled, `/api/v2/catalog/courses`; the local profile does not enable preview. Other paths return 404. |
| Legacy image/file paths | `/legacy/back_request/...` | Existing legacy file handlers are routed locally. Authorization and file behavior are unchanged and remain subject to the legacy app's existing behavior. |
| Historical external API-host media paths | `/legacy` plus the existing path | Kept on the local backend in local mode; a 404 remains a visible missing route. |
| WebSocket legacy paths | `/legacy/...` with Vite WebSocket proxy | Proxy configured; no active frontend WebSocket caller was found. |

Local mode sets Axios' base URL to `/api/` and the legacy helper base to
`/legacy/`. Legacy media links that formerly bypassed Axios also use the local
proxy. The IP lookup is skipped in local mode, and the external meeting redirect
is stopped with a message. Production URL behavior remains the default when
local Vite overrides are absent. The internal bridge has no external route, so
backend containers cannot reach SMS/payment providers.

## Unmatched frontend REST endpoints

The source-level inventory in [`api-contract-inventory.md`](api-contract-inventory.md)
records **42 distinct REST-style Axios path templates** not found in either
FastAPI app inspected (legacy generic dispatcher actions are separately
matched). In local mode these go to V2 and return 404 unless a route exists;
they are not implemented or represented as functional here.

Unmatched route families:

- `/authen/*`, `/refresh`
- `/course/*` REST resources
- `/dashboard/*`, `/notification/*`
- `/quiz/*`, `/forum/*`, `/archive/*`
- `/package/*`, `/slider/*`, `/live/*`
- `/zarinpal/*`

The precise path list, call sites, inferred request/response shapes, and
authentication notes are in the existing API contract inventory. This report
does not infer that these services are absent in production; it only states that
handlers were not present in the inspected repositories. No API, SMS, payment,
or authentication request was sent to verify external services.
