/** Do not reuse this adapter for real students/admins: it has no authentication.
 * Requests work only with the explicit local /__demo route on the temporary API.
 */
const ENDPOINT = "/api/v2/__demo/enrollment";
const VALID_STATUSES = new Set(["pending", "approved", "rejected"]);

export function parseDemoRequest(value) {
  if (!value || typeof value !== "object" || Array.isArray(value) ||
      !Number.isSafeInteger(value.id) || value.id < 1 ||
      !Number.isSafeInteger(value.course_id) || value.course_id < 1 ||
      typeof value.course_name !== "string" ||
      !VALID_STATUSES.has(value.status) ||
      typeof value.requested_at !== "string" ||
      !(value.reviewed_at === null || typeof value.reviewed_at === "string")) {
    throw new Error("پاسخ درخواست آزمایشی معتبر نیست.");
  }
  return {
    id: value.id,
    course_id: value.course_id,
    course_name: value.course_name,
    status: value.status,
    requested_at: value.requested_at,
    reviewed_at: value.reviewed_at,
  };
}

async function requestJson(path, { method = "GET", data, signal } = {}) {
  let response;
  try {
    response = await fetch(ENDPOINT + path, {
      method,
      credentials: "omit",
      headers: {
        Accept: "application/json",
        ...(data ? { "Content-Type": "application/json" } : {}),
      },
      ...(data ? { body: JSON.stringify(data) } : {}),
      signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    throw new Error("اتصال به سرویس آزمایشی درخواست‌ها برقرار نشد.");
  }
  if (response.status === 409) {
    throw new Error("این درخواست قبلاً ثبت یا بررسی شده است.");
  }
  if (response.status === 404) throw new Error("دوره یا درخواست آزمایشی پیدا نشد.");
  if (!response.ok) throw new Error("عملیات درخواست آزمایشی ناموفق بود.");
  try {
    return await response.json();
  } catch {
    throw new Error("پاسخ سرویس آزمایشی معتبر نیست.");
  }
}

export async function listDemoRequests({ admin = false, signal } = {}) {
  const records = await requestJson(admin ? "/admin/requests" : "/requests", { signal });
  if (!Array.isArray(records)) throw new Error("فهرست درخواست‌های آزمایشی معتبر نیست.");
  return records.map(parseDemoRequest);
}

export async function createDemoRequest(courseId, { signal } = {}) {
  if (!Number.isSafeInteger(courseId) || courseId < 1) {
    throw new Error("شناسه دوره معتبر نیست.");
  }
  const result = await requestJson("/requests", {
    method: "POST", data: { course_id: courseId }, signal,
  });
  return parseDemoRequest(result);
}

export async function reviewDemoRequest(id, action, { signal } = {}) {
  if (!Number.isSafeInteger(id) || id < 1 ||
      !["approve", "reject"].includes(action)) {
    throw new Error("تصمیم آزمایشی معتبر نیست.");
  }
  const result = await requestJson("/admin/requests/" + id, {
    method: "PATCH", data: { action }, signal,
  });
  return parseDemoRequest(result);
}

export const DEMO_STATUS_LABELS = Object.freeze({
  pending: "در انتظار بررسی",
  approved: "تأییدشده (فقط آزمایشی)",
  rejected: "ردشده (فقط آزمایشی)",
});
