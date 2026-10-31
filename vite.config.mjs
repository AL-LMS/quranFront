import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { loadEnv, transformWithEsbuild } from "vite";
import { fileURLToPath } from "node:url";
import { legacyJsxEsbuildOptions } from "./vite-legacy-jsx-options.mjs";

const sourceDirectory = fileURLToPath(new URL("./src/", import.meta.url));
const localProxyEnv = loadEnv("development", process.cwd(), "VITE_");

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

export default defineConfig({
  // CRA allowed JSX in .js files throughout this application.
  plugins: [legacyJsxInJs, react()],
  optimizeDeps: { esbuildOptions: legacyJsxEsbuildOptions },
  server: {
    host: process.env.VITE_SERVER_HOST || "localhost",
    proxy: {
      "/legacy": {
        target: process.env.VITE_LEGACY_API_TARGET || localProxyEnv.VITE_LEGACY_API_TARGET || "http://legacy-api:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/legacy/, ""),
        ws: true,
      },
      "/api": {
        target: process.env.VITE_V2_API_TARGET || localProxyEnv.VITE_V2_API_TARGET || "http://v2-api:8000",
        changeOrigin: true,
      },
    },
  },
  // Keep the deployment artifact directory compatible with the CRA hosting setup.
  build: { outDir: "build" },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/testSetup.js",
  },
});
