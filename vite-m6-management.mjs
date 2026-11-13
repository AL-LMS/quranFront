/** M6-LOCAL-UI: development-only loopback proxy to synthetic course writes. */

export const M6_LOCAL_PREFIX = "/__demo/m6-management";
export const M6_REVIEW_PREFIX = "/__demo/m6-review";

export function m6ManagementTarget({ command, mode, env }) {
  if (
    command !== "serve" ||
    mode !== "development" ||
    env.VITE_ENABLE_M6_MANAGEMENT_PREVIEW !== "true" ||
    env.VITE_ALLOW_M6_LOCAL_API !== "true"
  ) return null;

  const raw = env.VITE_M6_MANAGEMENT_TARGET;
  if (!raw) {
    throw new Error("M6 management requires an explicit local-only target");
  }
  let target;
  try {
    target = new URL(raw);
  } catch {
    throw new Error("M6 management target must be a valid loopback HTTP origin");
  }
  if (
    target.protocol !== "http:" ||
    target.hostname !== "127.0.0.1" ||
    target.port !== "8004" ||
    target.username ||
    target.password ||
    target.pathname !== "/" ||
    target.search ||
    target.hash
  ) {
    throw new Error("M6 management target must be http://127.0.0.1:8004");
  }
  return target.origin;
}

export function rewriteM6ManagementPath(path) {
  if (
    path !== M6_LOCAL_PREFIX &&
    !path.startsWith(M6_LOCAL_PREFIX + "/")
  ) {
    throw new Error("Invalid M6 management proxy path");
  }
  return path.replace(/^\/__demo\/m6-management(?=\/|$)/, "/api/v2/local-course-management");
}

/** Separate opt-in reviewer proxy; never accepts a remote host or arbitrary path. */
export function rewriteM6ReviewPath(path) {
  if (path !== M6_REVIEW_PREFIX && !path.startsWith(M6_REVIEW_PREFIX + "/")) {
    throw new Error("Invalid M6 reviewer proxy path");
  }
  return path.replace(/^\/__demo\/m6-review(?=\/|$)/, "/api/v2/local-course-review");
}
