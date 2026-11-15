import { readFileSync } from "node:fs";
import { isAbsolute } from "node:path";

export const M3_AUTH_V2_PREFIX = "/api/v2/auth";
export const M3_AUTH_V2_BACKEND = "https://127.0.0.1:18443";

// Only a separately started local fake FastAPI server may receive this route.
// Never select production/staging service URLs or silently fall back to /api.
export function m3SyntheticAuthPreview({ command, mode, env, readFile = readFileSync }) {
  if (env.VITE_ENABLE_M3_AUTH_V2_PREVIEW !== "true") return null;
  if (command !== "serve" || mode !== "development") return null;
  if (env.VITE_ENABLE_LOCAL_DEMO_AUTH === "true") {
    throw new Error("M3 V2 synthetic auth cannot share the legacy local-demo auth preview");
  }
  const cert = env.AL_LMS_M3_AUTH_V2_TLS_CERT;
  const key = env.AL_LMS_M3_AUTH_V2_TLS_KEY;
  if (!cert || !key || !isAbsolute(cert) || !isAbsolute(key)) {
    throw new Error("M3 V2 synthetic auth requires absolute local TLS certificate and key paths");
  }
  return {
    tls: { cert: readFile(cert), key: readFile(key) },
    proxy: {
      target: M3_AUTH_V2_BACKEND,
      changeOrigin: false,
      secure: false, // The upstream is a locally generated, self-signed HTTPS certificate.
      ws: false,
    },
  };
}
