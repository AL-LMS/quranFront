/** Vite-only, explicit loopback proxy for the untrusted synthetic M5-02 demo. */
export function m5TeacherPreviewProxyTarget({ command, mode, env }) {
  const enabled =
    command === "serve" &&
    mode === "development" &&
    env.VITE_ENABLE_CATALOG_UI_PREVIEW === "true" &&
    env.VITE_ALLOW_CATALOG_LOCAL_API === "true" &&
    env.VITE_ENABLE_M5_TEACHER_PREVIEW === "true" &&
    env.VITE_ALLOW_M5_LOCAL_API === "true";
  if (!enabled) return null;

  const raw = env.VITE_M5_DEMO_TARGET || "http://127.0.0.1:8002";
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("M5-03 requires a valid explicit loopback HTTP target");
  }
  if (
    url.protocol !== "http:" ||
    url.hostname !== "127.0.0.1" ||
    !url.port ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error("M5-03 backend must be a loopback-only HTTP origin with an explicit port");
  }
  return url.origin;
}
