import { afterEach, describe, expect, it, vi } from "vitest";
import {
  archiveManagedCourse, createManagedCourse, editManagedCourse,
  listManagedCourses, ManagementError, readManagedCourse, readManagedCoursePage,
} from "./m6ManagementApi";
import { m6ManagementPreviewEnabled } from "./m6ManagementGate";
import {
  M6_LOCAL_PREFIX, m6ManagementTarget, rewriteM6ManagementPath,
} from "../../../vite-m6-management.mjs";

const TOKEN = "m6-local-test-secret-token-abcdefghijklmnopqrstuvwxyz";
const ID = "00000000-0000-0000-0000-00000000a001";
const ROW = { id: ID, title: "آموزش روخوانی قرآن", status: "published", version: 1 };

function reply(body, status = 200, scope = "synthetic-only") {
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: { get: (key) => key === "X-AL-LMS-Data-Scope" ? scope : null },
    json: async () => body,
  };
}
afterEach(() => { vi.unstubAllGlobals(); });

describe("M6 local management dev-only proxy", () => {
  const env = {
    VITE_ENABLE_M6_MANAGEMENT_PREVIEW: "true",
    VITE_ALLOW_M6_LOCAL_API: "true",
    VITE_M6_MANAGEMENT_TARGET: "http://127.0.0.1:8004",
  };

  it("requires two flags and dev-only Vite serve", () => {
    expect(m6ManagementPreviewEnabled({
      dev: true, previewFlag: "true", apiFlag: "true",
    })).toBe(true);
    for (const option of [
      { dev: false, previewFlag: "true", apiFlag: "true" },
      { dev: true, previewFlag: "false", apiFlag: "true" },
      { dev: true, previewFlag: "true", apiFlag: "false" },
    ]) expect(m6ManagementPreviewEnabled(option)).toBe(false);
    expect(m6ManagementTarget({ command: "build", mode: "development", env })).toBeNull();
    expect(m6ManagementTarget({ command: "serve", mode: "production", env })).toBeNull();
    expect(m6ManagementTarget({ command: "serve", mode: "development", env: {} })).toBeNull();
    expect(m6ManagementTarget({ command: "serve", mode: "development", env }))
      .toBe("http://127.0.0.1:8004");
  });

  it("rejects remote and unsafe proxy targets", () => {
    for (const bad of [
      "", "http://127.0.0.1:8003", "http://127.0.0.1:5432",
      "http://localhost:8004", "http://0.0.0.0:8004",
      "http://example.com:8004", "https://127.0.0.1:8004",
      "http://foo:pw@127.0.0.1:8004", "http://127.0.0.1:8004/private",
      "http://127.0.0.1:8004/?token=secret", "http://127.0.0.1:8004/#x",
    ]) expect(() => m6ManagementTarget({
      command: "serve", mode: "development",
      env: { ...env, VITE_M6_MANAGEMENT_TARGET: bad },
    })).toThrow();
    expect(M6_LOCAL_PREFIX).toBe("/__demo/m6-management");
    expect(rewriteM6ManagementPath(
      "/__demo/m6-management/courses/00000000-0000-0000-0000-00000000a001"
    )).toBe("/api/v2/local-course-management/courses/" + ID);
    expect(() => rewriteM6ManagementPath("/__demo/m5-uuid/courses")).toThrow();
    expect(() => rewriteM6ManagementPath("/legacy/back_request/")).toThrow();
  });
});

