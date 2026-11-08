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

The Axios response interceptor's code policy remains unchanged: if
`src/api/axios.js` is loaded, any response with status 401 triggers
authentication cleanup and a page reload. This includes a 401 from a public
request when no token is present. A 403 or a network error without an HTTP
response does not trigger cleanup or reload. Changing the global 401 policy
would require a separate API/authentication contract review.

The interceptor is not currently part of the application runtime path:
application components import Axios directly from `axios`, and no runtime
module imports `src/api/axios.js`, `useAxiosPrivate`, or `useRefreshToken`.
The interceptor behavior is covered as a code-level regression so that its
storage cleanup remains safe if that module is wired into the app later.

## Inactive Axios auth hooks

`useAxiosPrivate` and `useRefreshToken` have no application imports and are not
part of the runtime authentication path. `useAxiosPrivate` imports a named
`axiosPrivate` export, but `src/api/axios.js` exports only the default Axios
instance; activating that hook as written would fail to resolve the expected
instance. The hook assumes `auth.accessToken`, while the active login flows
store and expose the backend token as a raw string. It also retries on 403,
whereas the active global interceptor handles 401.

`useRefreshToken` assumes a `GET refresh` endpoint, cookie credentials, and an
`accessToken` response field. No matching active frontend call or approved
refresh contract was established in this review. These hooks remain inactive
and unchanged. Do not activate or repair them until the backend/API owner
approves token shape, endpoint, status semantics, cookie/CSRF behavior, and
refresh/revocation lifecycle.
