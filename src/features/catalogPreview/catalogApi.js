import { catalogQueryParams, parseCourseId, parseCoursePage, projectCourse } from "./catalogContract";

async function getJson(path, { signal } = {}) {
  let response;
  try {
    response = await fetch(path, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "omit",
      signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    throw new Error("ارتباط با فهرست دوره‌ها برقرار نشد.");
  }
  if (response.status === 404) return { notFound: true };
  if (!response.ok) throw new Error("دریافت اطلاعات دوره ناموفق بود.");
  try {
    return { value: await response.json() };
  } catch {
    throw new Error("پاسخ سرور قابل خواندن نیست.");
  }
}

export async function fetchCatalogPage(filters, { signal } = {}) {
  const query = catalogQueryParams(filters).toString();
  const result = await getJson("/api/v2/catalog/courses?" + query, { signal });
  if (result.notFound) throw new Error("سرویس پیش‌نمایش دوره‌ها در دسترس نیست.");
  return parseCoursePage(result.value);
}

export async function fetchCatalogDetail(id, { signal } = {}) {
  if (parseCourseId(id) === null) throw new Error("شناسه دوره معتبر نیست.");
  const result = await getJson("/api/v2/catalog/courses/" + id, { signal });
  if (result.notFound) return null;
  return projectCourse(result.value);
}
