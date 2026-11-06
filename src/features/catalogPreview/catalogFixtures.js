import { parseCoursePage, projectCourse } from "./catalogContract";

/** Synthetic examples only: no historical teacher/student data or private fields. */
const examples = [
  ["آموزش روخوانی قرآن", "قرآن", true, "از شناخت حروف تا خواندن روان آیات با تمرین‌های گام‌به‌گام."],
  ["مقدمات تجوید", "تجوید", false, "آشنایی با اصول اولیه تلفظ و قواعد پایه در تلاوت."],
  ["روان‌خوانی قرآن", "قرآن", true, null],
  ["آشنایی با مفاهیم قرآن", "مفاهیم", false, "مروری ساده بر پیام‌ها و مفاهیم منتخب آیات."],
  ["تجوید مقدماتی", "تجوید", true, "تمرین قواعد کاربردی تجوید در نمونه‌های کوتاه."],
  ["آموزش وقف و ابتدا", "قرآن", false, "آشنایی با جایگاه درست توقف و شروع در تلاوت."],
  ["سوره‌های کوتاه", "مفاهیم", true, "مرور معانی و نکات آموزشی سوره‌های کوتاه."],
  ["تمرین قرائت", "قرآن", false, "تمرین روخوانی و تقویت دقت در ادای کلمات."],
  ["تدبر در آیات", "مفاهیم", true, "خواندن و گفت‌وگو درباره مفاهیم آیات منتخب."],
  ["آشنایی با مخارج حروف", "تجوید", false, "شناخت محل ادای حروف با مثال‌های آموزشی."],
  ["تمرین حروف عربی", "قرآن", true, "شناخت شکل و صدای حروف در تمرین‌های کوتاه."],
  ["آشنایی با تفسیر", "مفاهیم", false, "مقدمه‌ای ساده بر روش مطالعه توضیحات آیات."],
  ["قرائت سطح دوم", "قرآن", true, "تمرین متن‌های طولانی‌تر و روان‌تر خواندن."],
  ["تمرین تجوید سطح دوم", "تجوید", false, "مرور قواعد و کاربرد آن‌ها در نمونه‌های تازه."],
  ["معانی واژگان", "مفاهیم", true, "آشنایی با واژه‌های پرتکرار و مفهوم آن‌ها."],
  ["قرائت سطح سوم", "قرآن", false, "تمرین استمرار و دقت بیشتر در خواندن آیات."],
  ["تمرین احکام تجوید", "تجوید", true, "کاربرد احکام منتخب در متن و تمرین تلاوت."],
  ["گفت‌وگو درباره آیات", "مفاهیم", false, "بررسی پرسش‌های رایج پیرامون آیات منتخب."],
  ["تمرین روخوانی گروهی", "قرآن", true, "فعالیت‌های تمرینی برای تقویت مهارت روخوانی."],
  ["آواشناسی تلاوت", "تجوید", false, "تمرکز بر شنیدن و تشخیص ویژگی‌های آوایی."],
  ["تدبر مقدماتی", "مفاهیم", true, "تأمل در پیام‌های ساده و قابل‌فهم آیات."],
  ["آموزش ترتیل", "قرآن", false, "آشنایی ابتدایی با نظم و آهنگ خواندن."],
  ["تمرین ادغام", "تجوید", true, "مثال‌ها و تمرین‌های کوتاه برای یادگیری ادغام."],
  ["واژه‌شناسی آیات", "مفاهیم", false, "بررسی معنی واژه‌ها در متن آیات."],
  ["مرور جزء سی", "قرآن", true, "مروری آموزشی بر سوره‌های جزء سی."],
  ["تمرین تلفظ حروف", "تجوید", false, "دقت در تلفظ حروف با تمرین‌های مقدماتی."],
]

export const syntheticCourses = Object.freeze(examples.map(([name, category, is_online, summary], index) =>
  Object.freeze(projectCourse({
    id: 91001 + index,
    name,
    summary,
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
