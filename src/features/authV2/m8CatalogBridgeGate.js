/** M8-CATALOG-01: require every independent local-only preview opt-in. */
export function m8CatalogBridgeEnabled({ dev, authPreview, catalogPreview, allowCatalogApi, bridgeFlag }) {
  return dev === true &&
    authPreview === "true" &&
    catalogPreview === "true" &&
    allowCatalogApi === "true" &&
    bridgeFlag === "true";
}
