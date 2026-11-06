/** Decorative category themes only. No data or visibility decisions are made here. */
const themes = {
  "قرآن": {
    accent: "#5145ad",
    ink: "#332d7e",
    soft: "#eeedff",
    gradient: "linear-gradient(125deg, #edeaff 0%, #f8f5ff 54%, #e4e0ff 100%)",
    glyph: "ق",
  },
  "تجوید": {
    accent: "#087d83",
    ink: "#075c67",
    soft: "#e6f8f6",
    gradient: "linear-gradient(125deg, #e2f7f3 0%, #f2fffa 58%, #d3f0ee 100%)",
    glyph: "ت",
  },
  "مفاهیم": {
    accent: "#a56724",
    ink: "#82501b",
    soft: "#fff5e7",
    gradient: "linear-gradient(125deg, #fff1dd 0%, #fffaf1 58%, #fbe8ca 100%)",
    glyph: "م",
  },
};
const defaultTheme = {
  accent: "#456b9a",
  ink: "#2d507b",
  soft: "#eef4fd",
  gradient: "linear-gradient(125deg, #eaf2ff 0%, #f9fbff 58%, #dfebfc 100%)",
  glyph: "د",
};

export function getCatalogVisual(category) {
  return themes[category] || defaultTheme;
}
