/** M6 synthetic-only course-management client. No stored tokens or real account auth. */
import { validCourseId } from "../uuidCatalogLocal/uuidCatalogApi";

const ROOT = "/__demo/m6-management/courses";
const ITEM_FIELDS = ["id", "title", "status", "version"];
const PAGE_FIELDS = ["items", "limit", "offset"];
const COURSE_STATUSES = new Set(["draft", "published", "archived"]);
const TOKEN_HEADER = "X-AL-LMS-Local-Admin-Token";

export class ManagementError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "ManagementError";
    this.status = status;
  }
}

function exactKeys(input, names) {
  return input !== null && typeof input === "object" &&
    !Array.isArray(input) && Object.keys(input).length === names.length &&
    names.every((key) => Object.prototype.hasOwnProperty.call(input, key));
}

export function readManagedCourse(raw) {
  if (
    !exactKeys(raw, ITEM_FIELDS) ||
    !validCourseId(raw.id) ||
    typeof raw.title !== "string" ||
    raw.title.trim() !== raw.title ||
    raw.title.length < 1 || raw.title.length > 160 ||
    !COURSE_STATUSES.has(raw.status) ||
    !Number.isSafeInteger(raw.version) || raw.version < 1
  ) throw new ManagementError("ساختار اطلاعات دورهٔ آزمایشی نامعتبر است.");
  return Object.freeze({
    id: raw.id, title: raw.title, status: raw.status, version: raw.version,
  });
}

export function readManagedCoursePage(raw, { limit, offset }) {
  if (
    !exactKeys(raw, PAGE_FIELDS) ||
    !Array.isArray(raw.items) ||
    raw.items.length > limit ||
    raw.limit !== limit ||
    raw.offset !== offset
  ) throw new ManagementError("پاسخ فهرست دوره‌ها معتبر نیست.");
  const items = raw.items.map(readManagedCourse);
  if (new Set(items.map((x) => x.id)).size !== items.length) {
    throw new ManagementError("شناسهٔ تکراری در فهرست.");
  }
  return Object.freeze({ items, limit, offset });
}

function assertToken(token) {
  if (
    typeof token !== "string" ||
    token.length < 24 || token.length > 200 ||
    !/^[A-Za-z0-9_-]+$/.test(token)
  ) throw new ManagementError("توکن آزمایشی معتبر وارد کنید.", 403);
}

function assertTitle(title) {
  if (
    typeof title !== "string" || title.length < 1 ||
    title.length > 160 || title.trim() !== title
  ) throw new ManagementError("عنوان دوره باید ۱ تا ۱۶۰ نویسه و بدون فاصلهٔ اضافی باشد.", 422);
}

function assertVersion(version) {
  if (!Number.isSafeInteger(version) || version < 1) {
    throw new ManagementError("نسخهٔ دوره معتبر نیست.", 422);
  }
}

function assertCourseId(courseId) {
  if (!validCourseId(courseId)) throw new ManagementError("شناسهٔ دوره معتبر نیست.", 404);
}

function statusError(status) {
  switch (status) {
    case 403: return new ManagementError("توکن مدیریت محلی پذیرفته نشد؛ دوباره وارد کنید.", status);
    case 404: return new ManagementError("دوره پیدا نشد یا در این مؤسسه نیست.", status);
    case 409: return new ManagementError("نسخه یا وضعیت دوره تغییر کرده است؛ فهرست را تازه‌سازی کنید.", status);
    case 422: return new ManagementError("درخواست یا عنوان دوره معتبر نیست.", status);
    case 503: return new ManagementError("پایگاه دادهٔ آزمایشی در دسترس نیست.", status);
    default: return new ManagementError("عملیات آزمایشی انجام نشد.", status);
  }
}

async function request(path, { token, method = "GET", payload, signal } = {}) {
  assertToken(token);
  const headers = {
    Accept: "application/json",
    [TOKEN_HEADER]: token,
    ...(payload === undefined ? {} : { "Content-Type": "application/json" }),
  };
  let response;
  try {
    response = await fetch(path, {
      method,
      headers,
      ...(payload === undefined ? {} : { body: JSON.stringify(payload) }),
      credentials: "omit",
      cache: "no-store",
      redirect: "error",
      signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    throw new ManagementError("اتصال به سرویس آزمایشی محلی برقرار نشد.");
  }
  if (!response.ok) throw statusError(response.status);
  if (response.headers?.get("X-AL-LMS-Data-Scope") !== "synthetic-only") {
    throw new ManagementError("منبع دادهٔ ساختگی تأیید نشد.");
  }
  try {
    return await response.json();
  } catch {
    throw new ManagementError("پاسخ سرویس محلی قابل خواندن نیست.");
  }
}

export async function listManagedCourses({ token, limit = 20, offset = 0, signal }) {
  if (
    !Number.isSafeInteger(limit) || limit < 1 || limit > 100 ||
    !Number.isSafeInteger(offset) || offset < 0 || offset > 10000
  ) throw new ManagementError("صفحه‌بندی معتبر نیست.");
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  return readManagedCoursePage(await request(ROOT + "?" + params, { token, signal }), { limit, offset });
}

export async function getManagedCourse({ token, courseId, signal }) {
  assertCourseId(courseId);
  return readManagedCourse(await request(ROOT + "/" + courseId, { token, signal }));
}

export async function createManagedCourse({ token, title }) {
  assertTitle(title);
  return readManagedCourse(await request(ROOT, {
    token, method: "POST", payload: { title },
  }));
}

export async function editManagedCourse({ token, courseId, title, expectedVersion }) {
  assertCourseId(courseId);
  assertTitle(title);
  assertVersion(expectedVersion);
  return readManagedCourse(await request(ROOT + "/" + courseId, {
    token, method: "PATCH", payload: { title, expected_version: expectedVersion },
  }));
}

export async function archiveManagedCourse({ token, courseId, expectedVersion }) {
  assertCourseId(courseId);
  assertVersion(expectedVersion);
  return readManagedCourse(await request(ROOT + "/" + courseId + "/archive", {
    token, method: "POST", payload: { expected_version: expectedVersion },
  }));
}
