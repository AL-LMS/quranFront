import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import sanitizeHtml from "sanitize-html";
import CourseDescrption from "./CourseDescrption";
import CourseTeacherInfo from "./CourseTeacherInfo";

afterEach(cleanup);

describe("course description HTML sanitization", () => {
  it("preserves safe Persian paragraphs, formatting, and HTTPS links", () => {
    const safeHtml =
      '<p dir="rtl">سلام <strong>دوره</strong> و <em>آموزش</em> ' +
      '<a href="https://example.test/course">جزئیات</a></p>';

    const sanitized = sanitizeHtml(safeHtml);
    expect(sanitized).toContain("<p>سلام <strong>دوره</strong> و <em>آموزش</em>");
    expect(sanitized).toContain('<a href="https://example.test/course">جزئیات</a>');
    render(<div dangerouslySetInnerHTML={{ __html: sanitized }} />);
    expect(screen.getByText("دوره")).toBeTruthy();
    expect(screen.getByText("آموزش")).toBeTruthy();
    expect(screen.getByText("جزئیات")).toBeTruthy();
  });

  it("removes scripts and event handlers and rejects javascript URLs", () => {
    const input =
      '<script>alert("script")</script><p onclick="alert(1)">متن</p>' +
      '<img src="x" onerror="alert(2)"><a href="javascript:alert(3)">پیوند</a>';
    const sanitized = sanitizeHtml(input);
    render(<div dangerouslySetInnerHTML={{ __html: sanitized }} />);

    expect(sanitized).not.toMatch(/<script\b|\bonerror\s*=|\bonclick\s*=/i);
    expect(sanitized).toContain("<a>پیوند</a>");
    expect(sanitized).not.toContain(["java", "script:"].join(""));
    expect(screen.queryByText(/alert/)).toBeNull();
  });

  it("rejects iframe, SVG, and meta-refresh payloads", () => {
    const input =
      '<iframe src="https://attacker.example"><script>alert(1)</script></iframe>' +
      '<svg onload="alert(2)"><script>alert(3)</script><text>svg</text></svg>' +
      '<meta http-equiv="refresh" content="0;url=javascript:alert(4)"><p>امن</p>';
    const sanitized = sanitizeHtml(input);
    render(<div dangerouslySetInnerHTML={{ __html: sanitized }} />);

    expect(sanitized).not.toMatch(/<(?:iframe|svg|meta|script)\b|\bonload\s*=|http-equiv/i);
    expect(sanitized).toContain("<p>امن</p>");
    expect(screen.getByText("امن")).toBeTruthy();
    expect(screen.queryByText(/alert/)).toBeNull();
  });

  it("handles malformed HTML and unexpected nested tags without exposing markup", () => {
    const input =
      '<p><strong>سلام</p><custom><em>جهان</em></custom>' +
      '<textarea><img src=x onerror=alert(1)></textarea>';
    const sanitized = sanitizeHtml(input);
    render(<div dangerouslySetInnerHTML={{ __html: sanitized }} />);

    expect(sanitized).toContain("<p><strong>سلام</strong></p>");
    expect(sanitized).toContain("<em>جهان</em>");
    expect(sanitized).not.toMatch(/<(?:custom|textarea|img)\b|\bonerror\s*=/i);
    expect(screen.getByText("سلام")).toBeTruthy();
    expect(screen.getByText("جهان")).toBeTruthy();
  });

  it("renders safe course and teacher descriptions and removes dangerous markup", () => {
    const safeCourse = "<p>توضیح <strong>ایمن</strong></p>";
    const safeTeacher = '<p>استاد <em>آزمایشی</em></p>';
    const { container, rerender } = render(
      <CourseDescrption data={{ explain: `${safeCourse}<img src=x onerror=alert(1)>` }} />,
    );

    expect(screen.getByText("توضیحات دوره")).toBeTruthy();
    expect(screen.getByText("ایمن")).toBeTruthy();
    expect(screen.queryByText(/alert/)).toBeNull();
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access -- Assert sanitized HTML in the actual course-description DOM.
    expect(container.innerHTML).not.toMatch(/<img\b|\bonerror\s*=|alert\(/i);

    rerender(
      <CourseTeacherInfo
        data={{
          teacher_name: "مدرس آزمایشی",
          teacher_description: `${safeTeacher}<svg onload=alert(2)>مخرب</svg>`,
          teacher_pic: null,
        }}
      />,
    );

    expect(screen.getByText("اطلاعات مربی")).toBeTruthy();
    expect(screen.getByText("مدرس آزمایشی")).toBeTruthy();
    expect(screen.getByText("آزمایشی")).toBeTruthy();
    expect(screen.queryByText(/alert/)).toBeNull();
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access -- Assert sanitized HTML in the actual teacher-description DOM.
    expect(container.innerHTML).not.toMatch(/<svg\b|\bonload\s*=|alert\(/i);
  });
});
