import { useState, type ReactNode } from "react";
import {
  AsciiFont,
  Box,
  Gradient,
  Grid,
  Kbd,
  ProgressBar,
  Sparkline,
  Text,
  useConsoleStats,
  useInterval,
  useKeymap,
  useTheme,
  useViewport,
} from "@textjs/app";
import { FeatureCard, InfoRow, Panel } from "../components/ui";
import { wave } from "../lib/showcase";

const FEATURES: readonly { title: string; body: string }[] = [
  { title: "Flexbox on cells", body: "Yoga layout in WebAssembly, snapped to the character grid." },
  { title: "Turbolog frames", body: "Only damaged rows repaint. One console.log per changed frame." },
  { title: "App Router", body: "Layouts, pages, params and route handlers keep working." },
  { title: "60+ components", body: "Tables, trees, charts, forms, dialogs and command palettes." },
  { title: "Keyboard first", body: "Focus, keymaps, sequences, paste and command discovery." },
  { title: "Beyond DevTools", body: "The same app renders in terminals and to agents over MCP." },
];

export default function OverviewPage(): ReactNode {
  const theme = useTheme();
  const { cols } = useViewport();
  const [count, setCount] = useState(0);
  const [pulse, setPulse] = useState<number[]>(() => wave(32, 46, 16, 7));
  const stats = useConsoleStats({ interval: 500 });

  useInterval(() => {
    setPulse((series) => [...series.slice(1), Math.max(10, Math.min(90, series[series.length - 1]! + (Math.random() - 0.5) * 18))]);
  }, 1200);

  useKeymap(
    {
      up: { label: "Increment counter", group: "Overview", hint: true, run: () => setCount((value) => Math.min(999, value + 1)) },
      down: { label: "Decrement counter", group: "Overview", hint: true, run: () => setCount((value) => Math.max(0, value - 1)) },
      r: { label: "Reset counter", group: "Overview", run: () => setCount(0) },
    },
    { group: "Overview" },
  );

  return (
    <Box className="flex-col gap-1 h-full">
      <Box className="flex-row items-end gap-2 shrink-0">
        <AsciiFont text="TEXT.JS" font="compact" color={theme.accent} />
        <Box className="flex-col pb-1 gap-0">
          <Gradient colors="geist" bold>
            REACT IN YOUR DEVTOOLS CONSOLE
          </Gradient>
          <Text color={theme.muted} wrap="nowrap">
            React 19 → Yoga → CellBuffer → console.log
          </Text>
        </Box>
      </Box>

      <Box className="flex-row gap-1 h-9 shrink-0">
        <Panel title="Live state" className="grow">
          <Box className="flex-row items-center gap-2 grow">
            <Box className="flex-col shrink-0" width={20}>
              <Text color={theme.subtle} wrap="nowrap">
                FRAMES RENDERED
              </Text>
              <AsciiFont text={String(count).padStart(3, "0")} font="compact" color={theme.fg} />
            </Box>
            <Box className="flex-col grow pt-1">
              <Text color={theme.muted} wrap="wrap">
                Every change is one <Text bold color={theme.accent}>console.log</Text> call.
              </Text>
              <ProgressBar value={count % 101} max={100} label="loop" color={theme.accent} />
              <Text color={theme.subtle} wrap="nowrap">
                count = <Text bold color={theme.accent}>{count}</Text>
              </Text>
              <Text color={theme.subtle} wrap="nowrap">
                <Kbd>↑</Kbd> <Kbd>↓</Kbd> change · <Kbd>r</Kbd> reset
              </Text>
            </Box>
          </Box>
        </Panel>

        <Panel title="Turbolog telemetry" width={38} className="shrink-0">
          <Sparkline data={pulse} width={34} height={2} color={theme.accent} />
          <InfoRow label="frame" value={stats.frameCount.toLocaleString()} />
          <InfoRow label="fps" value={stats.fps.toFixed(1)} />
          <InfoRow label="%c spans" value={stats.spanCount} />
          <InfoRow label="dirty rows" value={stats.dirtyRows} color={theme.warning} />
        </Panel>
      </Box>

      <Box className="flex-row h-1 items-center gap-2 shrink-0">
        <Text bold color={theme.fg} wrap="nowrap">
          What is inside
        </Text>
        <Text color={theme.subtle} wrap="truncate-end">
          {cols >= 100 ? "six reasons this is not a terminal emulator" : "a console-first React framework"}
        </Text>
      </Box>

      <Grid columns={3} gap={1} className="shrink-0">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} title={feature.title} body={feature.body} />
        ))}
      </Grid>

      <Text color={theme.subtle} wrap="nowrap">
        <Kbd>?</Kbd> every shortcut · <Kbd>⌘K</Kbd> command palette · <Kbd>t</Kbd> switch theme ·{" "}
        <Text color={theme.info}>https://textjs.org</Text>
      </Text>
    </Box>
  );
}
