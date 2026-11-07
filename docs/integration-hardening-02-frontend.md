# Navigation regression coverage

This reduced PR is based on frontend `main` at
`a121a385035accdfb47f6795204f92963dbae306`. PR #14 already implemented the
role-aware site navigation, and PR #16 added gated local catalog and
enrollment preview links. Their navigation code is preserved unchanged here.

## Current navigation contract

- Navbar and Sidebar use `hasDashboardAccess`; only student and teacher roles
  receive the `/panel/dashboard` link. Guests and unsupported roles receive
  public login/signup links.
- Navbar guest login always targets `/login`. OTP entry and recovery links
  remain in the existing login/signup/OTP pages; pathname-based Navbar routing
  is not used.
- `PrivateRoutes` and `App.js` remain the existing dashboard authorization and
  role-routing boundaries.
- The RTL mobile drawer remains keyboard operable, closes through its close
  button, after link navigation, and on Escape.
- Catalog and enrollment preview routes/links remain behind their explicit
  development flags and are not registered by production builds.

## Scope of this PR

The original Navbar and Sidebar edits are superseded and intentionally omitted.
They used pathname-based guest login routing and treated any `user.role` value
as dashboard access. This PR adds only a focused regression test for Escape
closing the mobile drawer and updates this note to describe the current code.
It changes no authentication, OTP, authorization, enrollment, backend, or
deployment behavior.

The existing navigation tests on `main` cover guest, student, teacher, and
unsupported-role links; login/signup routes; OTP entry; drawer opening, close
button, and preview gating. This added test covers the previously untested
Escape-key close and expanded-state reset.

The enrollment preview remains a synthetic local demonstration. Its fictional
administrator view is not production authorization, and its requests do not
grant course access. See `docs/enrollment-01-local-demo.md` for its local-only
boundaries.
