import { shamsi_format } from "./shamsi_format";

describe("shamsi_format", () => {
  test("formats the first three date parts with slashes", () => {
    expect(shamsi_format("1403-01-09")).toBe("1403/01/09");
  });

  test("preserves the existing behavior for additional date parts", () => {
    expect(shamsi_format("1403-01-09-extra")).toBe("1403/01/09");
  });

  test("preserves the existing behavior for incomplete input", () => {
    expect(shamsi_format("1403-01")).toBe("1403/01/undefined");
  });
});
