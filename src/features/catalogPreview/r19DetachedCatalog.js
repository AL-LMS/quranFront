/**
 * R19 detached catalog contract, intentionally NOT imported by any route.
 * No production activation, no institution selector, no credentials and no
 * legacy integer-ID translation. The backend is not yet router-mounted.
 */
export const R19_PAGE_SIZE = 12;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const hasForbiddenTitleCodepoint = (title) => Array.from(title).some((character) => {
  const code = character.codePointAt(0);
  return code < 32 || (code >= 127 && code <= 159) ||
    (code >= 0x202a && code <= 0x202e) ||
    (code >= 0x2066 && code <= 0x2069);
});

export function r19CourseId(value) {
  if (typeof value !== "string" || !UUID.test(value) ||
      value === "00000000-0000-0000-0000-000000000000") return null;
  // UUID canonicalization is deliberately strict.
  const versionVariantFree = value.replace(/-/g, "");
  return versionVariantFree.length === 32 ? value : null;
}

export function r19PublicCourse(row) {
  if (!row || typeof row !== "object" || Array.isArray(row) ||
      Object.keys(row).sort().join(",") !== "id,title" ||
      !r19CourseId(row.id) ||
      typeof row.title !== "string" || Array.from(row.title).length < 1 ||
      Array.from(row.title).length > 160 || row.title.trim() !== row.title ||
      hasForbiddenTitleCodepoint(row.title)) {
    throw new Error("پاسخ عمومی دوره معتبر نیست.");
  }
  return { id: row.id, title: row.title };
}

export function r19PublicPage(payload, { afterId = null, limit = R19_PAGE_SIZE } = {}) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload) ||
      Object.keys(payload).sort().join(",") !== "items,next_after_id" ||
      !Array.isArray(payload.items) || !Number.isInteger(limit) ||
      limit < 1 || limit > 50 || payload.items.length > limit) {
    throw new Error("صفحهٔ دوره‌ها معتبر نیست.");
  }
  if (afterId !== null && !r19CourseId(afterId)) {
    throw new Error("نشانگر صفحه نامعتبر است.");
  }
  let previous = afterId;
  const items = payload.items.map((row) => {
    const item = r19PublicCourse(row);
    if (previous !== null && item.id <= previous) {
      throw new Error("ترتیب دوره‌ها نامعتبر است.");
    }
    previous = item.id;
    return item;
  });
  const expected = items.length === limit ? previous : null;
  if (payload.next_after_id !== expected) {
    throw new Error("نشانگر صفحهٔ بعد نامعتبر است.");
  }
  return { items, next_after_id: expected };
}

export function r19PageUrl({ afterId = null, limit = R19_PAGE_SIZE } = {}) {
  if (!Number.isInteger(limit) || limit < 1 || limit > 50 ||
      (afterId !== null && !r19CourseId(afterId))) {
    throw new Error("پارامتر فهرست نامعتبر است.");
  }
  const query = new URLSearchParams({ limit: String(limit) });
  if (afterId !== null) query.set("after_id", afterId);
  return "/api/v2/courses?" + query.toString();
}

export async function r19GetJson(path, { transport, signal } = {}) {
  if (typeof transport !== "function") {
    throw new Error("سرویس آزمایشی متصل نیست.");
  }
  let response;
  try {
    response = await transport(path, {
      method: "GET", credentials: "omit", headers: { Accept: "application/json" }, signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    throw new Error("اتصال به کاتالوگ برقرار نشد.");
  }
  if (response?.status === 404) return null;
  // R19 detached backend returns exactly 200 on success; never trust ok alone.
  if (response?.status !== 200 || response?.ok !== true) {
    throw new Error("سرویس دوره‌ها در دسترس نیست.");
  }
  try {
    return await response.json();
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    throw new Error("پاسخ سرویس معتبر نیست.");
  }
}

export async function r19ListCourses({ afterId = null, limit = R19_PAGE_SIZE, transport, signal } = {}) {
  const payload = await r19GetJson(r19PageUrl({ afterId, limit }), { transport, signal });
  if (payload === null) throw new Error("فهرست دوره‌ها در دسترس نیست.");
  return r19PublicPage(payload, { afterId, limit });
}

export async function r19CourseDetail(id, { transport, signal } = {}) {
  if (!r19CourseId(id)) throw new Error("شناسهٔ دوره معتبر نیست.");
  const payload = await r19GetJson("/api/v2/courses/" + id, { transport, signal });
  if (payload === null) return null;
  const course = r19PublicCourse(payload);
  if (course.id !== id) throw new Error("پاسخ عمومی دوره معتبر نیست.");
  return course;
}
