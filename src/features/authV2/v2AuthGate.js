/** Hard development gate: production and CI release builds cannot expose V2 preview routes. */
export function v2AuthPreviewEnabled({ dev, enabled }) {
  return dev === true && enabled === "true";
}
