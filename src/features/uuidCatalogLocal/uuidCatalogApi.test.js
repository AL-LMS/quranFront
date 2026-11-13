import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getLocalUuidCourse, listLocalUuidCourses, readPublicUuidCourse,
  readPublicUuidPage, validCourseId,
} from "./uuidCatalogApi";
import { m5UuidCatalogEnabled } from "./uuidCatalogGate";
import {
  LOCAL_UUID_PREFIX, m5UuidCatalogTarget, rewriteM5UuidCatalogPath,
} from "../../../vite-m5-uuid-catalog.mjs";

const ID = "00000000-0000-0000-0000-00000000a001";
const ITEM = { id: ID, title: "آموزش روخوانی قرآن" };

function reply(body, status = 200, scope = "synthetic-only") {
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: { get: (key) => key === "X-AL-LMS-Data-Scope" ? scope : null },
    json: async () => body,
  };
}
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("M5 UUID local catalog access controls", () => {
  it("is disabled without both explicit flags and development", () => {
    expect(m5UuidCatalogEnabled({ dev: true, previewFlag: "true", apiFlag: "true" })).toBe(true);
    for (const input of [
      { dev: false, previewFlag: "true", apiFlag: "true" },
      { dev: true, previewFlag: "false", apiFlag: "true" },
      { dev: true, previewFlag: "true", apiFlag: "false" },
    ]) expect(m5UuidCatalogEnabled(input)).toBe(false);
  });

  it("does not permit remote, untrusted or production proxy targets", () => {
    const flags = {
      VITE_ENABLE_M5_UUID_CATALOG_PREVIEW: "true",
      VITE_ALLOW_M5_UUID_LOCAL_API: "true",
    };
    expect(m5UuidCatalogTarget({ command: "build", mode: "development", env: flags })).toBeNull();
    expect(m5UuidCatalogTarget({ command: "serve", mode: "production", env: flags })).toBeNull();
    expect(m5UuidCatalogTarget({ command: "serve", mode: "development", env: {} })).toBeNull();
    expect(m5UuidCatalogTarget({ command: "serve", mode: "development", env: flags }))
      .toBe("http://127.0.0.1:8003");
    for (const raw of [
      "https://127.0.0.1:8003", "http://localhost:8003",
      "http://example.com:8003", "http://0.0.0.0:8003",
      "http://127.0.0.1:8003/private", "http://127.0.0.1:8003/?secret=1",
      "http://abc:pw@127.0.0.1:8003",
    ]) {
      expect(() => m5UuidCatalogTarget({
        command: "serve", mode: "development",
        env: { ...flags, VITE_M5_UUID_TARGET: raw },
      })).toThrow();
    }
    expect(LOCAL_UUID_PREFIX).toBe("/__demo/m5-uuid");
    expect(rewriteM5UuidCatalogPath("/__demo/m5-uuid/courses?limit=6&offset=0"))
      .toBe("/api/v2/local-catalog/courses?limit=6&offset=0");
    expect(() => rewriteM5UuidCatalogPath("/api/v2/catalog/courses")).toThrow();
  });
});

describe("M5 UUID synthetic response handling", () => {
  it("accepts only the canonical id/title response, no legacy IDs or private fields", () => {
    expect(validCourseId(ID)).toBe(true);
    for (const bad of [91001, "91001", "not-a-uuid", ID.toUpperCase(),
      "00000000-0000-0000-0000-000000000000"]) {
      expect(validCourseId(bad)).toBe(false);
    }
    expect(readPublicUuidCourse(ITEM)).toEqual(ITEM);
    for (const bad of [
      { ...ITEM, reviewer_account_id: ID },
      { id: 91001, title: ITEM.title },
      { id: ID, title: " " },
      { id: ID, title: "leading " },
    ]) expect(() => readPublicUuidCourse(bad)).toThrow();
    expect(() => readPublicUuidPage({
      items: [ITEM], limit: 6, offset: 0, total: 20,
    }, { limit: 6, offset: 0 })).toThrow();
    expect(() => readPublicUuidPage({
      items: [ITEM, ITEM], limit: 6, offset: 0,
    }, { limit: 6, offset: 0 })).toThrow();
  });

  it("lists courses through same-origin, no auth, no cookies, no caching", async () => {
    const fetcher = vi.fn().mockResolvedValue(reply({ items: [ITEM], limit: 6, offset: 0 }));
    vi.stubGlobal("fetch", fetcher);
    const courses = await listLocalUuidCourses({ limit: 6, offset: 0 });
    expect(courses).toEqual([ITEM]);
    const [url, options] = fetcher.mock.calls[0];
    expect(url).toBe("/__demo/m5-uuid/courses?limit=6&offset=0");
    expect(options).toMatchObject({
      method: "GET", credentials: "omit", cache: "no-store", redirect: "error",
    });
    expect(options.headers).toEqual({ Accept: "application/json" });
  });

  it("detail is UUID-only; hidden and absent are not found", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(reply(ITEM))
      .mockResolvedValueOnce(reply(null, 404));
    vi.stubGlobal("fetch", fetcher);
    expect(await getLocalUuidCourse(ID)).toEqual(ITEM);
    expect(await getLocalUuidCourse("00000000-0000-0000-0000-00000000a002")).toBeNull();
    expect(await getLocalUuidCourse("91001")).toBeNull();
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("rejects missing synthetic scope header, extra fields, errors and server down", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(reply({ items: [ITEM], limit: 6, offset: 0 }, 200, null))
      .mockResolvedValueOnce(reply({ items: [{ ...ITEM, phone: "private" }], limit: 6, offset: 0 }))
      .mockResolvedValueOnce(reply({ message: "internal secret" }, 503))
      .mockRejectedValueOnce(new Error("private network info"));
    vi.stubGlobal("fetch", fetcher);
    for (let i = 0; i < 4; i++) {
      await expect(listLocalUuidCourses({ limit: 6, offset: 0 })).rejects.toThrow();
    }
  });
});
