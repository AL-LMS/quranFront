import { describe, expect, it, vi } from "vitest";
import {
  M3_AUTH_V2_BACKEND,
  M3_AUTH_V2_PREFIX,
  m3SyntheticAuthPreview,
} from "./vite-m3-auth-preview.mjs";

const enabled = {
  VITE_ENABLE_M3_AUTH_V2_PREVIEW: "true",
  AL_LMS_M3_AUTH_V2_TLS_CERT: "/fake-local/cert.pem",
  AL_LMS_M3_AUTH_V2_TLS_KEY: "/fake-local/key.pem",
};

describe("M3-AUTH-01F synthetic HTTPS Vite preview", () => {
  it("remains disabled for releases and when the flag is absent", () => {
    expect(m3SyntheticAuthPreview({ command: "build", mode: "production", env: enabled })).toBeNull();
    expect(m3SyntheticAuthPreview({ command: "serve", mode: "development", env: {} })).toBeNull();
  });

  it("fails closed without explicit absolute TLS keys or when other auth demo is enabled", () => {
    expect(() => m3SyntheticAuthPreview({ command: "serve", mode: "development", env: {
      VITE_ENABLE_M3_AUTH_V2_PREVIEW: "true",
    } })).toThrow(/TLS/);
    expect(() => m3SyntheticAuthPreview({ command: "serve", mode: "development", env: {
      ...enabled, VITE_ENABLE_LOCAL_DEMO_AUTH: "true",
    } })).toThrow(/cannot share/);
    expect(() => m3SyntheticAuthPreview({ command: "serve", mode: "development", env: {
      ...enabled, AL_LMS_M3_AUTH_V2_TLS_CERT: "relative.pem",
    } })).toThrow(/TLS/);
  });

  it("selects only the fixed loopback TLS upstream and keeps the browser Origin", () => {
    const readFile = vi.fn((name) => `private:${name}`);
    const configuration = m3SyntheticAuthPreview({
      command: "serve", mode: "development", env: enabled, readFile,
    });
    expect(M3_AUTH_V2_PREFIX).toBe("/api/v2/auth");
    expect(configuration.proxy).toEqual({
      target: M3_AUTH_V2_BACKEND, changeOrigin: false, secure: false, ws: false,
    });
    expect(configuration.tls).toEqual({
      cert: "private:/fake-local/cert.pem", key: "private:/fake-local/key.pem",
    });
    expect(readFile).toHaveBeenCalledTimes(2);
  });
});
