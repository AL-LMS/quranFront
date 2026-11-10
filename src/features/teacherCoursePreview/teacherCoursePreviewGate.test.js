import { describe, expect, it } from "vitest";
import { teacherCoursePreviewEnabled } from "./teacherCoursePreviewGate";
import { m5TeacherPreviewProxyTarget } from "../../../vite-m5-teacher-preview.mjs";

const flags = {
  catalogFlag: "true", catalogApiFlag: "true", m5Flag: "true", m5ApiFlag: "true",
};
const proxyEnv = {
  VITE_ENABLE_CATALOG_UI_PREVIEW: "true",
  VITE_ALLOW_CATALOG_LOCAL_API: "true",
  VITE_ENABLE_M5_TEACHER_PREVIEW: "true",
  VITE_ALLOW_M5_LOCAL_API: "true",
};

describe("M5-03 hard build and proxy opt-in", () => {
  it("requires all four flags and development runtime", () => {
    expect(teacherCoursePreviewEnabled({ ...flags, dev: true })).toBe(true);
    expect(teacherCoursePreviewEnabled({ ...flags, dev: false })).toBe(false);
    for (const key of Object.keys(flags)) {
      expect(teacherCoursePreviewEnabled({ ...flags, [key]: "false", dev: true })).toBe(false);
      expect(teacherCoursePreviewEnabled({ ...flags, [key]: undefined, dev: true })).toBe(false);
    }
  });

  it("never creates the fixture proxy during builds or in non-development mode", () => {
    expect(m5TeacherPreviewProxyTarget({
      command: "build", mode: "development", env: proxyEnv,
    })).toBeNull();
    expect(m5TeacherPreviewProxyTarget({
      command: "serve", mode: "production", env: proxyEnv,
    })).toBeNull();
    expect(m5TeacherPreviewProxyTarget({
      command: "serve", mode: "development",
      env: { ...proxyEnv, VITE_ALLOW_M5_LOCAL_API: "false" },
    })).toBeNull();
  });

  it("permits only an explicit local HTTP port", () => {
    expect(m5TeacherPreviewProxyTarget({
      command: "serve", mode: "development", env: proxyEnv,
    })).toBe("http://127.0.0.1:8002");
    expect(m5TeacherPreviewProxyTarget({
      command: "serve", mode: "development",
      env: { ...proxyEnv, VITE_M5_DEMO_TARGET: "http://127.0.0.1:18002" },
    })).toBe("http://127.0.0.1:18002");
    for (const target of [
      "https://127.0.0.1:8002", "http://example.invalid:8002",
      "http://0.0.0.0:8002", "http://localhost:8002",
      "http://127.0.0.1", "http://127.0.0.1:8002/secret",
      "http://127.0.0.1:8002?token=secret",
    ]) {
      expect(() => m5TeacherPreviewProxyTarget({
        command: "serve", mode: "development",
        env: { ...proxyEnv, VITE_M5_DEMO_TARGET: target },
      })).toThrow("loopback");
    }
  });
});
