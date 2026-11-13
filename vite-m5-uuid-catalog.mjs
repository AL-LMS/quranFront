/** Strict opt-in Vite-only proxy for the synthetic UUID M5 local API. */
export const LOCAL_UUID_PREFIX = "/__demo/m5-uuid";

export function m5UuidCatalogTarget({ command, mode, env }) {
  if (
    command !== "serve" ||
    mode !== "development" ||
    env.VITE_ENABLE_M5_UUID_CATALOG_PREVIEW !== "true" ||
    env.VITE_ALLOW_M5_UUID_LOCAL_API !== "true"
  ) return null;
  const raw = env.VITE_M5_UUID_TARGET || "http://127.0.0.1:8003";
  let target;
  try {
    target = new URL(raw);
  } catch {
    throw new Error("M5 UUID catalog requires a valid loopback HTTP origin");
  }
  if (
    target.protocol !== "http:" ||
    target.hostname !== "127.0.0.1" ||
    !target.port ||
    target.username ||
    target.password ||
    target.pathname !== "/" ||
    target.search ||
    target.hash
  ) throw new Error("M5 UUID catalog must use a loopback-only HTTP origin with explicit port");
  return target.origin;
}

export function rewriteM5UuidCatalogPath(path) {
  if (!path.startsWith(LOCAL_UUID_PREFIX + "/")) {
    throw new Error("Invalid M5 UUID proxy prefix");
  }
  return path.replace(/^\/__demo\/m5-uuid(?=\/)/, "/api/v2/local-catalog");
}
