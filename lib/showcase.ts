/** Shared demo data and tiny deterministic generators for the showcase. */

export type DeployStatus = "ready" | "building" | "failed" | "queued";

export interface Deploy {
  id: string;
  service: string;
  region: string;
  status: DeployStatus;
  branch: string;
  commit: string;
  duration: number;
  age: string;
}

export const STATUS_LABEL: Record<DeployStatus, string> = {
  ready: "ready",
  building: "building",
  failed: "failed",
  queued: "queued",
};

export const STATUS_TOKEN: Record<DeployStatus, string> = {
  ready: "success",
  building: "warning",
  failed: "danger",
  queued: "muted",
};

export const DEPLOYS: readonly Deploy[] = [
  { id: "dpl_a1f9", service: "console-web", region: "iad1", status: "ready", branch: "main", commit: "feat: live frame inspector", duration: 38, age: "2m" },
  { id: "dpl_b2e7", service: "frame-player", region: "sfo1", status: "building", branch: "main", commit: "perf: skip clean rows earlier", duration: 74, age: "4m" },
  { id: "dpl_c3d5", service: "docs-site", region: "fra1", status: "ready", branch: "docs/keymaps", commit: "docs: sequence timeouts", duration: 21, age: "18m" },
  { id: "dpl_d4c4", service: "opencode-proxy", region: "iad1", status: "failed", branch: "fix/session", commit: "fix: resume after reconnect", duration: 12, age: "31m" },
  { id: "dpl_e5b3", service: "edge-render", region: "sin1", status: "ready", branch: "main", commit: "chore: bump yoga wasm", duration: 44, age: "1h" },
  { id: "dpl_f6a2", service: "console-web", region: "sfo1", status: "queued", branch: "exp/braille", commit: "feat: braille dot canvas", duration: 0, age: "1h" },
  { id: "dpl_g7f1", service: "docs-site", region: "iad1", status: "ready", branch: "main", commit: "fix: anchor links on mobile", duration: 19, age: "3h" },
  { id: "dpl_h8e0", service: "frame-player", region: "fra1", status: "ready", branch: "main", commit: "feat: partial prerender holes", duration: 57, age: "5h" },
  { id: "dpl_i9d8", service: "edge-render", region: "sin1", status: "failed", branch: "exp/bidi", commit: "test: 770,241 bidi cases", duration: 91, age: "7h" },
  { id: "dpl_j0c7", service: "console-web", region: "fra1", status: "ready", branch: "main", commit: "feat: fuzzy command search", duration: 33, age: "9h" },
  { id: "dpl_k1b6", service: "docs-site", region: "sin1", status: "ready", branch: "docs/keymaps", commit: "docs: key sequence timeout", duration: 18, age: "11h" },
  { id: "dpl_l2a5", service: "opencode-proxy", region: "iad1", status: "building", branch: "main", commit: "feat: sandbox sessions", duration: 63, age: "13h" },
  { id: "dpl_m3f4", service: "frame-player", region: "sfo1", status: "ready", branch: "main", commit: "fix: sticky scroll to bottom", duration: 41, age: "16h" },
  { id: "dpl_n4e3", service: "edge-render", region: "fra1", status: "queued", branch: "main", commit: "chore: refresh fixtures", duration: 0, age: "1d" },
  { id: "dpl_o5d2", service: "console-web", region: "sin1", status: "ready", branch: "main", commit: "feat: toast queue", duration: 29, age: "1d" },
  { id: "dpl_p6c1", service: "docs-site", region: "sfo1", status: "failed", branch: "fix/links", commit: "fix: broken anchor links", duration: 8, age: "2d" },
];

export interface TreeNodeData {
  id: string;
  label: string;
  hint?: string;
  children?: readonly TreeNodeData[];
}

export const PROJECT_TREE: readonly TreeNodeData[] = [
  {
    id: "app",
    label: "app",
    children: [
      {
        id: "app/layout",
        label: "layout.tsx",
        hint: "shell",
      },
      {
        id: "app/page",
        label: "page.tsx",
        hint: "overview",
      },
      {
        id: "app/data",
        label: "data",
        children: [
          { id: "app/data/page", label: "page.tsx", hint: "table · tree" },
          { id: "app/data/[id]", label: "[id]", hint: "dynamic" },
        ],
      },
      {
        id: "app/api",
        label: "api",
        children: [{ id: "app/api/metrics", label: "metrics/route.ts", hint: "GET" }],
      },
    ],
  },
  {
    id: "components",
    label: "components",
    children: [
      { id: "components/panel", label: "panel.tsx", hint: "12 lines" },
      { id: "components/chart", label: "chart.tsx", hint: "48 lines" },
    ],
  },
  { id: "lib", label: "lib", hint: "3 files" },
  { id: "text.config", label: "text.config.ts", hint: "viewport" },
  { id: "package", label: "package.json", hint: "deps" },
];

export const README_MARKDOWN = `## Text.js showcase

A console-first React app. Every changed frame is **one \`console.log\`**.

- **Layout** — Yoga flexbox snapped to whole cells
- **Data** — virtualized tables, trees and lists
- **Charts** — eighth-block sparklines and dot-matrix plots
- **Keyboard** — focus, keymaps, sequences and a palette

\`\`\`tsx
export default function Page() {
  const [count, setCount] = useState(0);
  useKeymap({ up: { label: "Increment", run: () => setCount((c) => c + 1) } });
  return <Text bold>count = {count}</Text>;
}
\`\`\`

> The same tree renders in DevTools, a terminal, and over MCP
> for coding agents. One component model, three runtimes.

Press \`Tab\` to focus the tree, then \`Enter\` to select a node.`;

export const CODE_SAMPLE = `import { useState } from "react";
import { Box, Text, useKeymap } from "@textjs/app";

export default function Counter() {
  const [count, setCount] = useState(0);
  useKeymap({
    up: { label: "Increment", run: () => setCount((c) => c + 1) },
    down: { label: "Decrement", run: () => setCount((c) => c - 1) },
  });

  return (
    <Box className="border rounded p-1">
      <Text bold>count = {count}</Text>
      <Text color="muted">press ↑ or ↓</Text>
    </Box>
  );
}`;

export const DIFF_BEFORE = `export function Counter() {
  const [count, setCount] = useState(0);
  return <Text>count = {count}</Text>;
}`;

export const DIFF_AFTER = `export function Counter() {
  const [count, setCount] = useState(0);
  useKeymap({
    up: { label: "Increment", run: () => setCount((c) => c + 1) },
    down: { label: "Decrement", run: () => setCount((c) => c - 1) },
  });
  return <Text>count = {count}</Text>;
}`;

export function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

export function wave(length: number, base: number, spread: number, seed: number): number[] {
  const random = seeded(seed);
  const values: number[] = [];
  let current = base;
  for (let index = 0; index < length; index += 1) {
    current += (random() - 0.5) * spread;
    current = Math.max(4, Math.min(96, current));
    values.push(current);
  }
  return values;
}

export function nextPoint(previous: number, spread = 12): number {
  const next = previous + (Math.random() - 0.5) * spread;
  return Math.max(4, Math.min(96, next));
}

