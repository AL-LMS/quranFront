import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { M8PublicCatalogBridge } from "./M8PublicCatalogBridge";
import { m8CatalogBridgeEnabled } from "./m8CatalogBridgeGate";

const ID1 = "00000000-0000-4000-8000-000000000001";
const ID2 = "00000000-0000-4000-8000-000000000002";
const ID3 = "00000000-0000-4000-8000-000000000003";
const ID4 = "00000000-0000-4000-8000-000000000004";

function reply(items, { scope = "synthetic-only", limit = 3, offset = 0 } = {}) {
  return new Response(JSON.stringify({ items, limit, offset }), {
    status: 200,
    headers: scope ? { "X-AL-LMS-Data-Scope": scope } : {},
  });
}

function view() {
  render(<MemoryRouter><M8PublicCatalogBridge /></MemoryRouter>);
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("M8 dev-only public course catalog bridge", () => {
  const flags = {
    dev: true,
    authPreview: "true",
    catalogPreview: "true",
    allowCatalogApi: "true",
    bridgeFlag: "true",
  };

  it("requires all preview flags plus development mode, never defaults on", () => {
    expect(m8CatalogBridgeEnabled(flags)).toBe(true);
    for (const key of Object.keys(flags)) {
      expect(m8CatalogBridgeEnabled({ ...flags, [key]: key === "dev" ? false : undefined })).toBe(false);
    }
    expect(m8CatalogBridgeEnabled({ ...flags, catalogPreview: "false" })).toBe(false);
  });

  it("lists only synthetic public titles without session credentials or enrollment claims", async () => {
    const fetcher = vi.fn(async () => reply([{ id: ID1, title: "آشنایی با قرآن" }]));
    vi.stubGlobal("fetch", fetcher);
    view();

    expect(await screen.findByRole("heading", { name: "آشنایی با قرآن" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "مشاهده جزئیات آشنایی با قرآن" }).getAttribute("href"))
      .toBe(`/__preview/m5-uuid/${ID1}`);
    expect(screen.getByText(/ثبت‌نام یا دسترسی به محتوای دوره نیست/)).toBeTruthy();
    expect(screen.queryByText(/دانش‌آموز ثبت‌نام‌شده/)).toBeNull();
    expect(fetcher).toHaveBeenCalledTimes(1);
    const [url, options] = fetcher.mock.calls[0];
    expect(url).toBe("/__demo/m5-uuid/courses?limit=3&offset=0");
    expect(options).toMatchObject({ method: "GET", credentials: "omit", cache: "no-store", redirect: "error" });
  });

  it("denies a missing synthetic provenance header and provides a retry", async () => {
    let attempts = 0;
    const fetcher = vi.fn(async () => {
      attempts += 1;
      return attempts === 1
        ? reply([{ id: ID1, title: "فقط نمونه" }], { scope: null })
        : reply([{ id: ID1, title: "نمونهٔ بازیابی" }]);
    });
    vi.stubGlobal("fetch", fetcher);
    view();

    expect(await screen.findByRole("alert")).toHaveTextContent("منبع فهرست عمومی آزمایشی تأیید نشد");
    expect(screen.queryByText("فقط نمونه")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "تلاش دوباره" }));
    expect(await screen.findByRole("heading", { name: "نمونهٔ بازیابی" })).toBeTruthy();
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("rejects extra private course fields rather than displaying them", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => reply([{ id: ID1, title: "نمونه", student_phone: "private" }])));
    view();
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(screen.queryByText("نمونه")).toBeNull();
    expect(screen.queryByText("private")).toBeNull();
  });

  it("paginates public UUID courses without inventing membership or a total count", async () => {
    const fetcher = vi.fn(async (url) => url.endsWith("offset=3")
      ? reply([{ id: ID4, title: "درس چهارم" }], { offset: 3 })
      : reply([
        { id: ID1, title: "درس اول" },
        { id: ID2, title: "درس دوم" },
        { id: ID3, title: "درس سوم" },
      ]));
    vi.stubGlobal("fetch", fetcher);
    view();
    expect(await screen.findByRole("heading", { name: "درس اول" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "صفحهٔ بعد" }));
    expect(await screen.findByRole("heading", { name: "درس چهارم" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "درس اول" })).toBeNull();
    expect(screen.getByRole("button", { name: "صفحهٔ بعد" })).toBeDisabled();
    expect(fetcher.mock.calls.map(([url]) => url)).toEqual([
      "/__demo/m5-uuid/courses?limit=3&offset=0",
      "/__demo/m5-uuid/courses?limit=3&offset=3",
    ]);
  });
});
