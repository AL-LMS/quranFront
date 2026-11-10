import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createDemoCourse, editDemoCourse, listDemoCourses,
  mutateReviewedCourse, reviewDemoCourse, submitDemoCourse,
} from "./teacherCoursePreviewApi";

const example = {
  id: 92001, name: "آموزش قرآن", summary: null, category: "قرآن",
  is_online: true, status: "draft", approval_status: null, archived: false,
};

afterEach(() => vi.unstubAllGlobals());

function mockJson(value, status = 200) {
  const mock = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => value,
  });
  vi.stubGlobal("fetch", mock);
  return mock;
}

describe("M5-03 synthetic API: no credentials, no fallback", () => {
  it("uses a relative path and only the fixture actor header", async () => {
    const fetcher = mockJson({ ...example, private_contact: "do not expose" });
    const result = await createDemoCourse("demo-teacher-a", {
      name: example.name, summary: null, category: "قرآن", is_online: true,
    });
    expect(result).toEqual(example);
    const [path, options] = fetcher.mock.calls[0];
    expect(path).toBe("/__demo/m5-02/teacher/courses");
    expect(options.method).toBe("POST");
    expect(options.credentials).toBe("omit");
    expect(options.cache).toBe("no-store");
    expect(options.redirect).toBe("error");
    expect(options.headers["X-Demo-Actor"]).toBe("demo-teacher-a");
    expect(options.headers.Authorization).toBeUndefined();
    expect(JSON.parse(options.body)).toEqual({
      name: example.name, summary: null, category: "قرآن", is_online: true,
    });
  });

  it("reads reviewer inventory only from the new M5-02 route", async () => {
    const fetcher = mockJson([{ ...example, internal_user_id: 88 }]);
    expect(await listDemoCourses("demo-reviewer")).toEqual([example]);
    expect(fetcher.mock.calls[0][0]).toBe("/__demo/m5-02/reviewer/courses");
    const teacher = await listDemoCourses("demo-teacher-b");
    expect(teacher).toEqual([example]);
    expect(fetcher.mock.calls[1][0]).toBe("/__demo/m5-02/teacher/courses");
  });

  it("never makes HTTP calls for unexpected role, ID, decision or action", async () => {
    const fetcher = mockJson(example);
    await expect(listDemoCourses("admin")).rejects.toThrow("نقش");
    await expect(editDemoCourse("demo-teacher-a", -1, {})).rejects.toThrow("شناسه");
    await expect(submitDemoCourse("demo-teacher-a", 0)).rejects.toThrow("شناسه");
    await expect(reviewDemoCourse("demo-reviewer", 12, "publish")).rejects.toThrow("تصمیم");
    await expect(mutateReviewedCourse("demo-reviewer", 12, "delete")).rejects.toThrow("اقدام");
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("passes the explicit approval and archive methods without tokens", async () => {
    const fetcher = mockJson(example);
    await reviewDemoCourse("demo-reviewer", 92001, "approve");
    await mutateReviewedCourse("demo-reviewer", 92001, "archive");
    expect(fetcher.mock.calls[0][0]).toBe("/__demo/m5-02/reviewer/courses/92001/review");
    expect(fetcher.mock.calls[1][0]).toBe("/__demo/m5-02/reviewer/courses/92001/archive");
    expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual({ decision: "approve" });
    expect(fetcher.mock.calls.every(([, options]) => options.credentials === "omit")).toBe(true);
  });

  it("reports an offline backend and never falls back to another endpoint", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("offline"));
    vi.stubGlobal("fetch", fetcher);
    await expect(listDemoCourses("demo-teacher-a")).rejects.toThrow("سرور آزمایشی محلی");
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher.mock.calls[0][0]).toBe("/__demo/m5-02/teacher/courses");
  });

  it("rejects response fields with invalid structure instead of trusting them", async () => {
    const fetcher = mockJson([{ ...example, status: "administrator" }]);
    await expect(listDemoCourses("demo-reviewer")).rejects.toThrow("ساختار پاسخ");
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("propagates AbortError and makes no fallback request", async () => {
    const error = new Error("cancelled");
    error.name = "AbortError";
    const fetcher = vi.fn().mockRejectedValue(error);
    vi.stubGlobal("fetch", fetcher);
    await expect(listDemoCourses("demo-reviewer")).rejects.toMatchObject({ name: "AbortError" });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("returns a clear conflict message on stale state", async () => {
    mockJson({ detail: "Invalid review transition" }, 409);
    await expect(submitDemoCourse("demo-teacher-a", 92001)).rejects.toThrow("تازه‌سازی");
  });
});
