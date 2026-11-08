import { execFileSync } from "node:child_process";
import { isIP } from "node:net";

export const LOCAL_DEMO_AUTH_PREFIX = "/api/local-demo/auth/v1";
const PROJECT_NAME = /^[a-z0-9][a-z0-9_-]{0,62}$/;

export function isLocalDemoAuthEnabled(mode, flag) {
  return mode === "development" && flag === "true";
}

function isPrivateIPv4(address) {
  if (isIP(address) !== 4) return false;
  const [first, second] = address.split(".").map(Number);
  return (
    first === 10 ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168)
  );
}

function dockerJson(args, runDocker) {
  return JSON.parse(runDocker("docker", args, { encoding: "utf8" }));
}

/** Resolve the running project-owned API container rather than pinning a Docker IP. */
export function discoverLocalDemoAuthTarget(project, runDocker = execFileSync) {
  if (!PROJECT_NAME.test(project || "")) {
    throw new Error("Set AL_LMS_LOCAL_DEMO_COMPOSE_PROJECT to the local demo Compose project name.");
  }

  try {
    const output = runDocker(
      "docker",
      [
        "ps",
        "--filter",
        `label=com.docker.compose.project=${project}`,
        "--filter",
        "label=com.docker.compose.service=auth-api",
        "--format",
        "{{.ID}}",
      ],
      { encoding: "utf8" }
    );
    const ids = output.trim().split(/\s+/).filter(Boolean);
    if (ids.length !== 1) throw new Error("auth service count");

    const [container] = dockerJson(["inspect", ids[0]], runDocker);
    const labels = container.Config?.Labels || {};
    if (
      labels["com.docker.compose.project"] !== project ||
      labels["com.docker.compose.service"] !== "auth-api" ||
      container.State?.Status !== "running" ||
      container.State?.Health?.Status !== "healthy"
    ) {
      throw new Error("auth service identity");
    }

    const networkName = `${project}_internal`;
    const network = container.NetworkSettings?.Networks?.[networkName];
    if (!network?.IPAddress || isPrivateIPv4(network.IPAddress) !== true) {
      throw new Error("auth service network address");
    }
    const [networkInfo] = dockerJson(["network", "inspect", networkName], runDocker);
    if (
      networkInfo.Internal !== true ||
      networkInfo.Labels?.["com.docker.compose.project"] !== project
    ) {
      throw new Error("auth service network isolation");
    }

    return `http://${network.IPAddress}:8000`;
  } catch {
    throw new Error(
      "Could not verify one healthy local-demo auth API on its isolated Docker network. Check the Compose project and service."
    );
  }
}

/** The one-time inbox stays container-only and is never forwarded through Vite. */
export function localDemoInboxBlockerPlugin() {
  const inboxPath = `${LOCAL_DEMO_AUTH_PREFIX}/test-inbox`;
  return {
    name: "local-demo-test-inbox-browser-block",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        let pathname = "";
        try {
          pathname = new URL(request.url || "/", "http://vite.local").pathname;
          const candidates = [pathname];
          for (let count = 0; count < 2; count += 1) {
            const decoded = decodeURIComponent(candidates.at(-1));
            if (decoded === candidates.at(-1)) break;
            candidates.push(decoded);
          }
          if (
            candidates.some(
              (candidate) =>
                candidate === inboxPath || candidate.startsWith(`${inboxPath}/`)
            )
          ) {
            response.statusCode = 404;
            response.setHeader("Cache-Control", "no-store");
            response.end();
            return;
          }
        } catch {
          response.statusCode = 400;
          response.end();
          return;
        }
        next();
      });
    },
  };
}
