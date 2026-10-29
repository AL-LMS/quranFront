const DASHBOARD_ROLES = ["student", "teacher"];

/** Matches the role check historically used by the private route boundary. */
export function hasDashboardAccess(user) {
  return DASHBOARD_ROLES.includes(user?.role);
}
