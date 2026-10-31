// Vite's dependency scanner uses esbuild before the legacy module transform hook.
export const legacyJsxEsbuildOptions = {
  loader: { ".js": "jsx" },
  jsx: "automatic",
};
