import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import CourseRequestFeedback from "./CourseRequestFeedback";

describe("homepage course request feedback", () => {
  it("announces loading accessibly", () => {
    render(<CourseRequestFeedback state="loading" />);
    expect(screen.getByRole("status")).toHaveTextContent("در حال دریافت دوره‌ها");
  });

  it("distinguishes a successful empty catalog from a failed request", () => {
    render(<CourseRequestFeedback state="empty" />);
    expect(screen.getByRole("status")).toHaveTextContent("در حال حاضر دوره‌ای");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("exposes an accessible retry action for a failed request", () => {
    const onRetry = vi.fn();
    render(<CourseRequestFeedback state="error" onRetry={onRetry} />);
    expect(screen.getByRole("alert")).toHaveTextContent("دریافت دوره‌ها با خطا");
    fireEvent.click(screen.getByRole("button", { name: "تلاش دوباره" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
