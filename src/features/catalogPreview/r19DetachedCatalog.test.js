import { describe, expect, it, vi } from "vitest";
import {
  r19CourseId, r19PublicCourse, r19PublicPage, r19PageUrl,
  r19ListCourses, r19CourseDetail,
} from "./r19DetachedCatalog";

const A = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const B = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";
const row = (id = A) => ({ id, title: "آموزش روخوانی" });
const response = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

describe("R19 detached public catalog contract (not mounted)", () => {
  it("accepts lowercase canonical nonzero UUID and rejects integer/uppercase/noncanonical", () => {
    expect(r19CourseId(A)).toBe(A);
    for (const invalid of [123, "123", A.toUpperCase(), A.replace(/-/g, ""),
      "00000000-0000-0000-0000-000000000000", undefined, ""]) {
      expect(r19CourseId(invalid)).toBeNull();
    }
  });

  it("projects only id/title and denies extra or private fields", () => {
    expect(r19PublicCourse(row())).toEqual(row());
    expect(() => r19PublicCourse({ ...row(), student_id: A })).toThrow();
    expect(() => r19PublicCourse({ ...row(), summary: "private" })).toThrow();
    expect(() => r19PublicCourse({ ...row(), title: "  name " })).toThrow();
    expect(() => r19PublicCourse({ ...row(), title: "bad\u202e" })).toThrow();
    expect(() => r19PublicCourse({ ...row(), title: "bad\n" })).toThrow();
  });

  it("matches backend Python codepoint limits for astral Unicode titles", () => {
    // Python len(title) counts Unicode codepoints; JS string.length counts UTF-16 units.
    const maxAstral = "📚".repeat(160);
    const overAstral = "📚".repeat(161);
    const maxMixed = "درس" + "📚".repeat(157);
    expect(maxAstral.length).toBe(320);
    expect(Array.from(maxAstral)).toHaveLength(160);
    expect(r19PublicCourse({ ...row(), title: maxAstral }).title).toBe(maxAstral);
    expect(r19PublicCourse({ ...row(), title: maxMixed }).title).toBe(maxMixed);
    expect(() => r19PublicCourse({ ...row(), title: overAstral })).toThrow();
    expect(() => r19PublicCourse({ ...row(), title: "" })).toThrow();
  });

  it("requires ordered keyset pages and exact backend continuation semantics", () => {
    expect(r19PublicPage({ items: [row(A), row(B)], next_after_id: B }, { limit: 2 }))
      .toEqual({ items: [row(A), row(B)], next_after_id: B });
    expect(r19PublicPage({ items: [row(B)], next_after_id: null }, { afterId: A }))
      .toEqual({ items: [row(B)], next_after_id: null });
    expect(() => r19PublicPage({ items: [row(B), row(A)], next_after_id: A }, { limit: 2 })).toThrow();
    expect(() => r19PublicPage({ items: [row(A)], next_after_id: A })).toThrow();
    expect(() => r19PublicPage({ items: [row(A)], next_after_id: null, total: 1 })).toThrow();
    expect(() => r19PublicPage({ items: [row(A), row(A)], next_after_id: A }, { limit: 2 })).toThrow();
  });

  it("never sends scope/search/offset or legacy query keys", () => {
    expect(r19PageUrl()).toBe("/api/v2/courses?limit=12");
    expect(r19PageUrl({ afterId: A, limit: 2 }))
      .toBe("/api/v2/courses?limit=2&after_id=" + A);
    expect(() => r19PageUrl({ limit: 51 })).toThrow();
    expect(() => r19PageUrl({ afterId: "91001" })).toThrow();
  });

  it("uses injected transport only and omits credentials", async () => {
    const transport = vi.fn(async () => response({ items: [row(A)], next_after_id: null }));
    expect(await r19ListCourses({ transport })).toEqual({
      items: [row(A)], next_after_id: null,
    });
    expect(transport).toHaveBeenCalledWith("/api/v2/courses?limit=12", expect.objectContaining({
      method: "GET", credentials: "omit", headers: { Accept: "application/json" },
    }));
    await expect(r19ListCourses()).rejects.toThrow("متصل نیست");
  });

  it("treats missing detail as private-or-absent and fails closed on service errors", async () => {
    expect(await r19CourseDetail(A, { transport: async () => response({}, 404) })).toBeNull();
    await expect(r19CourseDetail(A, {
      transport: async () => response({ items: [] }, 503),
    })).rejects.toThrow();
    await expect(r19CourseDetail("91001", {
      transport: vi.fn(),
    })).rejects.toThrow();
  });

  it("propagates abort without revealing server errors", async () => {
    const error = new Error("aborted");
    error.name = "AbortError";
    await expect(r19ListCourses({ transport: async () => { throw error; } }))
      .rejects.toBe(error);
    await expect(r19ListCourses({ transport: async () => { throw new Error("secret"); } }))
      .rejects.toThrow("اتصال به کاتالوگ برقرار نشد");
  });
});
