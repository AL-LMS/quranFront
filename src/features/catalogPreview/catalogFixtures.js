import { parseCoursePage, projectCourse } from "./catalogContract";

/** Synthetic examples only: no historical teacher/student data or private fields. */
const examples = [
  ["آموزش روخوانی قرآن", "قرآن", true],
  ["مقدمات تجوید", "تجوید", false],
  ["روان‌خوانی قرآن", "قرآن", true],
  ["آشنایی با مفاهیم قرآن", "مفاهیم", false],
  ["تجوید مقدماتی", "تجوید", true],
  ["آموزش وقف و ابتدا", "قرآن", false],
  ["سوره‌های کوتاه", "مفاهیم", true],
  ["تمرین قرائت", "قرآن", false],
  ["تدبر در آیات", "مفاهیم", true],
  ["آشنایی با مخارج حروف", "تجوید", false],
  ["تمرین حروف عربی", "قرآن", true],
  ["آشنایی با تفسیر", "مفاهیم", false],
  ["قرائت سطح دوم", "قرآن", true],
  ["تمرین تجوید سطح دوم", "تجوید", false],
  ["معانی واژگان", "مفاهیم", true],
  ["قرائت سطح سوم", "قرآن", false],
  ["تمرین احکام تجوید", "تجوید", true],
  ["گفت‌وگو درباره آیات", "مفاهیم", false],
  ["تمرین روخوانی گروهی", "قرآن", true],
  ["آواشناسی تلاوت", "تجوید", false],
  ["تدبر مقدماتی", "مفاهیم", true],
  ["آموزش ترتیل", "قرآن", false],
  ["تمرین ادغام", "تجوید", true],
  ["واژه‌شناسی آیات", "مفاهیم", false],
  ["مرور جزء سی", "قرآن", true],
  ["تمرین تلفظ حروف", "تجوید", false],
];

export const syntheticCourses = Object.freeze(examples.map(([name, category, is_online], index) =>
  Object.freeze(projectCourse({
    id: 91001 + index,
    name: "نمونه آموزشی — " + name,
    summary: index === 2 ? null : "اطلاعات کاملاً ساختگی برای پیش‌نمایش رابط کاربری.",
    category,
    is_online,
  }))
));

export const syntheticCategories = Object.freeze(
  [...new Set(syntheticCourses.map((item) => item.category))]
);

export function syntheticCatalogPage(filters) {
  const query = (filters.search || "").trim().toLocaleLowerCase("fa");
  const category = filters.category || "";
  const mode = filters.is_online || "";
  const matching = syntheticCourses.filter((course) => {
    if (query && !course.name.toLocaleLowerCase("fa").includes(query)) return false;
    if (category && course.category !== category) return false;
    if (mode === "true" && !course.is_online) return false;
    if (mode === "false" && course.is_online) return false;
    return true;
  });
  const { offset, limit } = filters;
  return parseCoursePage({ items: matching.slice(offset, offset + limit), limit, offset });
}

export function syntheticCatalogDetail(id) {
  return syntheticCourses.find((item) => item.id === id) || null;
}
