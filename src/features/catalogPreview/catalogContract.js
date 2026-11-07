/** Only the five fields proposed by the isolated backend catalog candidate. */
export const COURSE_FIELDS = Object.freeze(["id", "name", "summary", "category", "is_online"]);
export const PAGE_SIZE = 12;
export const MAX_OFFSET = 10000;

export function parseCourseId(raw) {
  if (!/^[1-9]\d*$/.test(String(raw ?? ""))) return null;
  const id = Number(raw);
  return Number.isSafeInteger(id) ? id : null;
}

export function projectCourse(value) {
  if (!value || typeof value !== "object" || Array.isArray(value) ||
      !Number.isSafeInteger(value.id) || value.id < 1 ||
      typeof value.name !== "string" || !value.name.trim() ||
      !(typeof value.summary === "string" || value.summary === null) ||
      typeof value.category !== "string" ||
      typeof value.is_online !== "boolean") {
    throw new Error("پاسخ دوره معتبر نیست.");
  }
  return {
    id: value.id,
    name: value.name,
    summary: value.summary,
    category: value.category,
    is_online: value.is_online,
  };
}

export function parseCoursePage(value) {
  if (!value || typeof value !== "object" || !Array.isArray(value.items) ||
      !Number.isInteger(value.limit) || value.limit < 1 || value.limit > 100 ||
      !Number.isInteger(value.offset) || value.offset < 0 || value.offset > MAX_OFFSET ||
      value.items.length > value.limit) {
    throw new Error("پاسخ فهرست دوره‌ها معتبر نیست.");
  }
  return {
    items: value.items.map(projectCourse),
    limit: value.limit,
    offset: value.offset,
  };
}

export function readCatalogFilters(searchParams) {
  const rawOffset = searchParams.get("offset") || "0";
  const offset = /^(0|[1-9]\d*)$/.test(rawOffset) &&
    Number.isSafeInteger(Number(rawOffset)) &&
    Number(rawOffset) <= MAX_OFFSET ? Number(rawOffset) : 0;
  const modality = searchParams.get("is_online");
  return {
    search: (searchParams.get("search") || "").slice(0, 100),
    category: (searchParams.get("category") || "").slice(0, 100),
    is_online: modality === "true" || modality === "false" ? modality : "",
    offset,
    limit: PAGE_SIZE,
  };
}

export function catalogQueryParams(filters) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", String(filters.search).slice(0, 100));
  if (filters.category) params.set("category", String(filters.category).slice(0, 100));
  if (filters.is_online === "true" || filters.is_online === "false") {
    params.set("is_online", filters.is_online);
  }
  const limit = Number.isSafeInteger(filters.limit)
    ? Math.max(1, Math.min(100, filters.limit)) : PAGE_SIZE;
  const offset = Number.isSafeInteger(filters.offset)
    ? Math.max(0, Math.min(MAX_OFFSET, filters.offset)) : 0;
  params.set("limit", String(limit));
  params.set("offset", String(offset));
  return params;
}
