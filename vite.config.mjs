import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { loadEnv, transformWithEsbuild } from "vite";
import { fileURLToPath } from "node:url";
import { legacyJsxEsbuildOptions } from "./vite-legacy-jsx-options.mjs";
import { m5TeacherPreviewProxyTarget } from "./vite-m5-teacher-preview.mjs";
import { LOCAL_UUID_PREFIX, m5UuidCatalogTarget, rewriteM5UuidCatalogPath } from "./vite-m5-uuid-catalog.mjs";
import { M6_LOCAL_PREFIX, m6ManagementTarget, rewriteM6ManagementPath } from "./vite-m6-management.mjs";
import {
  discoverLocalDemoAuthTarget,
  LOCAL_DEMO_AUTH_PREFIX,
  isLocalDemoAuthEnabled,
  localDemoInboxBlockerPlugin,
} from "./vite-local-demo-auth.mjs";

const sourceDirectory = fileURLToPath(new URL("./src/", import.meta.url));

const legacyJsxInJs = {
  name: "legacy-jsx-in-js",
  enforce: "pre",
  async transform(code, id) {
    if (id.includes("@persian-tools/persian-mobile-datepicker")) {
      const compatibleCode = code.replace(
        /from(["'])rmc-picker\/assets\/index\.css\1/,
        (_match, quote) => `from${quote}rmc-picker/assets/index.css?inline${quote}`
      );
      if (compatibleCode !== code) return { code: compatibleCode, map: null };
    }
    const sourceId = id.split("?")[0];
    if (!sourceId.startsWith(sourceDirectory) || !sourceId.endsWith(".js")) {
      return null;
    }
    // CRA used the automatic JSX runtime; match it for files without React imports.
    return transformWithEsbuild(code, id, { loader: "jsx", jsx: "automatic" });
  },
};

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), ["VITE_", "AL_LMS_LOCAL_DEMO_COMPOSE_PROJECT"]);
  const m5DemoTarget = m5TeacherPreviewProxyTarget({ command, mode, env });
  const m5UuidTarget = m5UuidCatalogTarget({ command, mode, env });
  const m6Target = m6ManagementTarget({ command, mode, env });
  const localDemoAuthEnabled = isLocalDemoAuthEnabled(
    mode,
    env.VITE_ENABLE_LOCAL_DEMO_AUTH
  );
  const localDemoAuthTarget = localDemoAuthEnabled
    ? discoverLocalDemoAuthTarget(env.AL_LMS_LOCAL_DEMO_COMPOSE_PROJECT)
    : null;

  const proxy = {
    ...(m6Target ? {
      [M6_LOCAL_PREFIX]: {
        target: m6Target,
        changeOrigin: false,
        rewrite: rewriteM6ManagementPath,
      },
    } : {}),
    ...(m5UuidTarget ? {
      [LOCAL_UUID_PREFIX]: {
        target: m5UuidTarget,
        changeOrigin: false,
        rewrite: rewriteM5UuidCatalogPath,
      },
    } : {}),
    ...(m5DemoTarget ? {
      "/__demo/m5-02": { target: m5DemoTarget, changeOrigin: false },
    } : {}),
    ...(localDemoAuthEnabled
      ? {
          [LOCAL_DEMO_AUTH_PREFIX]: {
            target: localDemoAuthTarget,
            changeOrigin: false,
          },
        }
      : {}),
    "/legacy": {
      target:
        process.env.VITE_LEGACY_API_TARGET ||
        env.VITE_LEGACY_API_TARGET ||
        "http://legacy-api:8000",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/legacy/, ""),
      ws: true,
    },
    "/api": {
      target:
        process.env.VITE_V2_API_TARGET ||
        env.VITE_V2_API_TARGET ||
        "http://v2-api:8000",
      changeOrigin: true,
    },
  };

  return {
    // CRA allowed JSX in .js files throughout this application.
    plugins: [
      legacyJsxInJs,
      react(),
      ...(localDemoAuthEnabled ? [localDemoInboxBlockerPlugin()] : []),
    ],
    optimizeDeps: { esbuildOptions: legacyJsxEsbuildOptions },
    server: {
      host: localDemoAuthEnabled || m5DemoTarget || m5UuidTarget || m6Target
        ? "127.0.0.1"
        : process.env.VITE_SERVER_HOST || "localhost",
      ...(localDemoAuthEnabled ? { port: 15173, strictPort: true } : {}),
      proxy,
    },
    // Keep the deployment artifact directory compatible with the CRA hosting setup.
    build: { outDir: "build" },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/testSetup.js",
    },
  };
});
