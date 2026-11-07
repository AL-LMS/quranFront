import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Navigation, Pagination } from "swiper/modules";
import RelatedCourse from "../course/RelatedCourse";

const swiperHarness = vi.hoisted(() => ({
  props: [],
}));

vi.mock("swiper/react", async () => {
  const ReactModule = await import("react");
  return {
    Swiper: ({ children, ...props }) => {
      swiperHarness.props.push(props);
      return ReactModule.createElement(
        "div",
        { "data-testid": "swiper-root", "data-rtl": String(props.rtl) },
        children,
      );
    },
    SwiperSlide: ({ children }) => ReactModule.createElement(
      "div",
      { role: "group", "aria-roledescription": "slide" },
      children,
    ),
  };
});

vi.mock("../course/CourseCard", async () => {
  const ReactModule = await import("react");
  return {
    default: () => ReactModule.createElement("span", null, "Related course placeholder"),
  };
});

beforeEach(() => {
  swiperHarness.props.length = 0;
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Swiper-backed course site components", () => {
  it("renders the six related-course slides with navigation and pagination modules", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<MemoryRouter><RelatedCourse /></MemoryRouter>);

    expect(screen.getAllByText("Related course placeholder")).toHaveLength(6);
    expect(swiperHarness.props).toHaveLength(1);
    expect(swiperHarness.props[0].modules).toContain(Navigation);
    expect(swiperHarness.props[0].modules).toContain(Pagination);
    expect(swiperHarness.props[0]).toMatchObject({
      slidesPerView: 4,
      spaceBetween: 40,
      navigation: true,
      autoplay: true,
      loop: true,
      rtl: "true",
      breakpoints: {
        360: { width: 350, slidesPerView: 1.3, spaceBetween: 20 },
        768: { width: 768, slidesPerView: 2 },
        990: { width: 990, slidesPerView: 4 },
      },
    });
    expect(consoleError).not.toHaveBeenCalled();
  });

});
