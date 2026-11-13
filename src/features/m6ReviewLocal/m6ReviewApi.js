/** M6-LOCAL-UI-03: no real identity, no stored tokens, no public publishing. */

import { validCourseId } from "../uuidCatalogLocal/uuidCatalogApi";
import { ManagementError, readManagedCourse } from "../m6ManagementLocal/m6ManagementApi";

const ROOT = "/__demo/m6-review";
const REQUEST_FIELDS = ["id", "course_id", "course_version", "title", "status"];
const PAGE_FIELDS = ["items", "limit", "offset"];
const REVIEW_HEADER = "X-AL-LMS-Local-Reviewer-Token";
const MANAGER_HEADER = "X-AL-LMS-Local-Admin-Token";

function exactKeys(input, names) {
  return input !== null && typeof input === "object" && !Array.isArray(input) &&
    Object.keys(input).length === names.length &&
    names.every((key) => Object.prototype.hasOwnProperty.call(input, key));
}

export function readReviewRequest(raw) {
  if (!exactKeys(raw, REQUEST_FIELDS) ||
    !validCourseId(raw.id) || !validCourseId(raw.course_id) ||
    !Number.isSafeInteger(raw.course_version) || raw.course_version < 1 ||
    typeof raw.title !== "string" || raw.title.trim() !== raw.title ||
    raw.title.length < 1 || raw.title.length > 160 ||
    !["submitted", "approved"].includes(raw.status)) {
    throw new ManagementError("اطلاعات درخواست بررسی معتبر نیست.");
  }
  return Object.freeze({
    id: raw.id, course_id: raw.course_id, course_version: raw.course_version,
    title: raw.title, status: raw.status,
  });
}

export function readReviewPage(raw, { limit, offset }) {
  if (!exactKeys(raw, PAGE_FIELDS) || !Array.isArray(raw.items) ||
    raw.items.length > limit || raw.limit !== limit || raw.offset !== offset) {
    throw new ManagementError("فهرست درخواست‌های بررسی نامعتبر است.");
  }
  const items = raw.items.map(readReviewRequest);
  if (new Set(items.map((item) => item.id)).size !== items.length) {
    throw new ManagementError("شناسهٔ درخواست تکراری است.");
  }
  return Object.freeze({ items, limit, offset });
}

function checkToken(token) {
  if (typeof token !== "string" || token.length < 24 || token.length > 200 ||
    !/^[A-Za-z0-9_-]+$/.test(token)) {
    throw new ManagementError("توکن آزمایشی معتبر نیست.", 403);
  }
}

function checkVersion(version) {
  if (!Number.isSafeInteger(version) || version < 1) {
    throw new ManagementError("نسخهٔ دوره معتبر نیست.", 422);
  }
}

function checkId(id) {
  if (!validCourseId(id)) throw new ManagementError("شناسهٔ UUID معتبر نیست.", 404);
}

function safeHttpError(status) {
  switch (status) {
    case 403: return new ManagementError("توکن یا مجوز محلی پذیرفته نشد.", status);
    case 404: return new ManagementError("دوره یا درخواست پیدا نشد.", status);
    case 409: return new ManagementError("نسخه یا وضعیت دوره تغییر کرده است؛ دوباره بررسی کنید.", status);
    case 422: return new ManagementError("درخواست آزمایشی نامعتبر است.", status);
    case 503: return new ManagementError("سرویس محلی در دسترس نیست.", status);
    default: return new ManagementError("عملیات بررسی انجام نشد.", status);
  }
}

async function send(path, { token, role, method = "GET", payload, signal }) {
  checkToken(token);
  if (!["manager", "reviewer"].includes(role)) throw new ManagementError("نقش آزمایشی نامعتبر است.");
  const headers = {
    Accept: "application/json",
    [role === "manager" ? MANAGER_HEADER : REVIEW_HEADER]: token,
    ...(payload === undefined ? {} : { "Content-Type": "application/json" }),
  };
  let response;
  try {
    response = await fetch(ROOT + path, {
      method,
      headers,
      ...(payload === undefined ? {} : { body: JSON.stringify(payload) }),
      credentials: "omit", cache: "no-store", redirect: "error", signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    throw new ManagementError("اتصال به سرویس آزمایشی برقرار نشد.", 503);
  }
  if (!response.ok) throw safeHttpError(response.status);
  if (response.headers?.get("X-AL-LMS-Data-Scope") !== "synthetic-only") {
    throw new ManagementError("منبع دادهٔ آزمایشی تأیید نشد.");
  }
  try {
    return await response.json();
  } catch {
    throw new ManagementError("پاسخ آزمایشی قابل خواندن نیست.");
  }
}

export async function submitPublicationRequest({ token, courseId, expectedVersion }) {
  checkId(courseId);
  checkVersion(expectedVersion);
  return readReviewRequest(await send("/courses/" + courseId + "/requests", {
    token, role: "manager", method: "POST",
    payload: { expected_version: expectedVersion },
  }));
}

export async function listReviewRequests({ token, limit = 20, offset = 0, signal }) {
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100 ||
    !Number.isSafeInteger(offset) || offset < 0 || offset > 10000) {
    throw new ManagementError("صفحه‌بندی نامعتبر است.", 422);
  }
  const query = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  return readReviewPage(await send("/requests?" + query, {
    token, role: "reviewer", signal,
  }), { limit, offset });
}

export async function approveReviewRequest({ token, requestId, expectedVersion }) {
  checkId(requestId);
  checkVersion(expectedVersion);
  return readManagedCourse(await send("/requests/" + requestId + "/approve", {
    token, role: "reviewer", method: "POST",
    payload: { expected_version: expectedVersion },
  }));
}

export async function revokePublication({ token, courseId, expectedVersion }) {
  checkId(courseId);
  checkVersion(expectedVersion);
  return readManagedCourse(await send("/courses/" + courseId + "/revoke", {
    token, role: "reviewer", method: "POST",
    payload: { expected_version: expectedVersion },
  }));
}
