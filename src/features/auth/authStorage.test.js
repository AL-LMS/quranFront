import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AUTH_STORAGE_KEYS, clearAuthStorage } from "./authStorage";

describe("authentication storage cleanup", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it("removes login and pending OTP keys while preserving feature data", () => {
    AUTH_STORAGE_KEYS.forEach((key) => localStorage.setItem(key, `synthetic-${key}`));
    localStorage.setItem("time", "120");
    localStorage.setItem("dnq", "synthetic-date");
    localStorage.setItem("dtab", "2");

    clearAuthStorage();

    AUTH_STORAGE_KEYS.forEach((key) => expect(localStorage.getItem(key)).toBeNull());
    expect(localStorage.getItem("time")).toBe("120");
    expect(localStorage.getItem("dnq")).toBe("synthetic-date");
    expect(localStorage.getItem("dtab")).toBe("2");
  });
});
