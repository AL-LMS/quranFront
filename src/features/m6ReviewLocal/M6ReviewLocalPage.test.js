import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import M6ReviewLocalPage from "./M6ReviewLocalPage";

const TOKEN = "m6-test-reviewer-token-abcdefghijklmnopqrstuvwxyz";
const REQUEST_ID = "00000000-0000-0000-0000-00000000d001";
const COURSE_ID = "00000000-0000-0000-0000-00000000a001";
const REQUEST = {
  id: REQUEST_ID, course_id: COURSE_ID, course_version: 1,
  title: "آموزش قرآن", status: "submitted",
};
const PUBLISHED = { id: COURSE_ID, title: REQUEST.title, status: "published", version: 2 };

function reply(body, status = 200, scope = "synthetic-only") {
  return {
    status, ok: status >= 200 && status < 300,
    headers: { get: (name) => name === "X-AL-LMS-Data-Scope" ? scope : null },
    json: async () => body,
  };
}
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

function connect() {
  fireEvent.change(screen.getByLabelText("توکن بررسی محلی"), {
    target: { value: TOKEN },
  });
  fireEvent.click(screen.getByRole("button", { name: "اتصال به بررسی آزمایشی" }));
}

describe("M6 local reviewer RTL preview", () => {
  it("starts disconnected and avoids browser-stored reviewer tokens", () => {
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    render(<M6ReviewLocalPage />);
    expect(screen.getByRole("heading", { name: "بررسی انتشار دوره‌ها" })).toBeTruthy();
    const input = screen.getByLabelText("توکن بررسی محلی");
    expect(input.type).toBe("password");
    expect(input.autocomplete).toBe("new-password");
    expect(screen.queryByRole("button", { name: "تأیید انتشار آزمایشی" })).toBeNull();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("reviews then revokes with distinct reviewer header and exact revision", async () => {
    let approved = false;
    const fetcher = vi.fn(async (url, options) => {
      if (options.method === "GET") {
        return reply({ items: approved ? [] : [REQUEST], limit: 20, offset: 0 });
      }
      if (options.method === "POST" && url.endsWith("/approve")) {
        approved = true;
        return reply(PUBLISHED);
      }
      if (options.method === "POST" && url.endsWith("/revoke")) {
        return reply({ ...PUBLISHED, status: "draft", version: 3 });
      }
      throw new Error("Unexpected reviewer request");
    });
    vi.stubGlobal("fetch", fetcher);
    render(<M6ReviewLocalPage />);
    connect();
    expect(await screen.findByText(REQUEST.title)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "انتخاب درخواست" }));
    fireEvent.click(screen.getByRole("button", { name: "شروع تأیید درخواست" }));
    expect(screen.getByText(/آیا این نسخه از دوره/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "تأیید انتشار آزمایشی" }));
    expect(await screen.findByText(/بررسی آزمایشی تأیید شد/)).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByLabelText("UUID دوره برای لغو").value).toBe(COURSE_ID);
    });
    expect(screen.getByLabelText("نسخهٔ منتشرشده").value).toBe("2");
    fireEvent.click(screen.getByRole("button", { name: "درخواست لغو انتشار" }));
    expect(screen.getByText(/با لغو تأیید/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "تأیید لغو انتشار" }));
    expect(await screen.findByText(/تأیید انتشار لغو شد/)).toBeTruthy();

    const writes = fetcher.mock.calls.filter(([, opts]) => opts.method === "POST");
    expect(writes).toHaveLength(2);
    expect(writes.map(([url]) => url)).toEqual([
      "/__demo/m6-review/requests/" + REQUEST_ID + "/approve",
      "/__demo/m6-review/courses/" + COURSE_ID + "/revoke",
    ]);
    expect(writes.map(([, opts]) => JSON.parse(opts.body))).toEqual([
      { expected_version: 1 }, { expected_version: 2 },
    ]);
    expect(fetcher.mock.calls.every(([url, opts]) =>
      opts.headers["X-AL-LMS-Local-Reviewer-Token"] === TOKEN &&
      opts.headers["X-AL-LMS-Local-Admin-Token"] === undefined &&
      opts.credentials === "omit" && !url.includes(TOKEN)
    )).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "قطع اتصال و پاک‌کردن توکن" }));
    expect(screen.getByLabelText("توکن بررسی محلی").value).toBe("");
  });

  it("rejects reviewer token safely without revealing server response", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      reply({ detail: "private reviewer secret" }, 403, null)
    );
    vi.stubGlobal("fetch", fetcher);
    render(<M6ReviewLocalPage />);
    connect();
    expect(await screen.findByText(/توکن یا مجوز محلی پذیرفته نشد/)).toBeTruthy();
    expect(screen.getByLabelText("توکن بررسی محلی").value).toBe("");
    expect(screen.queryByText("private reviewer secret")).toBeNull();
  });
});
