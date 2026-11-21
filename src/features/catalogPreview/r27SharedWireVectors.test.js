/** R27: same pinned synthetic JSON vector corpus as R5 backend tests. No fetch. */
import { describe, expect, it } from "vitest";
import {
  r19CourseId, r19PublicCourse, r19PublicPage, r19PageUrl,
} from "./r19DetachedCatalog";
import vectors from "./r27SharedWireVectors.json";

const rowsById = new Map(vectors.rows.map((row) => [row.id, row]));
const firstId = vectors.rows[0].id;

describe("R27 shared Python/JS detached wire vectors (synthetic-only)", () => {
  it("pins the backend baseline and contains no private DTO keys", () => {
    expect(Object.keys(vectors).sort()).toEqual([
      "baseline", "page_cases", "rows", "schema_version", "title_cases", "uuid_cases",
    ]);
    expect(vectors.schema_version).toBe(1);
    expect(vectors.baseline).toEqual({
      backend_r5: "a3152bf6301528d92075d55320af71f8169ec97e",
      frontend_r26: "495ffa965cae542b1f382650d2677c5cb9bc1cf4",
    });
    expect([
      vectors.uuid_cases.length, vectors.title_cases.length, vectors.page_cases.length,
    ]).toEqual([7, 10, 9]);
    for (const row of vectors.rows) {
      expect(Object.keys(row).sort()).toEqual(["id", "title"]);
      expect(r19PublicCourse(row)).toEqual(row);
    }
    expect(rowsById.size).toBe(vectors.rows.length);
    for (const group of [vectors.uuid_cases, vectors.title_cases, vectors.page_cases]) {
      expect(new Set(group.map((entry) => entry.name)).size).toBe(group.length);
    }
  });

  it("matches R5 canonical UUID acceptance vectors", () => {
    for (const entry of vectors.uuid_cases) {
      expect(r19CourseId(entry.value), entry.name)
        .toBe(entry.valid ? entry.value : null);
    }
  });

  it("matches R5 Unicode title boundary vectors", () => {
    for (const entry of vectors.title_cases) {
      const candidate = { id: firstId, title: entry.value };
      if (entry.valid) {
        expect(r19PublicCourse(candidate), entry.name).toEqual(candidate);
      } else {
        expect(() => r19PublicCourse(candidate), entry.name).toThrow();
      }
    }
  });

  it("matches R5 keyset projection and rejection vectors", () => {
    for (const entry of vectors.page_cases) {
      const payload = {
        items: entry.row_ids.map((id) => rowsById.get(id)),
        next_after_id: entry.next_after_id,
      };
      const options = { afterId: entry.after_id, limit: entry.limit };
      if (entry.valid) {
        expect(r19PublicPage(payload, options), entry.name).toEqual(payload);
      } else {
        expect(() => r19PublicPage(payload, options), entry.name).toThrow();
      }
    }
  });

  it("emits only limit and optional canonical after_id for valid pages", () => {
    for (const entry of vectors.page_cases.filter((item) => item.valid)) {
      const path = r19PageUrl({ afterId: entry.after_id, limit: entry.limit });
      const url = new URL(path, "https://synthetic.invalid");
      expect(url.pathname, entry.name).toBe("/api/v2/courses");
      expect([...url.searchParams.keys()], entry.name)
        .toEqual(entry.after_id === null ? ["limit"] : ["limit", "after_id"]);
      expect(url.searchParams.get("limit"), entry.name).toBe(String(entry.limit));
      expect(url.searchParams.get("after_id"), entry.name).toBe(entry.after_id);
    }
  });
});
