import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const legacyPickerCssAsText = {
  name: "legacy-picker-css-as-text",
  setup(build) {
    build.onResolve(
      { filter: /^rmc-picker\/assets\/index\.css$/ },
      () => ({
        path: require.resolve("rmc-picker/assets/index.css"),
        namespace: "legacy-picker-css-as-text",
      })
    );

    build.onLoad(
      { filter: /.*/, namespace: "legacy-picker-css-as-text" },
      ({ path }) => ({
        contents: `export default ${JSON.stringify(readFileSync(path, "utf8"))};`,
        loader: "js",
      })
    );
  },
};

// Vite's dependency scanner uses esbuild before the legacy module transform hook.
export const legacyJsxEsbuildOptions = {
  loader: { ".js": "jsx" },
  jsx: "automatic",
  plugins: [legacyPickerCssAsText],
};
