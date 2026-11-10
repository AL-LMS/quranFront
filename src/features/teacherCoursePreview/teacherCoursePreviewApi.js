/** Synthetic-only API. Header fixture actors do NOT authenticate real users. */
const ROOT = "/__demo/m5-02";
export const DEMO_ACTORS = Object.freeze(["demo-teacher-a", "demo-teacher-b", "demo-reviewer"]);

function validActor(actor) {
  if (!DEMO_ACTORS.includes(actor)) throw new Error("نقش آزمایشی معتبر نیست.");
  return actor;
}

function projectItem(source) {
  if (!source || typeof source !== "object" ||
      !Number.isSafeInteger(source.id) || source.id < 1 ||
      typeof source.name !== "string" ||
      (source.summary !== null && typeof source.summary !== "string") ||
      typeof source.category !== "string" ||
      typeof source.is_online !== "boolean" ||
      !["draft", "published"].includes(source.status) ||
      ![null, "pending", "approved", "rejected", "revoked"].includes(source.approval_status) ||
      typeof source.archived !== "boolean") {
    throw new Error("ساختار پاسخ آزمایشی معتبر نیست.");
  }
  return {
    id: source.id,
    name: source.name,
    summary: source.summary,
    category: source.category,
    is_online: source.is_online,
    status: source.status,
    approval_status: source.approval_status,
    archived: source.archived,
  };
}

async function request(path, { actor, method = "GET", body, signal } = {}) {
  validActor(actor);
  let response;
  try {
    response = await fetch(ROOT + path, {
      method,
      headers: {
        Accept: "application/json",
        "X-Demo-Actor": actor,
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      credentials: "omit",
      cache: "no-store",
      redirect: "error",
      signal,
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    throw new Error("سرور آزمایشی محلی در دسترس نیست. دادهٔ واقعی بارگذاری نمی‌شود.");
  }
  if (response.status === 409) throw new Error("وضعیت دوره تغییر کرده است؛ فهرست را تازه‌سازی کنید.");
  if (response.status === 403 || response.status === 404) {
    throw new Error("این اقدام برای نقش آزمایشی مجاز نیست یا دوره پیدا نشد.");
  }
  if (!response.ok) throw new Error("عملیات آزمایشی ناموفق بود.");
  try {
    return await response.json();
  } catch {
    throw new Error("پاسخ سرور آزمایشی قابل خواندن نیست.");
  }
}

export async function listDemoCourses(actor, { signal } = {}) {
  const path = actor === "demo-reviewer" ? "/reviewer/courses" : "/teacher/courses";
  const data = await request(path, { actor, signal });
  if (!Array.isArray(data)) throw new Error("پاسخ فهرست آزمایشی معتبر نیست.");
  return data.map(projectItem);
}

export async function createDemoCourse(actor, fields, options = {}) {
  return projectItem(await request("/teacher/courses", {
    actor, method: "POST", body: fields, ...options,
  }));
}

export async function editDemoCourse(actor, id, fields, options = {}) {
  if (!Number.isSafeInteger(id) || id < 1) throw new Error("شناسه دوره معتبر نیست.");
  return projectItem(await request("/teacher/courses/" + id, {
    actor, method: "PUT", body: fields, ...options,
  }));
}

export async function submitDemoCourse(actor, id, options = {}) {
  if (!Number.isSafeInteger(id) || id < 1) throw new Error("شناسه دوره معتبر نیست.");
  return projectItem(await request("/teacher/courses/" + id + "/submit", {
    actor, method: "POST", ...options,
  }));
}

export async function reviewDemoCourse(actor, id, decision, options = {}) {
  if (!Number.isSafeInteger(id) || id < 1) throw new Error("شناسه دوره معتبر نیست.");
  if (!["approve", "reject"].includes(decision)) throw new Error("تصمیم آزمایشی معتبر نیست.");
  return projectItem(await request("/reviewer/courses/" + id + "/review", {
    actor, method: "POST", body: { decision }, ...options,
  }));
}

export async function mutateReviewedCourse(actor, id, action, options = {}) {
  if (!Number.isSafeInteger(id) || id < 1) throw new Error("شناسه دوره معتبر نیست.");
  if (!["revoke", "archive"].includes(action)) throw new Error("اقدام آزمایشی معتبر نیست.");
  return projectItem(await request("/reviewer/courses/" + id + "/" + action, {
    actor, method: "POST", ...options,
  }));
}
