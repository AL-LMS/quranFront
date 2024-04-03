export function getUrl() {
  let protocol = window.location.protocol;
  let hostName = window.location.hostname;

  if (!protocol || !hostName || hostName === "localhost") {
    return "http://127.0.01:5000/";
  }
  return `${protocol}//${hostName}/`;
}
export function getUrlWs() {
  let protocol = window.location.protocol;
  let hostName = window.location.hostname;

  if (!protocol || !hostName || hostName === "localhost") {
    return "ws://127.0.01:5000/";
  }
  return `ws://${hostName}/`;
}
