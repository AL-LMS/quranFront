/** Explicit, local-only prototype opt-in. No production route registration. */
export function enrollmentPreviewEnabled({ dev, catalogFlag, apiFlag, enrollmentFlag }) {
  return dev === true && catalogFlag === "true" &&
    apiFlag === "true" && enrollmentFlag === "true";
}

export function enrollmentPreviewEnabledForBuild() {
  return enrollmentPreviewEnabled({
    dev: import.meta.env.DEV,
    catalogFlag: import.meta.env.VITE_ENABLE_CATALOG_UI_PREVIEW,
    apiFlag: import.meta.env.VITE_ALLOW_CATALOG_LOCAL_API,
    enrollmentFlag: import.meta.env.VITE_ENABLE_ENROLLMENT_UI_PREVIEW,
  });
}
