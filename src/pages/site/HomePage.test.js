import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import { vi } from "vitest";
import HomePage from "./HomePage";

vi.mock("axios", () => ({ default: vi.fn() }));

const renderHomePage = () =>
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );

describe("homepage course request states", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("announces loading while the course request is pending", () => {
    axios.mockReturnValue(new Promise(() => {}));
    renderHomePage();
    expect(screen.getByRole("status")).toHaveTextContent("در حال دریافت دوره‌ها");
  });

  it("shows an accessible retry state and sanitized backend diagnostics on failure", async () => {
    const error = Object.assign(new Error("Request failed"), {
      response: {
        status: 503,
        headers: { "x-request-id": "req-local-4" },
        data: { detail: "sensitive SQL or credentials must not be logged" },
      },
    });
    axios.mockRejectedValue(error);
    const diagnostic = vi.spyOn(console, "error").mockImplementation(() => {});
    const unhandledRejection = vi.fn();
    window.addEventListener("unhandledrejection", unhandledRejection);

    renderHomePage();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "دریافت دوره‌ها با خطا مواجه شد"
    );
    expect(diagnostic).toHaveBeenCalledWith("Homepage course request failed", {
      endpoint: "/legacy/back_request/select_request/",
      category: "http",
      status: 503,
      requestId: "req-local-4",
    });
    expect(JSON.stringify(diagnostic.mock.calls)).not.toContain("sensitive SQL");

    fireEvent.click(screen.getByRole("button", { name: "تلاش دوباره" }));
    await waitFor(() => expect(axios).toHaveBeenCalledTimes(2));
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(unhandledRejection).not.toHaveBeenCalled();

    window.removeEventListener("unhandledrejection", unhandledRejection);
    diagnostic.mockRestore();
  });
});
