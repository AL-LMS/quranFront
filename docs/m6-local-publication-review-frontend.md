# M6-LOCAL-UI-03 — Persian RTL synthetic course-publication preview

**Tracker:** [frontend #33](https://github.com/AL-LMS/quranFront/issues/33). **Backend dependency:** merged [#128](https://github.com/AL-LMS/quranBack/pull/128) `8df0417a3538008785dfdb9e6357b5e04596a66d`.

This developer preview shows a **fabricated** manager submitting a draft for publication and a **separately token-gated** local reviewer approving or revoking it. The existing synthetic public UUID catalog then exposes or hides the title. No real institution, verified identity, publisher issuer, production schema or deployment authority is provided.

## Development-only enablement

Backend: use the existing exact isolated tmpfs PostgreSQL guard and deliberate opt-in:

```bash
cd ~/Dev/AL-LMS/quranBack
git switch main
git pull --ff-only origin main
bash scripts/m5-local-pg.sh up
.venv/bin/python -m devtools.m5_disposable_pg_catalog \
  --enable-course-management --enable-local-review
```

The local runner checks the unique disposable Docker container, dedicated synthetic database, loopback port and absence of persistent mounts and existing schema. It prints **TWO DISTINCT ephemeral tokens**, not human accounts:
`X-AL-LMS-Local-Admin-Token` and `X-AL-LMS-Local-Reviewer-Token`. Keep both in separate local browser pages, never save to password managers, paste in GitHub/chat, browser URLs, shell history or `.env`.

Frontend:

```bash
cd ~/Dev/AL-LMS/quranFront
git switch main
git pull --ff-only origin main
npm ci
VITE_ENABLE_M6_MANAGEMENT_PREVIEW=true \
VITE_ENABLE_M6_REVIEW_PREVIEW=true \
VITE_ALLOW_M6_LOCAL_API=true \
VITE_M6_MANAGEMENT_TARGET=http://127.0.0.1:8004 \
npm run dev -- --host 127.0.0.1 --port 5174 --strictPort
```

- Manager page: `http://127.0.0.1:5174/__preview/m6-management`. Enter **only manager token**, create/select draft, click `ارسال برای بررسی انتشار آزمایشی`. Submission is NOT approval.
- Reviewer page: `http://127.0.0.1:5174/__preview/m6-review`. Enter **only reviewer token**, select submitted request and confirm approval; the approved course becomes visible in the existing dev-only synthetic public catalog. Revoke using populated course UUID/version, two-step confirmation; visibility disappears.
- The second flag is required for reviewer route and its proxy; existing manager route and production build remain unchanged when it is off. Proxy target must be *exactly* `http://127.0.0.1:8004`; no remote/localhost alias, credentials, path or query are permitted.
- The reviewer proxy `/__demo/m6-review` rewrites to `/api/v2/local-course-review` and uses the same-origin Vite proxy. Request headers carry tokens, `credentials:omit`, `cache:no-store`, `redirect:error`. No localStorage/sessionStorage/cookies/persistent token state. Field validators enforce exact synthetic DTO shapes; frontend never displays server private error content.
- Token input `autocomplete=new-password` discourages accidental password-manager prompts but **browsers may ignore** this hint. Do not save these temporary tokens.

## Manual acceptance checklist

1. Create fresh course draft v1 and verify public detail 404.
2. Manager submit publication request v1, receive confirmation; still public 404.
3. Reviewer sees it only after entering reviewer token, approves v1; course becomes published v2 and synthetic public detail 200.
4. Revoke published version 2 with reviewer token; course becomes draft v3 and public detail 404. Verify stale approve/revoke returns safe 409.
5. Wrong token, absent token, both headers or disabled backend produce safe 403/503 respectively; ensure no token in URL, console, storage or error text.
6. Disconnect both pages, stop frontend and backend processes, then run only `bash scripts/m5-local-pg.sh status` / `down` on the exact disposable container. Do not touch existing Docker volumes or other projects.

The first browser acceptance after frontend merge must be **owner-reported** separately from CI. No claim of real PostgreSQL production schema, real permission issuer, enrollment, payment or deployment is made. Current gates [backend #82](https://github.com/AL-LMS/quranBack/issues/82), [#98](https://github.com/AL-LMS/quranBack/issues/98), [#99](https://github.com/AL-LMS/quranBack/issues/99), [#109](https://github.com/AL-LMS/quranBack/issues/109) and [#24](https://github.com/AL-LMS/quranBack/issues/24) remain HOLD.
