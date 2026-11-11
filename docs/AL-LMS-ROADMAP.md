# AL-LMS Frontend — current MVP delivery roadmap

**Checkpoint:** 2026-11-11 | **Scope:** `AL-LMS/quranFront` frontend planning/evidence, not a release authorization.  
**Verified frontend `main` at preparation:** `f3d375af0809a0b3f222f7656fb41344d1c6747a`.  
**Verified backend `main` at preparation:** `28d398c2c6f2083da67bad27810252a3f4b32216` (merged [backend PR #103](https://github.com/AL-LMS/quranBack/pull/103)).  
**Cross-repository canonical plan:** [Backend roadmap](https://github.com/AL-LMS/quranBack/blob/main/docs/AL-LMS-ROADMAP.md), [backend solo-owner execution #101](https://github.com/AL-LMS/quranBack/issues/101). Re-fetch both `main` revisions when any new work starts. These SHA values are historical checkpoint pins, not claims of the current branch state forever.

**Product target:** a **web-first, responsive, Persian/RTL, initially single-institution** LMS MVP. Payments/wallet/packages, live classroom integrations, and native/mobile apps are out of the **first MVP** scope. Existing legacy routes/screens stay in the repository for compatibility; presence does **not** indicate a supported or authorized greenfield backend API.

**Current staffing:** project owner is the sole active backend developer and technical decision-maker; Codex/ChatGPT are implementation/review assistance, not independent security approvers. There is **no appointed independent real-auth security reviewer**. Legacy contributor `Amirhos-123` is not the project's current reviewer. The frontend's [draft PR #25](https://github.com/AL-LMS/quranFront/pull/25) remains **open, unmerged, preserve**.

## 1. Shared cross-repository milestone pulse

| Milestone | Current **frontend** status | Concrete browser deliverable / next dependency |
| --- | --- | --- |
| **M0–M2: Developer foundation and synthetic demo** | **DONE for scoped local-only work** | React 18 + Vite, incremental TypeScript, RTL/Jalali and local-only synthetic password/OTP demos verified previously; no real authenticated school users or production sessions. Source: [frontend README](../README.md), [architecture](frontend-architecture.md), [local enrollment demo](enrollment-01-local-demo.md). |
| **M3: Real identity and sessions** | **DESIGN DEPENDENCY / NOT INTEGRATED** | Backend [#100](https://github.com/AL-LMS/quranBack/pull/100), [#102](https://github.com/AL-LMS/quranBack/pull/102), [#103](https://github.com/AL-LMS/quranBack/pull/103) merged documentation/contracts; owner selected 256-bit opaque bearer, 30m idle/12h absolute, Secure/HttpOnly host-only HTTPS cookies and mandatory CSRF. **No real web login or V2 auth endpoints** authorized. Frontend needs exact API origin/cookie and CSRF UX, session restoration and deny/revoke states after G1/G5/security review. |
| **M4: Greenfield PostgreSQL authority** | **BLOCKED ON BACKEND** | New AL-LMS-owned PostgreSQL and explicit institution, UUID account/course/enrollment IDs selected architecturally; **physical schema/access not approved**. Frontend must not assume legacy IDs, bearer roles or demo membership are real. [DB gate #82](https://github.com/AL-LMS/quranBack/issues/82). |
| **M5: Public catalog / teacher course lifecycle** | **SYNTHETIC PREVIEW VERIFIED, REAL CONTRACT PENDING** | Anonymous published-course list/detail with approved public fields and no unpublished/private leakage; later teacher create/submit/review/publish based on backend scoped authority. Existing development-only previews must remain gated, not made production routes by toggling a flag. [M5 preview notes](m5-03-synthetic-teacher-course-preview.md). |
| **M6: Student enrollment** | **SYNTHETIC PREVIEW ONLY** | Authenticated student request, explicit review status, and grant-aware course navigation; **request, durable enrollment and effective course-access grant are different**. Demo admin controls are fictional and not server authorization. |
| **M7: Quizzes and assessment** | **NOT READY FOR REAL INTEGRATION** | Quiz D1/D2 ownership, answer persistence, deadlines, result publication and authorized student/teacher field access need separate approved API/authority. Backend [draft #73](https://github.com/AL-LMS/quranBack/pull/73) remains open. |
| **M8: Integrated student / teacher / admin UX** | **LEGACY UI PRESENT, REAL NEW CONTRACTS PENDING** | One versioned V2 adapter for verified sessions, API status/error handling, current roles, institution context, resource-scoped pages, RTL/mobile regression, logout/revocation. Existing navigation guard does **not** authorize backend access. |
| **M9: Private pilot** | **NOT AUTHORIZED** | Security, privacy, frontend security headers/CSRF, accessibility, E2E, observability, rollback/restore and owner-approved deployment environment; no live site changes. |

**Same stage names as backend roadmap**; milestone ordering is dependency-driven and product-slice acceptance, not a promise that each unfinished area has already received an implementation permit.

## 2. Frontend-specific next work (priority order)

| Priority / scope | Deliverable and tests | Prerequisite / permission |
| --- | --- | --- |
| **F0 — NOW: source-only API and browser trust map** | Decide frontend origin and backend V2 API origin; list each legacy public/teacher/student screen and its actual HTTP owner, session storage, auth header, CSRF, response/error fields. Map to **proposed versioned new endpoints** without claiming a backend route exists. Keep sanitized evidence and no real network/credential calls. | Documentation/source inventory only, grounded in [API inventory](api-contract-inventory.md), [ownership gaps](api-ownership-gaps.md) and [routing](local-development-api-routing.md). |
| **F1 — safe public catalog contract** | Source-only/public DTO: title, brief description, status and teacher display only if approved; verify no unpublished material or private fields. A local preview regression can continue only under an explicit bounded test scope. | Backend course source/owner, public-field and anonymous G4 policy, explicit G9 for real API integration. |
| **F2 — real browser session adapter** | A single opt-in versioned V2 client using reviewed HTTPS host-only cookies, CSRF defense, server session status, signed-out/suspended/expired UX and safe retry; never persist new bearer in localStorage or silently reuse legacy JWT. | Formal backend real verifier and credential gate (#98/#99/#24), exact cookie/SameSite/Origin/CORS and CSRF design, frontend G5 review and real endpoint authorization. |
| **F3 — teacher course authoring** | Create/edit/publish own courses; deny other teachers by server evidence; front-end disable state is only UX. | Current approved institutional membership, teacher/course grant source and G4 write/field policy. |
| **F4 — enrollment request/review** | Student request, duplicate/re-request, authorized reviewer decision, separation of request status from enrollment/grant, explicit no-access state and revocation UI. | Approved M6 state machine and real server-side issuer/access policy; secure real session F2. |
| **F5 — quiz and learner progress** | Persist/resume attempt, deadline, answer and release states, teacher authorized grading access and privacy-safe errors. | Backend quiz D1/D2, real attempt source and per-action/field policies. |
| **F6 — E2E and private-pilot release** | Responsive RTL/accessibility, login/logout/expiry/CSRF security regression, negative cross-user/course/institution tests, headers, logging, rollback and safe configuration. | Completed and independently reviewed scoped features plus explicit private environment and deployment authorization. |

**Known integration hazards:** The earlier frontend source inventory found requests spread across `api.srvschool.ir`, `daarolquran.com/back_request` and routes whose source ownership is not identified. Do **not** guess that all `/authen`, `/quiz`, `/course`, payments, forum or archival endpoints are now owned by the modular backend. Current `app.main` is not evidence that a matching real endpoint exists. Choose and document a versioned migration, never swap baseURL wholesale. Existing misspelled browser routes such as `/panel/my-coures`, `/panel/new-coures`, `/panel/coures` and `/quizes` require compatibility handling.

## 3. First real-user journeys and completion tests

1. **Visitor:** published course cards and limited detail only; no unpublished, enrollment, roster, grades, phone or private teacher data.
2. **Student:** identity verified through separately approved password or SMS OTP; server-authoritative active status; request enrollment; reviewer approval alone grants **no access**; course content opens only with effective current grant.
3. **Teacher:** current scoped teacher grant bound to owned course; edit/create/review states enforced by backend; unrelated course/student and administrative secrets never leak.
4. **Quiz:** approved attempt authority, server deadline and one current student subject, durable saves and controlled result release. Still gated by D1/D2.
5. **Browser security:** expired/revoked/suspended session results in safe signed-out state; CSRF denied even with cookie on unsafe request; no authorization solely from role string, localStorage or UI routing.
6. **Pilot:** only with explicit G7 and independent security/ops/privacy release gate; payments, live-class and native apps remain outside first-MVP acceptance.

## 4. Merge, worktree and local-branch cleanup discipline

The owner requests **both local repositories eventually return to a clean primary `main` worktree with no obsolete merged local feature/docs branches**. GitHub connectors can read/modify remote repos but **cannot inspect or delete a user's local working trees**; perform this procedure with local Codex only after the roadmap docs PRs are merged and verified.

**Audit first, never assume deletion is safe:**
```sh
git fetch origin --prune
git status --porcelain=v1 -uall
git worktree list --porcelain
git branch -vv
git branch --merged origin/main
git stash list
```
For **each auxiliary worktree**, verify actual directory ownership, clean tracked and untracked state, and that its branch commits are reachable from `origin/main` before using `git worktree remove <exact verified path>`. If dirty, ignored/untracked, unmerged, backup, tied to an open/draft PR or of unknown ownership: **KEEP and report**. After safe auxiliary removal, for each non-current **fully merged local** branch, use `git branch -d <exact local branch>`; never `-D`. Return primary repository to clean local `main`, then `git pull --ff-only` only when safe. Protect `fix/al-sec-auth-01-storage` (open [PR #25](https://github.com/AL-LMS/quranFront/pull/25)) and other live/backup branches. **Do not delete remote branches** as part of local hygiene.

Never invoke `git clean -fdx`, `git reset --hard`, `git stash clear`, `rm -rf`, `git branch -D`, `docker compose down -v`, or force worktree deletion. Never alter protected local demo volumes, secret material or quarantined environments during Git cleanup. This roadmap does not prove local cleanup is already complete.

## 5. Documentation and gate pointers

- [Backend current roadmap](https://github.com/AL-LMS/quranBack/blob/main/docs/AL-LMS-ROADMAP.md) and [execution Issue #101](https://github.com/AL-LMS/quranBack/issues/101)
- [Approved design/session direction](https://github.com/AL-LMS/quranBack/blob/main/docs/security/al-lms-m3-s2-c2-owner-session-baseline-20261111.md)
- [M3 real-identity decision gate #98](https://github.com/AL-LMS/quranBack/issues/98) and [independent review #99](https://github.com/AL-LMS/quranBack/issues/99)
- [M4 physical schema / environment approval #82](https://github.com/AL-LMS/quranBack/issues/82) and [credential Gate 1 #24](https://github.com/AL-LMS/quranBack/issues/24)
- Frontend [architecture](frontend-architecture.md), [API inventory](api-contract-inventory.md), [API ownership gaps](api-ownership-gaps.md), [local routing](local-development-api-routing.md), [synthetic enrollment preview](enrollment-01-local-demo.md)

**Do not treat roadmap merge, demo tests, ChatGPT code review or owner feature direction as independent security approval, SQL permission, real login or production release.** All formal G0–G8 security gates still pending, G9 ungranted, and real credential, DB and deployment scopes separately blocked.
