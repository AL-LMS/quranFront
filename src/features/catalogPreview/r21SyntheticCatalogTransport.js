/**
 * R21 offline-only catalog specimen. This is an explicitly injected fake
 * transport, NEVER a browser fetch fallback or a publication authority.
 * Titles and UUIDs are fabricated for UI interaction tests.
 */
import { r19CourseId, r19PublicCourse } from "./r19DetachedCatalog";

export const r21SyntheticCourses = Object.freeze(Array.from({ length: 25 }, (_, index) =>
  Object.freeze({
    id: "00000000-0000-4000-8000-" + (index + 1).toString(16).padStart(12, "0"),
    title: "دورهٔ آزمایشی " + new Intl.NumberFormat("fa-IR").format(index + 1),
  })
));

const reply = (status, payload) => ({
  status,
  ok: status >= 200 && status < 300,
  json: async () => payload,
});

function invalidRequest() {
  return reply(422, { detail: "Invalid request" });
}

export function createR21SyntheticTransport(source = r21SyntheticCourses) {
  if (!Array.isArray(source)) throw new Error("دادهٔ آزمایشی معتبر نیست.");
  const rows = source.map(r19PublicCourse).sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  if (rows.some((item, index) => index && rows[index - 1].id === item.id)) {
    throw new Error("شناسهٔ تکراری در دادهٔ آزمایشی.");
  }
  const byId = new Map(rows.map((item) => [item.id, item]));

  return async function r21SyntheticTransport(path, options) {
    if (options?.signal?.aborted) {
      const abort = new Error("Aborted");
      abort.name = "AbortError";
      throw abort;
    }
    if (options?.method !== "GET" || options?.credentials !== "omit") {
      return invalidRequest();
    }
    if (typeof path !== "string") return invalidRequest();
    if (path.startsWith("/api/v2/courses?")) {
      const query = path.slice("/api/v2/courses?".length);
      const pairs = [...new URLSearchParams(query).entries()];
      if (!pairs.length || pairs.length > 2 ||
          pairs.some(([key]) => key !== "limit" && key !== "after_id") ||
          new Set(pairs.map(([key]) => key)).size !== pairs.length) {
        return invalidRequest();
      }
      const params = new Map(pairs);
      const limitRaw = params.get("limit");
      if (!/^[1-9][0-9]?$/.test(limitRaw || "") ||
          Number(limitRaw) > 50) return invalidRequest();
      const limit = Number(limitRaw);
      const afterId = params.get("after_id") ?? null;
      if (afterId !== null && !r19CourseId(afterId)) return invalidRequest();
      const items = rows.filter((row) => afterId === null || row.id > afterId).slice(0, limit);
      return reply(200, {
        items,
        next_after_id: items.length === limit ? items[items.length - 1].id : null,
      });
    }
    if (path.startsWith("/api/v2/courses/") && !path.includes("?")) {
      const id = path.slice("/api/v2/courses/".length);
      return r19CourseId(id) && byId.has(id)
        ? reply(200, byId.get(id))
        : reply(404, { detail: "Not found" });
    }
    return reply(404, { detail: "Not found" });
  };
}