describe("M6 synthetic course-management response contract", () => {
  it("requires exact 4-field UUID, safe status and version, never private columns", () => {
    expect(readManagedCourse(ROW)).toEqual(ROW);
    for (const bad of [
      { ...ROW, institution_id: ID },
      { ...ROW, publisher_grant: true },
      { ...ROW, version: 0 },
      { ...ROW, version: "1" },
      { ...ROW, status: "approved" },
      { ...ROW, id: "91001" },
      { ...ROW, title: " " },
      { ...ROW, title: "x".repeat(161) },
    ]) expect(() => readManagedCourse(bad)).toThrow(ManagementError);
    expect(() => readManagedCoursePage({
      items: [ROW, ROW], limit: 20, offset: 0,
    }, { limit: 20, offset: 0 })).toThrow();
  });

  it("lists with token header only, without cookies, URL token or persistence", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      reply({ items: [ROW], limit: 20, offset: 0 })
    );
    vi.stubGlobal("fetch", fetcher);
    const data = await listManagedCourses({ token: TOKEN, limit: 20, offset: 0 });
    expect(data.items).toEqual([ROW]);
    const [url, options] = fetcher.mock.calls[0];
    expect(url).toBe("/__demo/m6-management/courses?limit=20&offset=0");
    expect(url).not.toContain(TOKEN);
    expect(options).toMatchObject({
      method: "GET", credentials: "omit", cache: "no-store", redirect: "error",
    });
    expect(options.headers["X-AL-LMS-Local-Admin-Token"]).toBe(TOKEN);
    expect(options.headers.Accept).toBe("application/json");
  });

  it("creates draft and performs versioned edit/archive without selecting tenant/role/status", async () => {
    const created = { id: ID, title: "دوره تازه", status: "draft", version: 1 };
    const edited = { ...created, title: "دوره ویرایش‌شده", version: 2 };
    const archived = { ...edited, status: "archived", version: 3 };
    const fetcher = vi.fn()
      .mockResolvedValueOnce(reply(created, 201))
      .mockResolvedValueOnce(reply(edited))
      .mockResolvedValueOnce(reply(archived));
    vi.stubGlobal("fetch", fetcher);
    expect(await createManagedCourse({ token: TOKEN, title: created.title })).toEqual(created);
    expect(await editManagedCourse({
      token: TOKEN, courseId: ID, title: edited.title, expectedVersion: 1,
    })).toEqual(edited);
    expect(await archiveManagedCourse({
      token: TOKEN, courseId: ID, expectedVersion: 2,
    })).toEqual(archived);
    const [createUrl, createOptions] = fetcher.mock.calls[0];
    expect(createUrl).toBe("/__demo/m6-management/courses");
    expect(createOptions.method).toBe("POST");
    expect(JSON.parse(createOptions.body)).toEqual({ title: created.title });
    const [editUrl, editOptions] = fetcher.mock.calls[1];
    expect(editUrl).toBe("/__demo/m6-management/courses/" + ID);
    expect(editOptions.method).toBe("PATCH");
    expect(JSON.parse(editOptions.body)).toEqual({
      title: edited.title, expected_version: 1,
    });
    const [archiveUrl, archiveOptions] = fetcher.mock.calls[2];
    expect(archiveUrl).toBe("/__demo/m6-management/courses/" + ID + "/archive");
    expect(archiveOptions.method).toBe("POST");
    expect(JSON.parse(archiveOptions.body)).toEqual({ expected_version: 2 });
    expect(fetcher.mock.calls.every(([url, opts]) =>
      !url.includes(TOKEN) && opts.credentials === "omit"
    )).toBe(true);
  });

  it("rejects malformed IDs/versions/token before sending requests", async () => {
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    await expect(editManagedCourse({
      token: TOKEN, courseId: "91001", title: "دوره", expectedVersion: 1,
    })).rejects.toThrow();
    await expect(archiveManagedCourse({
      token: TOKEN, courseId: ID, expectedVersion: "1",
    })).rejects.toThrow();
    await expect(createManagedCourse({ token: "bad", title: "دوره" })).rejects.toThrow();
    await expect(createManagedCourse({ token: TOKEN, title: " trailing " })).rejects.toThrow();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("maps 403,409,404,503 safely and rejects scope/header violations", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(reply({ detail: "private token" }, 403, null))
      .mockResolvedValueOnce(reply({ detail: "private conflict" }, 409, null))
      .mockResolvedValueOnce(reply({ detail: "private nonexistent" }, 404, null))
      .mockResolvedValueOnce(reply({ detail: "private db error" }, 503, null))
      .mockResolvedValueOnce(reply({ items: [ROW], limit: 20, offset: 0 }, 200, null))
      .mockResolvedValueOnce(reply({ items: [{ ...ROW, reviewer_account_id: ID }], limit: 20, offset: 0 }));
    vi.stubGlobal("fetch", fetcher);
    const received = [];
    for (const status of [403, 409, 404, 503]) {
      try {
        await listManagedCourses({ token: TOKEN });
        received.push({ status: 0, name: "UnexpectedSuccess", secret: true });
      } catch (error) {
        received.push({
          status: error.status,
          name: error.name,
          secret: error.message.includes("private"),
        });
      }
    }
    expect(received).toEqual([403, 409, 404, 503].map((status) => ({
      status, name: "ManagementError", secret: false,
    })));
    await expect(listManagedCourses({ token: TOKEN })).rejects.toThrow("منبع داده");
    await expect(listManagedCourses({ token: TOKEN })).rejects.toThrow("نامعتبر");
  });
});
