import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { transformWithEsbuild } from "vite";
import { fileURLToPath } from "node:url";

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

export default defineConfig({
  // CRA allowed JSX in .js files throughout this application.
  plugins: [legacyJsxInJs, react()],
  // Keep the deployment artifact directory compatible with the CRA hosting setup.
  build: { outDir: "build" },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/testSetup.js",
  },
});
