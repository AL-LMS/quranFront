import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TeacherCoursePreviewPage from "./TeacherCoursePreviewPage";

const api = vi.hoisted(() => ({
  listDemoCourses: vi.fn(),
  createDemoCourse: vi.fn(),
  editDemoCourse: vi.fn(),
  submitDemoCourse: vi.fn(),
  reviewDemoCourse: vi.fn(),
  mutateReviewedCourse: vi.fn(),
}));
vi.mock("./teacherCoursePreviewApi", () => api);

const COURSE = {
  id: 92001, name: "آموزش قرآن", summary: "نمونه تمرین",
  category: "قرآن", is_online: true,
  status: "draft", approval_status: null, archived: false,
};

beforeEach(() => {
  vi.resetAllMocks();
  api.listDemoCourses.mockResolvedValue([]);
  api.createDemoCourse.mockResolvedValue(COURSE);
  api.editDemoCourse.mockResolvedValue(COURSE);
  api.submitDemoCourse.mockResolvedValue({ ...COURSE, approval_status: "pending" });
  api.reviewDemoCourse.mockResolvedValue({
    ...COURSE, status: "published", approval_status: "approved",
  });
  api.mutateReviewedCourse.mockResolvedValue({
    ...COURSE, status: "published", approval_status: "revoked",
  });
});
afterEach(() => cleanup());

function view() {
  return render(<MemoryRouter><TeacherCoursePreviewPage /></MemoryRouter>);
}

describe("M5-03 Persian teacher/reviewer local preview", () => {
  it("clearly labels fictional actors and creates a synthetic draft", async () => {
    api.listDemoCourses.mockResolvedValueOnce([]).mockResolvedValueOnce([COURSE]);
    view();
    expect(screen.getByText(/نقش‌ها و دوره‌های این صفحه ساختگی هستند/)).toBeTruthy();
    expect(await screen.findByText("هنوز دوره‌ای برای این نقش آزمایشی وجود ندارد.")).toBeTruthy();

    fireEvent.change(screen.getByRole("textbox", { name: "عنوان دوره" }), {
      target: { value: COURSE.name },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "خلاصه عمومی" }), {
      target: { value: COURSE.summary },
    });
    fireEvent.click(screen.getByRole("button", { name: "ساخت پیش‌نویس" }));
    await waitFor(() => expect(api.createDemoCourse).toHaveBeenCalledWith(
      "demo-teacher-a",
      { name: COURSE.name, summary: COURSE.summary, category: "قرآن", is_online: true },
      expect.objectContaining({ signal: expect.anything() }),
    ));
    expect(await screen.findByRole("heading", { name: COURSE.name })).toBeTruthy();
    expect(screen.getByRole("button", { name: "ارسال برای بررسی" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "مشاهده فهرست عمومی آزمایشی" })
      .getAttribute("href")).toBe("/__preview/catalog?source=api");
  });

  it("shows a separate reviewer perspective and explicit actions", async () => {
    api.listDemoCourses.mockImplementation(async (actor) => (
      actor === "demo-reviewer"
        ? [ { ...COURSE, approval_status: "pending" }, {
          ...COURSE, id: 92002, name: "دوره منتشرشده",
          status: "published", approval_status: "approved",
        }]
        : []
    ));
    view();
    fireEvent.click(screen.getByRole("button", { name: "مدیر آزمایشی" }));
    expect(await screen.findByRole("heading", { name: "دوره منتشرشده" })).toBeTruthy();
    expect(screen.queryByRole("textbox", { name: "عنوان دوره" })).toBeNull();
    expect(screen.getByRole("button", { name: "تأیید و انتشار" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "لغو انتشار" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "تأیید و انتشار" }));
    await waitFor(() => expect(api.reviewDemoCourse).toHaveBeenCalledWith(
      "demo-reviewer", 92001, "approve",
      expect.objectContaining({ signal: expect.anything() }),
    ));
  });

  it("keeps failed draft content and does not pretend the operation succeeded", async () => {
    api.createDemoCourse.mockRejectedValue(new Error("سرور آزمایشی محلی در دسترس نیست."));
    view();
    expect(await screen.findByText("هنوز دوره‌ای برای این نقش آزمایشی وجود ندارد.")).toBeTruthy();
    fireEvent.change(screen.getByRole("textbox", { name: "عنوان دوره" }), {
      target: { value: COURSE.name },
    });
    fireEvent.click(screen.getByRole("button", { name: "ساخت پیش‌نویس" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("سرور آزمایشی محلی");
    expect(screen.getByRole("textbox", { name: "عنوان دوره" }).value).toBe(COURSE.name);
    expect(api.listDemoCourses).toHaveBeenCalledTimes(1);
  });

  it("separates teacher A and teacher B views", async () => {
    api.listDemoCourses.mockImplementation(async (actor) => (
      actor === "demo-teacher-a" ? [COURSE] : []
    ));
    view();
    expect(await screen.findByRole("heading", { name: COURSE.name })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "مربی آزمایشی دوم" }));
    expect(await screen.findByText("هنوز دوره‌ای برای این نقش آزمایشی وجود ندارد.")).toBeTruthy();
    expect(screen.queryByRole("heading", { name: COURSE.name })).toBeNull();
    expect(api.listDemoCourses).toHaveBeenCalledWith(
      "demo-teacher-b", expect.objectContaining({ signal: expect.anything() }),
    );
  });
});
