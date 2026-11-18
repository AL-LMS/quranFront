import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AutoStoriesRounded from "@mui/icons-material/AutoStoriesRounded";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import ExploreOutlined from "@mui/icons-material/ExploreOutlined";
import LockOutlined from "@mui/icons-material/LockOutlined";
import { listLocalUuidCourses } from "../uuidCatalogLocal/uuidCatalogApi";
import "./M8PublicCatalogBridge.css";

const LIMIT = 3;

/** A public catalog is not an enrollment, an access grant, or a learner's course list. */
export function M8PublicCatalogBridge() {
  const [page, setPage] = useState(0);
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState({ loading: true, items: [], error: "" });

  useEffect(() => {
    const controller = new AbortController();
    setState({ loading: true, items: [], error: "" });
    listLocalUuidCourses({ limit: LIMIT, offset: page * LIMIT, signal: controller.signal })
      .then((items) => {
        if (!controller.signal.aborted) setState({ loading: false, items, error: "" });
      })
      .catch((error) => {
        if (!controller.signal.aborted) setState({ loading: false, items: [], error: error.message });
      });
    return () => controller.abort();
  }, [page, revision]);

  return (
    <section className="m8-public-catalog" aria-labelledby="m8-public-catalog-heading">
      <div className="m8-public-catalog-heading">
        <div><span className="m8-public-catalog-kicker"><ExploreOutlined fontSize="small" /> کاوش دوره‌ها</span>
          <h2 id="m8-public-catalog-heading">کاتالوگ عمومی آزمایشی</h2>
          <p>این فهرست از سرویس محلی دوره‌های منتشرشده دریافت می‌شود؛ هیچ دوره‌ای به حساب شما تخصیص داده نشده است.</p>
        </div>
        <span className="m8-public-catalog-badge">فقط دادهٔ ساختگی</span>
      </div>
      {state.loading ? <p className="m8-public-catalog-status" role="status">در حال دریافت فهرست عمومی آزمایشی…</p> : null}
      {state.error ? <div className="m8-public-catalog-status m8-public-catalog-error" role="alert">
        <span>منبع فهرست عمومی آزمایشی تأیید نشد. هیچ داده‌ای نمایش داده نمی‌شود.</span>
        <button type="button" onClick={() => setRevision((value) => value + 1)}>تلاش دوباره</button>
      </div> : null}
      {!state.loading && !state.error && state.items.length === 0 ?
        <p className="m8-public-catalog-status">در این صفحه دورهٔ عمومی آزمایشی وجود ندارد.</p> : null}
      {!state.loading && !state.error && state.items.length > 0 ? (
        <div className="m8-public-catalog-grid">
          {state.items.map((course) => <article className="m8-public-catalog-card" key={course.id}>
            <span className="m8-public-catalog-icon"><AutoStoriesRounded /></span>
            <div><small>دورهٔ عمومی نمونه</small><h3>{course.title}</h3></div>
            <Link to={`/__preview/m5-uuid/${course.id}`} aria-label={`مشاهده جزئیات ${course.title}`}>
              جزئیات عمومی <ArrowBackRounded fontSize="small" />
            </Link>
          </article>)}
        </div>
      ) : null}
      {!state.loading && !state.error ? <div className="m8-public-catalog-pagination">
        <button type="button" disabled={page === 0} onClick={() => setPage((value) => value - 1)}>صفحهٔ قبل</button>
        <span>صفحهٔ {page + 1}</span>
        <button type="button" disabled={state.items.length < LIMIT} onClick={() => setPage((value) => value + 1)}>صفحهٔ بعد</button>
      </div> : null}
      <p className="m8-public-catalog-disclaimer"><LockOutlined fontSize="small" /> مشاهدهٔ عنوان‌های عمومی، ثبت‌نام یا دسترسی به محتوای دوره نیست. هیچ مجوزی از نقش یا نشست آزمایشی استنتاج نمی‌شود.</p>
    </section>
  );
}
