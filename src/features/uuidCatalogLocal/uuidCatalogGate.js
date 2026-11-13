/** Never expose the new UUID local preview in a production build. */
export function m5UuidCatalogEnabled({ dev, previewFlag, apiFlag }) {
  return dev === true && previewFlag === "true" && apiFlag === "true";
}
