import React, { StrictMode } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import { vi } from "vitest";
import HomePage from "./HomePage";

vi.mock("axios", () => ({ default: vi.fn() }));

const renderHomePage = (page = <HomePage />) =>
  render(<MemoryRouter>{page}</MemoryRouter>);

const legacyCourse = (overrides = {}) => ({
  course_id: 91001,
  name: "دوره نمونه",
  picture: "default",
  teacher_pic: null,
  teacher_name: "مربی نمونه",
  explain: "توضیح دوره",
  teacher_description: "توضیح مربی",
  ...overrides,
});

const legacyResponse = (courses = []) => ({
  data: {
    status: 200,
    tracking_code: "trace-local-1",
    response: { all_course: courses },
  },
});

describe("homepage course request states", () => {
  beforeEach(() => {
    axios.mockReset();
  });

  it("announces loading while the legacy course request is pending", () => {
    axios.mockReturnValue(new Promise(() => {}));
    renderHomePage();
    expect(screen.getByRole("status")).toHaveTextContent("در حال دریافت دوره‌ها");
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        data: {
          table: "courses",
          method_type: "get_courses",
          data: { query: {}, from: 0, to: 3 },
        },
        baseURL: expect.stringMatching(/back_request\/select_request\/$/),
      })
    );
    const requestConfig = axios.mock.calls[0][0];
    expect(requestConfig.signal).toBeInstanceOf(AbortSignal);
    expect(requestConfig.headers).not.toHaveProperty("Access-Control-Allow-Origin");
  });

  it("distinguishes a successful empty course list from a request failure", async () => {
    axios.mockResolvedValue(legacyResponse([]));
    renderHomePage();

    expect(
      await screen.findByText("در حال حاضر دوره‌ای برای نمایش وجود ندارد.")
    ).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders legacy course cards using their stable course identifiers", async () => {
    axios.mockResolvedValue(
      legacyResponse([
        legacyCourse({ course_id: 91001, name: "روخوانی" }),
        legacyCourse({ course_id: 91002, name: "تجوید", picture: null }),
      ])
    );
    const diagnostic = vi.spyOn(console, "error").mockImplementation(() => {});
    renderHomePage();

    expect(await screen.findByText("روخوانی")).toBeInTheDocument();
    expect(screen.getByText("تجوید")).toBeInTheDocument();
    expect(diagnostic.mock.calls.flat().join(" ")).not.toContain("unique key");
    diagnostic.mockRestore();
  });

  it("shows a safe error and retries successfully without logging response data", async () => {
    const error = Object.assign(new Error("Request failed"), {
      response: {
        status: 503,
        headers: { "x-request-id": "req-local-4" },
        data: { detail: "sensitive SQL, credentials, token and phone must not be logged" },
      },
    });
    axios
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce(legacyResponse([legacyCourse({ name: "بازیابی موفق" })]));
    const diagnostic = vi.spyOn(console, "error").mockImplementation(() => {});

    renderHomePage();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "دریافت دوره‌ها با خطا مواجه شد. لطفاً دوباره تلاش کنید."
    );
    expect(diagnostic).toHaveBeenCalledWith("Homepage course request failed", {
      endpoint: "/legacy/back_request/select_request/",
      category: "http",
      status: 503,
      requestId: "req-local-4",
    });
    expect(JSON.stringify(diagnostic.mock.calls)).not.toMatch(
      /sensitive SQL|credentials|token|phone/
    );

    fireEvent.click(screen.getByRole("button", { name: "تلاش دوباره" }));
    expect(await screen.findByText("بازیابی موفق")).toBeInTheDocument();
    await waitFor(() => expect(axios).toHaveBeenCalledTimes(2));
    diagnostic.mockRestore();
  });

  it("fails safely on malformed course envelopes, rows and identifiers", async () => {
    const diagnostic = vi.spyOn(console, "error").mockImplementation(() => {});
    axios.mockResolvedValue({
      data: {
        status: 200,
        tracking_code: "trace-local-2",
        response: { all_course: [null] },
        error: "private backend detail",
      },
    });
    let view = renderHomePage();
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(JSON.stringify(diagnostic.mock.calls)).not.toContain("private backend detail");

    view.unmount();
    axios.mockResolvedValue({
      data: {
        status: 200,
        tracking_code: "",
        response: { all_course: [] },
      },
    });
    view = renderHomePage();
    expect(await screen.findByRole("alert")).toBeInTheDocument();

    view.unmount();
    axios.mockResolvedValue(legacyResponse([legacyCourse({ course_id: "invalid" })]));
    renderHomePage();
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    diagnostic.mockRestore();
  });

  it("does not let a late response from an aborted effect overwrite newer data", async () => {
    const requests = [];
    axios.mockImplementation(
      (config) =>
        new Promise((resolve) => {
          requests.push({ config, resolve });
        })
    );
    renderHomePage(
      <StrictMode>
        <HomePage />
      </StrictMode>
    );

    await waitFor(() => expect(requests).toHaveLength(2));
    expect(requests[0].config.signal.aborted).toBe(true);
    await act(async () => {
      requests[1].resolve(legacyResponse([legacyCourse({ name: "نسخه جدید" })]));
    });
    expect(await screen.findByText("نسخه جدید")).toBeInTheDocument();

    await act(async () => {
      requests[0].resolve(legacyResponse([legacyCourse({ name: "نسخه قدیمی" })]));
    });
    expect(screen.getByText("نسخه جدید")).toBeInTheDocument();
    expect(screen.queryByText("نسخه قدیمی")).not.toBeInTheDocument();
  });

  it("aborts an outstanding request and ignores its response after unmount", async () => {
    let resolveRequest;
    let requestSignal;
    axios.mockImplementation((config) => {
      requestSignal = config.signal;
      return new Promise((resolve) => {
        resolveRequest = resolve;
      });
    });
    const diagnostic = vi.spyOn(console, "error").mockImplementation(() => {});
    const view = renderHomePage();

    view.unmount();
    expect(requestSignal.aborted).toBe(true);
    await act(async () => {
      resolveRequest(legacyResponse([legacyCourse()]));
    });
    expect(diagnostic).not.toHaveBeenCalled();
    diagnostic.mockRestore();
  });
});
