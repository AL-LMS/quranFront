export function getUrl() {
  if (import.meta.env.VITE_LEGACY_API_BASE_URL) {
    return `${import.meta.env.VITE_LEGACY_API_BASE_URL.replace(/\/$/, "")}/`;
  }
  let protocol = window.location.protocol;
  let hostName = window.location.hostname;

  if (!protocol || !hostName || hostName === "localhost") {
    // return "http://127.0.0.1:5000/";
    return "https://daarolquran.com/";
  }
  return `${protocol}//${hostName}/`;
}
export function getUrlWs() {
  if (import.meta.env.VITE_LEGACY_WS_BASE_URL) {
    return `${import.meta.env.VITE_LEGACY_WS_BASE_URL.replace(/\/$/, "")}/`;
  }
  let protocol = window.location.protocol;
  let hostName = window.location.hostname;

  if (!protocol || !hostName || hostName === "localhost") {
    return "wss://127.0.0.1:5000/";
  }
  return `wss://${hostName}/`;
}
