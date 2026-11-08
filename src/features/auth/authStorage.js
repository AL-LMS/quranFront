// These keys hold the current login or an in-progress OTP verification.
// Other local-storage entries (for example quiz progress and dashboard tabs)
// belong to application features and must survive authentication cleanup.
export const AUTH_STORAGE_KEYS = ["token", "user", "role", "phone"];

export function clearAuthStorage() {
  AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
}
