import axios from "axios";

axios.defaults.baseURL = "https://api.srvschool.ir/";
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
