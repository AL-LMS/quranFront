import { hasDashboardAccess } from "./hasDashboardAccess";

describe("hasDashboardAccess", () => {
  test.each(["student", "teacher"])("allows the %s role", (role) => {
    expect(hasDashboardAccess({ role })).toBe(true);
  });

  test.each([undefined, null, {}, { role: "admin" }, { role: "Student" }])(
    "denies users without a supported role: %s",
    (user) => {
      expect(hasDashboardAccess(user)).toBe(false);
    }
  );
});
