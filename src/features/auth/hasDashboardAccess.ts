const DASHBOARD_ROLES: readonly string[] = ["student", "teacher"];

type DashboardUser = { role?: string } | null | undefined;

/** Matches the role check historically used by the private route boundary. */
export function hasDashboardAccess(user: DashboardUser): boolean {
  return DASHBOARD_ROLES.includes(user?.role ?? "");
}
