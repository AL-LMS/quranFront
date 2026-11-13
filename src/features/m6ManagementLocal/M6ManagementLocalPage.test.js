import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import M6ManagementLocalPage from "./M6ManagementLocalPage";

const TOKEN = "m6-local-test-secret-token-abcdefghijklmnopqrstuvwxyz";
const ID = "00000000-0000-0000-0000-00000000a001";
const FIRST = { id: ID, title: "دوره تازه", status: "draft", version: 1 };
const HEADER = "X-AL-LMS-Local-Admin-Token";

function reply(body, status = 200, scope = "synthetic-only") {
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: { get: (name) => name === "X-AL-LMS-Data-Scope" ? scope : null },
    json: async () => body,
  };
}

function connect() {
  fireEvent.change(screen.getByLabelText("توکن مدیریت محلی"), {
    target: { value: TOKEN },
  });
  fireEvent.click(screen.getByRole("button", { name: "اتصال به محیط آزمایشی" }));
}

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("M6 Persian RTL local management", () => {
  it("does not call API until the user enters a temporary token", () => {
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    render(<M6ManagementLocalPage />);
    expect(screen.getByRole("heading", { name: "مدیریت دوره‌های قرآن" })).toBeTruthy();
    expect(screen.getByText(/توسعهٔ محلی.*PostgreSQL/)).toBeTruthy();
    const tokenInput = screen.getByLabelText("توکن مدیریت محلی");
    expect(tokenInput.type).toBe("password");
    expect(screen.queryByText("ساخت پیش‌نویس")).toBeNull();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("creates, edits and confirms archive with exact version and token header", async () => {
    let current = null;
    const fetcher = vi.fn(async (url, options) => {
      expect(options.credentials).toBe("omit");
      expect(options.headers[HEADER]).toBe(TOKEN);
      expect(url).not.toContain(TOKEN);
      if (options.method === "GET") {
        return reply({ items: current ? [current] : [], limit: 20, offset: 0 });
      }
      if (options.method === "POST" && url.endsWith("/courses")) {
        expect(JSON.parse(options.body)).toEqual({ title: FIRST.title });
        current = { ...FIRST };
        return reply(current, 201);
      }
      if (options.method === "PATCH") {
        expect(JSON.parse(options.body)).toEqual({
          title: "عنوان ویرایش‌شده", expected_version: 1,
        });
        current = { ...current, title: "عنوان ویرایش‌شده", version: 2 };
        return reply(current);
      }
      if (options.method === "POST" && url.endsWith("/archive")) {
        expect(JSON.parse(options.body)).toEqual({ expected_version: 2 });
        current = { ...current, status: "archived", version: 3 };
        return reply(current);
      }
      throw new Error("Unexpected request");
    });
    vi.stubGlobal("fetch", fetcher);
    render(<M6ManagementLocalPage />);
    connect();
    await screen.findByRole("heading", { name: "ایجاد دورهٔ جدید" });

    fireEvent.change(screen.getByRole("textbox", { name: /عنوان دورهٔ جدید/ }), {
      target: { value: FIRST.title },
    });
    fireEvent.click(screen.getByRole("button", { name: "ساخت پیش‌نویس" }));
    expect(await screen.findByText(/دورهٔ جدید به‌صورت پیش‌نویس ساخته شد/)).toBeTruthy();
    await screen.findByRole("button", { name: "مدیریت " + FIRST.title });
    expect(screen.getByRole("textbox", { name: /عنوان ویرایش/ }).value).toBe(FIRST.title);

    fireEvent.change(screen.getByRole("textbox", { name: /عنوان ویرایش/ }), {
      target: { value: "عنوان ویرایش‌شده" },
    });
    fireEvent.click(screen.getByRole("button", { name: "ذخیرهٔ ویرایش" }));
    expect(await screen.findByText(/ویرایش ثبت شد/)).toBeTruthy();
    await waitFor(() => {
      expect(screen.getAllByText(/v2/).length).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getByRole("button", { name: "بایگانی دوره" }));
    expect(screen.getByText(/آیا این دوره بایگانی شود/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "تأیید بایگانی" }));
    expect(await screen.findByText(/دوره بایگانی شد/)).toBeTruthy();
    await waitFor(() => {
      expect(screen.getAllByText(/v3/).length).toBeGreaterThan(0);
    });
    expect(screen.queryByRole("button", { name: "ذخیرهٔ ویرایش" }).disabled).toBe(true);

    expect(screen.getByRole("heading", { name: "مدیریت دوره‌های قرآن" })).toBeTruthy();
    expect(fetcher.mock.calls.some(([url, options]) =>
      url.endsWith("/archive") && options.method === "POST"
    )).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "قطع اتصال و پاک‌کردن توکن" }));
    expect(screen.getByLabelText("توکن مدیریت محلی").value).toBe("");
    expect(screen.queryByRole("button", { name: "ساخت پیش‌نویس" })).toBeNull();
  });

  it("handles rejected token without displaying backend secrets", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      reply({ detail: "private server token" }, 403, null)
    );
    vi.stubGlobal("fetch", fetcher);
    render(<M6ManagementLocalPage />);
    connect();
    expect(await screen.findByText(/توکن مدیریت محلی پذیرفته نشد/)).toBeTruthy();
    expect(screen.queryByText("private server token")).toBeNull();
    expect(screen.getByLabelText("توکن مدیریت محلی").value).toBe("");
  });

  it("reports HTTP 409 without hiding or incorrectly updating the selected version", async () => {
    const fetcher = vi.fn(async (_url, options) => {
      if (options.method === "GET") {
        return reply({ items: [FIRST], limit: 20, offset: 0 });
      }
      if (options.method === "PATCH") {
        return reply({ detail: "database secret" }, 409, null);
      }
      throw new Error("Unexpected write");
    });
    vi.stubGlobal("fetch", fetcher);
    render(<M6ManagementLocalPage />);
    connect();
    fireEvent.click(await screen.findByRole("button", { name: "مدیریت " + FIRST.title }));
    fireEvent.change(screen.getByRole("textbox", { name: /عنوان ویرایش/ }), {
      target: { value: "عنوان اصلاح شده" },
    });
    fireEvent.click(screen.getByRole("button", { name: "ذخیرهٔ ویرایش" }));
    expect(await screen.findByText(/نسخه یا وضعیت دوره تغییر کرده است/)).toBeTruthy();
    expect(screen.getByRole("textbox", { name: /عنوان ویرایش/ }).value).toBe("عنوان اصلاح شده");
    expect(screen.queryByText("database secret")).toBeNull();
  });
});
