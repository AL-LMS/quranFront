/** Flags must be explicitly true; production previews are never registered. */
export function catalogPreviewEnabled({ dev, flag }) {
  return dev === true && flag === "true";
}

export function localCatalogApiAllowed({ dev, routeFlag, apiFlag }) {
  return catalogPreviewEnabled({ dev, flag: routeFlag }) && apiFlag === "true";
}
