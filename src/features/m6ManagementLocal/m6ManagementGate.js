/** Independent M6 course-management UI is NEVER enabled in production. */
export function m6ManagementPreviewEnabled({ dev, previewFlag, apiFlag }) {
  return dev === true && previewFlag === "true" && apiFlag === "true";
}
