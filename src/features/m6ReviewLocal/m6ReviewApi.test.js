import { afterEach, describe, expect, it, vi } from "vitest";
import {
  approveReviewRequest, listReviewRequests, readReviewPage, readReviewRequest,
  revokePublication, submitPublicationRequest,
} from "./m6ReviewApi";
import {
  M6_REVIEW_PREFIX, m6ManagementTarget, rewriteM6ReviewPath,
} from "../../../vite-m6-management.mjs";

const MANAGER = "m6-test-manager-token-abcdefghijklmnopqrstuvwxyz";
const REVIEWER = "m6-test-reviewer-token-abcdefghijklmnopqrstuvwxyz";
const COURSE_ID = "00000000-0000-0000-0000-00000000a001";
const REQUEST_ID = "00000000-0000-0000-0000-00000000d001";
const REQUEST = {
  id: REQUEST_ID, course_id: COURSE_ID, course_version: 1,
  title: "آموزش قرآن", status: "submitted",
};
const PUBLISHED = { id: COURSE_ID, title: REQUEST.title, status: "published", version: 2 };

function reply(body, status = 200, scope = "synthetic-only") {
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: { get: (key) => key === "X-AL-LMS-Data-Scope" ? scope : null },
    json: async () => body,
  };
}
afterEach(() => { vi.unstubAllGlobals(); });

describe("M6 local independent review API", () => {
  it("proxy only rewrites the explicit reviewer prefix to the same loopback backend", () => {
    const env = {
      VITE_ENABLE_M6_MANAGEMENT_PREVIEW: "true",
      VITE_ALLOW_M6_LOCAL_API: "true",
      VITE_M6_MANAGEMENT_TARGET: "http://127.0.0.1:8004",
    };
    expect(m6ManagementTarget({ command: "serve", mode: "development", env }))
      .toBe("http://127.0.0.1:8004");
    expect(m6ManagementTarget({ command: "build", mode: "development", env })).toBeNull();
    expect(M6_REVIEW_PREFIX).toBe("/__demo/m6-review");
    expect(rewriteM6ReviewPath(
      "/__demo/m6-review/requests/" + REQUEST_ID + "/approve"
    )).toBe("/api/v2/local-course-review/requests/" + REQUEST_ID + "/approve");
    for (const bad of ["/__demo/m6-management", "/__demo/m6-reviewevil", "/api/v2/real-courses"]) {
      expect(() => rewriteM6ReviewPath(bad)).toThrow();
    }
  });

  it("strict request and list DTOs omit all private authority fields", () => {
    expect(readReviewRequest(REQUEST)).toEqual(REQUEST);
    expect(readReviewPage({ items: [REQUEST], limit: 20, offset: 0 }, {
      limit: 20, offset: 0,
    }).items).toEqual([REQUEST]);
    for (const bad of [
      { ...REQUEST, reviewer_account_id: COURSE_ID },
      { ...REQUEST, institution_id: COURSE_ID },
      { ...REQUEST, course_version: 0 },
      { ...REQUEST, course_version: "1" },
      { ...REQUEST, status: "published" },
      { ...REQUEST, id: "91001" },
      { ...REQUEST, title: " " },
    ]) expect(() => readReviewRequest(bad)).toThrow();
    expect(() => readReviewPage({
      items: [REQUEST, REQUEST], limit: 20, offset: 0,
    }, { limit: 20, offset: 0 })).toThrow();
  });

  it("uses separate request and reviewer headers, never cookies or URL tokens", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(reply(REQUEST, 201))
      .mockResolvedValueOnce(reply({ items: [REQUEST], limit: 20, offset: 0 }))
      .mockResolvedValueOnce(reply(PUBLISHED))
      .mockResolvedValueOnce(reply({ ...PUBLISHED, status: "draft", version: 3 }));
    vi.stubGlobal("fetch", fetcher);

    expect(await submitPublicationRequest({
      token: MANAGER, courseId: COURSE_ID, expectedVersion: 1,
    })).toEqual(REQUEST);
    expect((await listReviewRequests({ token: REVIEWER })).items).toEqual([REQUEST]);
    expect(await approveReviewRequest({
      token: REVIEWER, requestId: REQUEST_ID, expectedVersion: 1,
    })).toEqual(PUBLISHED);
    expect((await revokePublication({
      token: REVIEWER, courseId: COURSE_ID, expectedVersion: 2,
    })).version).toBe(3);

    const calls = fetcher.mock.calls;
    expect(calls[0][0]).toBe("/__demo/m6-review/courses/" + COURSE_ID + "/requests");
    expect(calls[1][0]).toBe("/__demo/m6-review/requests?limit=20&offset=0");
    expect(calls[2][0]).toBe("/__demo/m6-review/requests/" + REQUEST_ID + "/approve");
    expect(calls[3][0]).toBe("/__demo/m6-review/courses/" + COURSE_ID + "/revoke");
    expect(JSON.parse(calls[0][1].body)).toEqual({ expected_version: 1 });
    expect(JSON.parse(calls[2][1].body)).toEqual({ expected_version: 1 });
    expect(JSON.parse(calls[3][1].body)).toEqual({ expected_version: 2 });

    expect(calls[0][1].headers["X-AL-LMS-Local-Admin-Token"]).toBe(MANAGER);
    expect(calls[0][1].headers["X-AL-LMS-Local-Reviewer-Token"]).toBeUndefined();
    for (const call of calls.slice(1)) {
      expect(call[1].headers["X-AL-LMS-Local-Reviewer-Token"]).toBe(REVIEWER);
      expect(call[1].headers["X-AL-LMS-Local-Admin-Token"]).toBeUndefined();
    }
    expect(calls.every(([url, options]) =>
      !url.includes(MANAGER) && !url.includes(REVIEWER) &&
      options.credentials === "omit" && options.cache === "no-store" &&
      options.redirect === "error"
    )).toBe(true);
  });

  it("rejects unsafe payloads before fetch", async () => {
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    await expect(submitPublicationRequest({
      token: MANAGER, courseId: "91001", expectedVersion: 1,
    })).rejects.toThrow();
    await expect(approveReviewRequest({
      token: REVIEWER, requestId: REQUEST_ID, expectedVersion: "1",
    })).rejects.toThrow();
    await expect(revokePublication({
      token: "invalid", courseId: COURSE_ID, expectedVersion: 2,
    })).rejects.toThrow();
    await expect(listReviewRequests({ token: REVIEWER, limit: 101 })).rejects.toThrow();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("maps backend errors safely without returning secrets", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(reply({ detail: "internal private token" }, 403, null))
      .mockResolvedValueOnce(reply({ detail: "internal private version" }, 409, null))
      .mockResolvedValueOnce(reply({ detail: "internal private UUID" }, 404, null))
      .mockResolvedValueOnce(reply({ detail: "internal private DB" }, 503, null))
      .mockResolvedValueOnce(reply({ items: [REQUEST], limit: 20, offset: 0 }, 200, null));
    vi.stubGlobal("fetch", fetcher);
    for (const status of [403, 409, 404, 503]) {
      const error = await listReviewRequests({ token: REVIEWER }).catch((cause) => cause);
      expect(error.status).toBe(status);
      expect(error.message).not.toContain("private");
    }
    await expect(listReviewRequests({ token: REVIEWER })).rejects.toThrow("منبع داده");
  });
});
