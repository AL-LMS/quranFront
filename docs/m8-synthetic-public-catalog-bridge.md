# AL-M8-CATALOG-01 — student dashboard → public UUID catalog (local-only)

**Status:** optional source-only development preview. This does not activate real M3 authentication, M5 catalog, enrollment, teacher access, or PostgreSQL.

## What it demonstrates

- A synthetic student who has signed into the new M3 preview can *separately* browse publicly visible synthetic UUID course titles from the existing M5 local catalog API.
- The dashboard's **My courses** and learning-progress values remain empty: a public catalog listing is not an enrollment request, a reviewer decision, an effective grant, or a protected lesson.
- The existing `listLocalUuidCourses` API enforces an exact `{id, title}` public allowlist, UUID checks, exact pagination, `X-AL-LMS-Data-Scope: synthetic-only`, and fetches with `credentials: "omit"`. Unknown provenance, unavailable API, malformed fields and duplicate UUIDs fail closed without showing fallback/example data.
- The bridge mounts **only** when all *five* dev-time conditions hold. Production and ordinary local previews are unaffected:
  - `import.meta.env.DEV === true`
  - `VITE_ENABLE_M3_AUTH_V2_PREVIEW=true`
  - `VITE_ENABLE_M5_UUID_CATALOG_PREVIEW=true`
  - `VITE_ALLOW_M5_UUID_LOCAL_API=true`
  - `VITE_ENABLE_M3_M5_PUBLIC_COURSES_BRIDGE=true`
- The already vetted M5 loopback target must remain explicit and numeric: `VITE_M5_UUID_TARGET=http://127.0.0.1:8003`. A public course detail link opens the existing `/__preview/m5-uuid/:id` view. There are **no** writes and no student/teacher membership interpretation.

## Optional two-service local browser rehearsal

Use clean, separately checked-out backend sources with only fictional data. The M3 auth backend runner is currently in **draft backend PR #140**; the existing M5 local UUID catalog service belongs to **backend `main`**. Do not combine real credentials or SQL into either runner.

Terminal A — run the existing M5 public synthetic service from a current backend `main` checkout:

```bash
cd ~/Dev/AL-LMS/quranBack
python3 -m devtools.m5_local_uuid_catalog
```

Expected synthetic service on `http://127.0.0.1:8003`. If this checkout is missing dependencies or the service, stop; do not redirect to a real API.

Terminal B — fetch the exact draft frontend preview into a **new, isolated worktree** first. Run these commands from an existing `quranFront` checkout; use a different destination if `../quranFront-m8-catalog` already exists:

```bash
cd ~/Dev/AL-LMS/quranFront
git fetch --no-tags origin pull/41/head
git worktree add --detach ../quranFront-m8-catalog FETCH_HEAD
cd ../quranFront-m8-catalog
npm ci
```

Then run the existing M3 HTTPS auth preview from that new worktree, using its separate backend worktree:

```bash
cd ~/Dev/AL-LMS/quranFront-m8-catalog
source ~/Dev/AL-LMS/quranBack-m3-auth-preview/.venv/bin/activate
VITE_ENABLE_M5_UUID_CATALOG_PREVIEW=true \
VITE_ALLOW_M5_UUID_LOCAL_API=true \
VITE_M5_UUID_TARGET=http://127.0.0.1:8003 \
VITE_ENABLE_M3_M5_PUBLIC_COURSES_BRIDGE=true \
AL_LMS_M3_AUTH_V2_BACKEND_DIR="$HOME/Dev/AL-LMS/quranBack-m3-auth-preview" \
bash scripts/run_m3_auth_v2_local.sh
```

Open `https://127.0.0.1:15173/__preview/m3-auth/signup`, create and verify a *fresh* fictional account, then sign in. The dashboard shows an **independently labeled public synthetic catalog**. The M3 server's in-memory identities reset on every restart; verify each new account before SMS login. Stop both services with Ctrl+C.

## Acceptance and hard boundaries

1. Successful authenticated `/me` allows the dashboard to display the extra **public catalog**, not *my enrolled courses*.
2. The catalog fetch sends **no cookies** and includes no user identifier, session token, role, teacher grant or enrollment evidence.
3. A missing `X-AL-LMS-Data-Scope` response, unexpected private field, wrong UUID, or unreachable API displays an error or empty state, never fallback fixtures.
4. After logout, the dashboard itself remains server-session gated; standalone M5 public details remain anonymous and separate.
5. The actual first **real** published-course DTO, institution/ownership/publication evidence, effective grant, physical DB authority, independent security and G9 gates remain OPEN. This is not a release or merge authorization for backend PR #140.

Run `npm test -- src/features/authV2/M8PublicCatalogBridge.test.jsx`, `npm run typecheck`, `npm run lint`, `npm run build` for source-level verification. A browser acceptance run with both synthetic services is still required before labeling the integration fully accepted.
