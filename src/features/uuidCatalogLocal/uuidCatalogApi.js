/** M5-LOCAL-01: read-only UUID/Title API (never real publication authority). */
const ROOT = "/__demo/m5-uuid/courses";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const PUBLIC_KEYS = ["id", "title"];
const PAGE_KEYS = ["items", "limit", "offset"];

export function validCourseId(value) {
  return typeof value === "string" &&
    UUID.test(value) &&
    value !== "00000000-0000-0000-0000-000000000000";
}
function exactKeys(input, expected) {
  return input && typeof input === "object" && !Array.isArray(input) &&
    Object.keys(input).length === expected.length &&
    expected.every((key) => Object.prototype.hasOwnProperty.call(input, key));
}
export function readPublicUuidCourse(raw) {
  if (
    !exactKeys(raw, PUBLIC_KEYS) ||
    !validCourseId(raw.id) ||
    typeof raw.title !== "string" ||
    raw.title.trim() !== raw.title ||
    raw.title.length < 1 ||
    raw.title.length > 160
  ) throw new Error("ساختار دورهٔ آزمایشی نامعتبر است.");
  return Object.freeze({ id: raw.id, title: raw.title });
}
export function readPublicUuidPage(raw, { limit, offset }) {
  if (
    !exactKeys(raw, PAGE_KEYS) ||
    !Array.isArray(raw.items) ||
    raw.items.length > limit ||
    raw.limit !== limit ||
    raw.offset !== offset
  ) throw new Error("پاسخ فهرست آزمایشی معتبر نیست.");
  const items = raw.items.map(readPublicUuidCourse);
  if (new Set(items.map((item) => item.id)).size !== items.length) {
    throw new Error("شناسهٔ تکراری در پاسخ آزمایشی.");
  }
  return items;
}

async function request(path, signal) {
  let response;
  try {
    response = await fetch(path, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "omit",
      cache: "no-store",
      redirect: "error",
      signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    throw new Error("API آزمایشی محلی در دسترس نیست.");
  }
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("دریافت اطلاعات آزمایشی ناموفق بود.");
  if (response.headers?.get("X-AL-LMS-Data-Scope") !== "synthetic-only") {
    throw new Error("منبع دادهٔ آزمایشی تأیید نشد.");
  }
  try {
    return await response.json();
  } catch {
    throw new Error("پاسخ JSON آزمایشی قابل خواندن نیست.");
  }
}

export async function listLocalUuidCourses({ limit = 6, offset = 0, signal } = {}) {
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100 ||
      !Number.isSafeInteger(offset) || offset < 0 || offset > 10000) {
    throw new Error("محدودهٔ صفحه‌بندی معتبر نیست.");
  }
  const query = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  const raw = await request(ROOT + "?" + query, signal);
  if (!raw) throw new Error("فهرست UUID آزمایشی در دسترس نیست.");
  return readPublicUuidPage(raw, { limit, offset });
}

export async function getLocalUuidCourse(id, { signal } = {}) {
  if (!validCourseId(id)) return null;
  const raw = await request(ROOT + "/" + id, signal);
  return raw === null ? null : readPublicUuidCourse(raw);
}
