const localLegacyUrl = (path) => `/legacy${path.startsWith("/") ? path : `/${path}`}`;

export function legacyAssetUrl(path) {
  if (import.meta.env.VITE_LOCAL_DEVELOPMENT === "true") return localLegacyUrl(path);
  return `https://daarolquran.com${path}`;
}

export function apiAssetUrl(path) {
  if (import.meta.env.VITE_LOCAL_DEVELOPMENT === "true") return localLegacyUrl(path);
  return `https://api.srvschool.ir${path}`;
}
