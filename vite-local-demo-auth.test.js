import { describe, expect, it, vi } from "vitest";
import {
  discoverLocalDemoAuthTarget,
  isLocalDemoAuthEnabled,
  localDemoInboxBlockerPlugin,
} from "./vite-local-demo-auth.mjs";

function dockerFixture({ ip = "172.23.0.4", internal = true, project = "demo-auth" } = {}) {
  const runDocker = vi.fn((_binary, args) => {
    if (args[0] === "ps") return "container-123\n";
    if (args[0] === "inspect") {
      return JSON.stringify([
        {
          Config: {
            Labels: {
              "com.docker.compose.project": project,
              "com.docker.compose.service": "auth-api",
            },
          },
          State: { Status: "running", Health: { Status: "healthy" } },
          NetworkSettings: {
            Networks: { [`${project}_internal`]: { IPAddress: ip } },
          },
        },
      ]);
    }
    if (args[0] === "network" && args[1] === "inspect") {
      return JSON.stringify([
        {
          Internal: internal,
          Labels: { "com.docker.compose.project": project },
        },
      ]);
    }
    throw new Error("unexpected docker call");
  });
  return runDocker;
}

describe("local-demo Vite isolation", () => {
  it("enables only in development with the explicit flag", () => {
    expect(isLocalDemoAuthEnabled("development", "true")).toBe(true);
    expect(isLocalDemoAuthEnabled("development", "false")).toBe(false);
    expect(isLocalDemoAuthEnabled("production", "true")).toBe(false);
    expect(isLocalDemoAuthEnabled("test", "true")).toBe(false);
  });

  it("discovers the current healthy API container IP dynamically", () => {
    const runDocker = dockerFixture({ ip: "172.23.0.9" });
    expect(discoverLocalDemoAuthTarget("demo-auth", runDocker)).toBe(
      "http://172.23.0.9:8000"
    );
    expect(runDocker).toHaveBeenCalledWith(
      "docker",
      expect.arrayContaining(["label=com.docker.compose.service=auth-api"]),
      expect.any(Object)
    );
  });

  it("fails closed for a non-internal Docker network", () => {
    expect(() =>
      discoverLocalDemoAuthTarget("demo-auth", dockerFixture({ internal: false }))
    ).toThrow(/isolated Docker network/);
  });

  it("fails closed for a public or invalid service address", () => {
    expect(() =>
      discoverLocalDemoAuthTarget("demo-auth", dockerFixture({ ip: "8.8.8.8" }))
    ).toThrow(/isolated Docker network/);
  });

  it.each([
    "/api/local-demo/auth/v1/test-inbox/a-challenge",
    "/api/local-demo/auth/v1/test-inbox%2Fa-challenge",
    "/api/local-demo/auth/v1/%74est-inbox/a-challenge",
  ])("returns 404 for browser requests to the test inbox: %s", (url) => {
    let middleware;
    localDemoInboxBlockerPlugin().configureServer({
      middlewares: { use: (handler) => { middleware = handler; } },
    });
    const response = {
      headers: {},
      setHeader(name, value) { this.headers[name] = value; },
      end() { this.ended = true; },
    };
    const next = vi.fn();
    middleware({ url }, response, next);
    expect(response.statusCode).toBe(404);
    expect(response.headers["Cache-Control"]).toBe("no-store");
    expect(response.ended).toBe(true);
    expect(next).not.toHaveBeenCalled();
  });

  it("does not block normal authentication API calls", () => {
    let middleware;
    localDemoInboxBlockerPlugin().configureServer({
      middlewares: { use: (handler) => { middleware = handler; } },
    });
    const response = { setHeader: vi.fn(), end: vi.fn() };
    const next = vi.fn();
    middleware({ url: "/api/local-demo/auth/v1/login" }, response, next);
    expect(next).toHaveBeenCalledOnce();
  });
});
