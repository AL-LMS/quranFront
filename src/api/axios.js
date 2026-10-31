import axios from "axios";

// Vite's local Compose profile proxies `/api` to the V2 FastAPI container.
// The production fallback remains unchanged when no local override is set.
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "https://api.srvschool.ir/";
let refresh = false;

axios.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response.status === 401 && !refresh) {
      refresh = true;
      localStorage.clear("authTokens");
      window.location.reload();
    }
    refresh = false;
    return Promise.reject(error);
  }
);
