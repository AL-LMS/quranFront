# AL-SEC-AUTH-01: Authentication storage review

## Storage behavior

The current authentication context reads `token`, `user`, and `role` from
local storage. The OTP flow stores its pending `phone` value there until
verification. Logout and the existing global 401 handler therefore clear
those four authentication/session-flow keys. Other keys belong to application
features: `dtab` stores the dashboard tab, while `time` and `dnq` store quiz
progress. Authentication cleanup must preserve them.

Before this change, calls such as `localStorage.clear("token")` did not remove
only the named key: the Storage API ignores arguments to `clear()` and empties
the entire origin storage. The logout, profile refresh, and 401 paths could
therefore erase unrelated feature state. The implementation now removes only
the four authentication/session-flow keys. Logout also resets the in-memory
`auth`, `user`, and `role` context values to `null` before navigating to the
existing `/send-otp` route.

## Active global Axios interceptor

`index.html` loads `src/index.js`, and `src/index.js` imports
`./api/axios` before rendering the application. That module installs a
response interceptor on Axios's shared default client. Application modules
also import that same client directly from `axios`, so the interceptor is
active during application startup and its policy applies to Axios requests
made through the shared client.

The existing policy remains unchanged: any response with status 401 triggers
authentication cleanup and a page reload, potentially including public API
requests and requests made when no token is present. A 403 or a network error
without an HTTP response does not trigger cleanup or reload. Whether public
401 responses should trigger global logout/reload remains an unresolved
authentication policy decision; this change preserves existing behavior.

## Inactive Axios auth hooks

`useAxiosPrivate` and `useRefreshToken` have no application imports and are
unused. Their presence does not control the active global interceptor,
installed at startup as described above. `src/api/axios.js` exports neither a
default client nor a named `axiosPrivate` client. Consequently,
`useRefreshToken`'s default import and `useAxiosPrivate`'s named import do not
match that module's exports; activating either hook as written would fail to
resolve its expected Axios client.

The hooks also assume `auth.accessToken`, while active login flows store and
expose the backend token as a raw string. `useAxiosPrivate` retries on 403,
whereas the active global interceptor handles 401.

`useRefreshToken` assumes a `GET refresh` endpoint, cookie credentials, and an
`accessToken` response field. No matching active frontend call or approved
backend refresh contract was established in this review. These hooks remain
inactive and unchanged. Do not activate or repair them until the backend/API
owner approves token shape, endpoint, status semantics, cookie/CSRF behavior,
and refresh/revocation lifecycle.
