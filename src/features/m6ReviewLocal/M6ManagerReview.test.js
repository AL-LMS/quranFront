import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import M6ManagementLocalPage from "../m6ManagementLocal/M6ManagementLocalPage";

const TOKEN = "m6-test-manager-token-abcdefghijklmnopqrstuvwxyz";
const COURSE_ID = "00000000-0000-0000-0000-00000000a001";
const REQUEST_ID = "00000000-0000-0000-0000-00000000d001";
const COURSE = { id: COURSE_ID, title: "آموزش قرآن", status: "draft", version: 1 };
const REQUEST = {
  id: REQUEST_ID, course_id: COURSE_ID, course_version: 1,
  title: COURSE.title, status: "submitted",
};

function reply(body, status = 200) {
  return {
    status, ok: status >= 200 && status < 300,
    headers: { get: (key) => key === "X-AL-LMS-Data-Scope" ? "synthetic-only" : null },
    json: async () => body,
  };
}
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("M6 local manager review request opt-in", () => {
  it("does not show review controls unless explicitly enabled", () => {
    vi.stubGlobal("fetch", vi.fn());
    render(<M6ManagementLocalPage />);
    expect(screen.queryByRole("button", { name: "ارسال برای بررسی انتشار آزمایشی" })).toBeNull();
    expect(screen.getByLabelText("توکن مدیریت محلی").autocomplete).toBe("new-password");
  });

  it("submits an exact draft version with manager token only", async () => {
    const fetcher = vi.fn(async (url, options) => {
      if (options.method === "GET") {
        return reply({ items: [COURSE], limit: 20, offset: 0 });
      }
      if (options.method === "POST" && url.endsWith("/requests")) {
        return reply(REQUEST, 201);
      }
      throw new Error("Unexpected manager review call");
    });
    vi.stubGlobal("fetch", fetcher);
    render(<M6ManagementLocalPage enableLocalReview />);
    fireEvent.change(screen.getByLabelText("توکن مدیریت محلی"), {
      target: { value: TOKEN },
    });
    fireEvent.click(screen.getByRole("button", { name: "اتصال به محیط آزمایشی" }));
    fireEvent.click(await screen.findByRole("button", { name: "مدیریت " + COURSE.title }));
    expect(screen.getByRole("button", { name: "ارسال برای بررسی انتشار آزمایشی" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "ارسال برای بررسی انتشار آزمایشی" }));
    expect(await screen.findByText(/درخواست انتشار برای بررسی مستقل/)).toBeTruthy();
    const post = fetcher.mock.calls.find(([, options]) => options.method === "POST");
    expect(post[0]).toBe("/__demo/m6-review/courses/" + COURSE_ID + "/requests");
    expect(JSON.parse(post[1].body)).toEqual({ expected_version: 1 });
    expect(post[1].headers["X-AL-LMS-Local-Admin-Token"]).toBe(TOKEN);
    expect(post[1].headers["X-AL-LMS-Local-Reviewer-Token"]).toBeUndefined();
    expect(post[1].credentials).toBe("omit");
    expect(post[0]).not.toContain(TOKEN);
  });
});
