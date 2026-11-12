import { defineConfig } from "@textjs/app";

export default defineConfig({
  title: "Text.js Showcase",
  devIndicators: false,
  viewport: { width: 116, height: 34, theme: "geistDark" },
  hints: [
    { keys: "1-6", label: "pages" },
    { keys: "ctrl+k", label: "commands" },
  ],
  action: "press 2 to explore the layout primitives",
});
