import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { transformWithEsbuild } from "vite";

const legacyJsxInJs = {
  name: "legacy-jsx-in-js",
  enforce: "pre",
  async transform(code, id) {
    if (id.includes("@persian-tools/persian-mobile-datepicker")) {
      code = code.replace(
        'from"rmc-picker/assets/index.css"',
        'from"rmc-picker/assets/index.css?inline"'
      );
    }
    if (!id.endsWith(".js")) return null;
    return transformWithEsbuild(code, id, { loader: "jsx" });
  },
};

const pickerCssAsText = {
  name: "picker-css-as-text",
  async resolveId(source, importer) {
    if (source !== "rmc-picker/assets/index.css") return null;
    // The picker package consumes this stylesheet as a string inside styled-components.
    // CRA's css-loader provided that default export; Vite exposes it with ?inline.
    return this.resolve(`${source}?inline`, importer, { skipSelf: true });
  },
};

export default defineConfig({
  // CRA allowed JSX in .js files throughout this application.
  plugins: [legacyJsxInJs, pickerCssAsText, react()],
  // Keep the deployment artifact directory compatible with the CRA hosting setup.
  build: { outDir: "build" },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/testSetup.js",
  },
});
