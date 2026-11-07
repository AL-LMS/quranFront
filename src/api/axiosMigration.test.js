import axios from "axios";
import { vi } from "vitest";
import "./axios";

const productionBaseUrl = "https://api.srvschool.ir/";
const baseUrl = import.meta.env.VITE_API_BASE_URL || productionBaseUrl;

const successfulAdapter = async (config) => ({
  data: { ok: true },
  status: 200,
  statusText: "OK",
  headers: {},
  config,
  request: {},
});

describe("shared Axios 1.x compatibility", () => {
  let originalAdapter;

  beforeAll(() => {
    originalAdapter = axios.defaults.adapter;
  });

  beforeEach(() => {
    axios.defaults.adapter = successfulAdapter;
    axios.defaults.baseURL = baseUrl;
  });

  afterEach(() => {
    axios.defaults.adapter = originalAdapter;
    axios.defaults.baseURL = baseUrl;
    vi.unstubAllGlobals();
  });

  it("keeps shared defaults and the configured production/local base URL", () => {
    expect(axios.defaults.baseURL).toBe(baseUrl);
    expect(axios.getUri({ url: "courses/" })).toBe(`${baseUrl}courses/`);
  });

  it("routes relative API paths through a local /api base URL", async () => {
    axios.defaults.baseURL = "/api/";
    let requestConfig;
    axios.defaults.adapter = async (config) => {
      requestConfig = config;
      return successfulAdapter(config);
    };

    await axios.get("catalog/courses");

    expect(requestConfig.baseURL).toBe("/api/");
    expect(axios.getUri(requestConfig)).toBe("/api/catalog/courses");
  });

  it("preserves absolute legacy API URLs", async () => {
    let requestConfig;
    axios.defaults.adapter = async (config) => {
      requestConfig = config;
      return successfulAdapter(config);
    };
    const legacyUrl = "https://daarolquran.com/back_request/select_request/";

    await axios.get(legacyUrl);

    expect(axios.getUri(requestConfig)).toBe(legacyUrl);
  });

  it("serializes ordinary GET query parameters", async () => {
    let requestConfig;
    axios.defaults.adapter = async (config) => {
      requestConfig = config;
      return successfulAdapter(config);
    };

    await axios.get("courses/", { params: { page: 2, category: "synthetic" } });

    expect(axios.getUri(requestConfig)).toBe(
      `${baseUrl}courses/?page=2&category=synthetic`
    );
  });

  it("serializes JSON POST bodies and preserves bearer headers", async () => {
    let requestConfig;
    axios.defaults.adapter = async (config) => {
      requestConfig = config;
      return successfulAdapter(config);
    };

    await axios.post("requests/", { name: "Synthetic" }, {
      headers: { Authorization: "Bearer synthetic-test-token" },
    });

    expect(requestConfig.data).toBe('{"name":"Synthetic"}');
    expect(requestConfig.headers.get("Content-Type")).toContain("application/json");
    expect(requestConfig.headers.get("Authorization")).toBe(
      "Bearer synthetic-test-token"
    );
  });

  it("preserves axios(config) requests and JSON response parsing", async () => {
    let requestConfig;
    axios.defaults.adapter = async (config) => {
      requestConfig = config;
      return {
        data: '{"accepted":true}',
        status: 200,
        statusText: "OK",
        headers: { "content-type": "application/json" },
        config,
        request: {},
      };
    };

    const response = await axios({
      method: "put",
      url: "https://daarolquran.com/back_request/update_request/",
      data: { description: "synthetic" },
    });

    expect(requestConfig.method).toBe("put");
    expect(requestConfig.data).toBe('{"description":"synthetic"}');
    expect(response.data).toEqual({ accepted: true });
  });

  it("continues to reject 403 responses without invoking the 401 policy", async () => {
    const clear = vi.fn();
    const reload = vi.fn();
    vi.stubGlobal("localStorage", { clear });
    vi.stubGlobal("window", { location: { reload } });
    axios.defaults.adapter = async (config) => Promise.reject(Object.assign(
      new Error("forbidden"),
      { config, response: { status: 403, config, data: { detail: "forbidden" } } }
    ));

    await expect(axios.get("private/"))
      .rejects.toMatchObject({ response: { status: 403 } });

    expect(clear).not.toHaveBeenCalled();
    expect(reload).not.toHaveBeenCalled();
  });

  it("keeps the existing 401 clear-and-reload behavior", async () => {
    const clear = vi.fn();
    const reload = vi.fn();
    vi.stubGlobal("localStorage", { clear });
    vi.stubGlobal("window", { location: { reload } });
    axios.defaults.adapter = async (config) => Promise.reject(Object.assign(
      new Error("unauthorized"),
      { config, response: { status: 401, config, data: { detail: "unauthorized" } } }
    ));

    await expect(axios.get("private/"))
      .rejects.toMatchObject({ response: { status: 401 } });

    expect(clear).toHaveBeenCalledWith("authTokens");
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("preserves network errors that do not contain an HTTP response", async () => {
    const networkError = Object.assign(new Error("network unavailable"), {
      code: "ERR_NETWORK",
    });
    axios.defaults.adapter = async () => Promise.reject(networkError);

    await expect(axios.get("offline/")).rejects.toBe(networkError);
  });

  it("passes browser FormData and upload progress callbacks through unchanged", async () => {
    let requestConfig;
    const onUploadProgress = vi.fn();
    axios.defaults.adapter = async (config) => {
      requestConfig = config;
      return successfulAdapter(config);
    };
    const form = new FormData();
    form.append("description", "synthetic upload");

    await axios.post("uploads/", form, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    });

    expect(requestConfig.data).toBe(form);
    expect(requestConfig.onUploadProgress).toBe(onUploadProgress);
  });
});
