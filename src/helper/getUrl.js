export function getUrl() {
  let protocol = window.location.protocol;
  let hostName = window.location.hostname;

  if (!protocol || !hostName || hostName === "localhost") {
    // return "http://127.0.0.1:5000/";
    return "https://daarolquran.com/";
  }
  return `${protocol}//${hostName}/`;
}
export function getUrlWs() {
  let protocol = window.location.protocol;
  let hostName = window.location.hostname;

  if (!protocol || !hostName || hostName === "localhost") {
    return "wss://127.0.0.1:5000/";
  }
  return `wss://${hostName}/`;
}
