import type { ReactNode } from "react";
import {
  Badge,
  Box,
  Center,
  Grid,
  Kbd,
  ProgressBar,
  ScrollBox,
  Spinner,
  SplitPane,
  Stack,
  Text,
  useTheme,
} from "@textjs/app";
import { PageHeader, Panel } from "../../components/ui";

const GRID_CELLS = ["grow", "gap", "border", "round", "px-2", "surface", "accent", "1fr"];

const SCROLL_LINES = [
  "01  app/layout.tsx         console shell",
  "02  app/page.tsx           overview",
  "03  app/primitives/page.tsx  this page",
  "04  app/data/page.tsx      table, tree",
  "05  app/charts/page.tsx    line, bar",
  "06  app/forms/page.tsx     inputs, modal",
  "07  app/keyboard/page.tsx  keymaps",
  "08  components/ui.tsx      panels",
  "09  lib/showcase.ts         demo data",
  "10  text.config.ts          viewport",
  "11  package.json            react 19",
  "12  api/metrics/route.ts   handler",
  "13  app/not-found.tsx       404 route",
  "14  docs/layout.md          boxes, stacks",
  "15  docs/data.md            tables, trees",
  "16  docs/charts.md          dots, blocks",
  "17  docs/forms.md           inputs, dialogs",
  "18  docs/keyboard.md        keymaps",
  "19  docs/testing.md         lastFrame()",
  "20  docs/terminal.md        ANSI output",
  "21  docs/mcp.md             agent access",
  "22  docs/fonts.md           FIGlet fonts",
  "23  docs/themes.md          five presets",
  "24  docs/embed.md           embed anywhere",
  "25  docs/deploying.md       bun, vercel",
  "26  docs/changelog.md       recent ships",
];

export default function PrimitivesPage(): ReactNode {
  const theme = useTheme();

  return (
    <Box className="flex-col gap-1 h-full">
      <PageHeader title="Layout" subtitle="Box · Stack · Grid · SplitPane · ScrollBox · Center" />

      <SplitPane resizable defaultSize={0.58} minSize={26} className="grow">
        <Box className="flex-col gap-1 h-full pr-1">
          <Panel title="Box · border · padding" height={8}>
            <Box className="flex-row gap-1 grow">
              <Box className="flex-col border rounded px-1 grow basis-0" borderColor={theme.accent} bg={theme.surface}>
                <Text bold color={theme.accent} wrap="nowrap">
                  Nested boxes
                </Text>
                <Text color={theme.muted} wrap="wrap">
                  Padding and borders are measured in cells.
                </Text>
              </Box>
              <Box className="flex-col border double px-1 grow basis-0" borderColor={theme.info}>
                <Text underline wrap="nowrap">
                  underline
                </Text>
                <Text italic color={theme.warning} wrap="nowrap">
                  italic
                </Text>
                <Text dim wrap="nowrap">
                  dim spans
                </Text>
              </Box>
            </Box>
          </Panel>

          <Panel title="Stack · divider" height={8}>
            <Stack gap={0} divider>
              <Box className="flex-col">
                <Box className="flex-row gap-1">
                  <Badge>Aa</Badge>
                  <Badge variant="accent">accent</Badge>
                  <Badge variant="success">ready</Badge>
                  <Badge variant="warning">building</Badge>
                </Box>
                <Box className="flex-row gap-1">
                  <Badge variant="danger">failed</Badge>
                  <Badge variant="info">info</Badge>
                  <Badge variant="outline">outline</Badge>
                </Box>
              </Box>
              <Box className="flex-row gap-2">
                <Text bold>bold</Text>
                <Text italic>italic</Text>
                <Text underline>underline</Text>
                <Text inverse>inverse</Text>
                <Text color={theme.success}>success</Text>
              </Box>
              <Box className="flex-row gap-2 items-center">
                <Text color={theme.subtle}>keys</Text>
                <Kbd>⌘K</Kbd>
                <Kbd>ctrl+c</Kbd>
                <Kbd>shift+tab</Kbd>
              </Box>
            </Stack>
          </Panel>

          <Panel title="Grid · 4 columns · centered cells" height={9}>
            <Grid columns={4} gap={1} className="grow">
              {GRID_CELLS.map((label, index) => (
                <Center
                  key={label}
                  className="border rounded"
                  borderColor={index % 2 === 0 ? theme.border : theme.accent}
                  bg={index % 3 === 0 ? theme.surface : undefined}
                >
                  <Text color={index % 2 === 0 ? theme.muted : theme.accent} wrap="nowrap">
                    {label}
                  </Text>
                </Center>
              ))}
            </Grid>
          </Panel>
        </Box>

        <Box className="flex-col gap-1 h-full pl-1">
          <Panel title="ProgressBar · Spinner" height={9}>
            <ProgressBar value={72} max={100} label="block" color={theme.accent} />
            <ProgressBar value={45} max={100} label="line" variant="line" color={theme.success} />
            <ProgressBar value={91} max={100} label="thin" variant="thin" color={theme.warning} />
            <Box className="flex-row gap-2 h-1 items-center">
              <Spinner variant="dots" label="dots" />
              <Spinner variant="pulse" label="pulse" color={theme.accent} />
              <Spinner variant="matrix" label="matrix" color={theme.success} />
            </Box>
          </Panel>

          <Panel title="ScrollBox · tab to focus" className="grow">
            <ScrollBox focusable className="grow" showScrollbar>
              {SCROLL_LINES.map((line) => (
                <Text key={line} color={theme.muted} wrap="nowrap">
                  {line}
                </Text>
              ))}
            </ScrollBox>
          </Panel>
        </Box>
      </SplitPane>

      <Text color={theme.subtle} wrap="nowrap">
        Drag the divider with <Kbd>←</Kbd> <Kbd>→</Kbd> after <Kbd>Tab</Kbd>, or scroll the file list.
      </Text>
    </Box>
  );
}
