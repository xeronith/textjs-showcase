import { useState, type ReactNode } from "react";
import {
  Badge,
  Box,
  Button,
  Code,
  Diff,
  Markdown,
  ScrollBox,
  Tabs,
  Table,
  Text,
  Tree,
  useClipboard,
  useTheme,
  useViewport,
  type TableColumn,
  type TreeNode,
} from "@textjs/app";
import { Dot, PageHeader, Panel } from "../../components/ui";
import {
  CODE_SAMPLE,
  DEPLOYS,
  DIFF_AFTER,
  DIFF_BEFORE,
  PROJECT_TREE,
  README_MARKDOWN,
  STATUS_LABEL,
  STATUS_TOKEN,
  type Deploy,
} from "../../lib/showcase";

const COLUMNS: readonly TableColumn<Deploy>[] = [
  {
    key: "id",
    header: "deployment",
    width: 10,
    render: (row) => <Text color="subtle">{row.id}</Text>,
  },
  {
    key: "status",
    header: "status",
    width: 10,
    value: (row) => row.status,
    render: (row) => (
      <Box className="flex-row gap-1">
        <Dot color={STATUS_TOKEN[row.status]} />
        <Text color={STATUS_TOKEN[row.status]}>{STATUS_LABEL[row.status]}</Text>
      </Box>
    ),
  },
  { key: "service", header: "service", width: 16 },
  { key: "region", header: "region", width: 7 },
  { key: "branch", header: "branch", width: 15 },
  {
    key: "commit",
    header: "commit",
    grow: 1,
    minWidth: 14,
    render: (row) => (
      <Text color="muted" wrap="truncate-end">
        {row.commit}
      </Text>
    ),
  },
  {
    key: "duration",
    header: "build",
    width: 6,
    align: "right",
    value: (row) => row.duration,
    render: (row) => <Text color={row.duration > 60 ? "warning" : "fg"}>{`${row.duration}s`}</Text>,
  },
  { key: "age", header: "age", width: 5, align: "right" },
];

const COMPACT_COLUMNS: readonly TableColumn<Deploy>[] = [
  {
    key: "id",
    header: "deployment",
    width: 10,
    render: (row) => <Text color="subtle">{row.id}</Text>,
  },
  {
    key: "status",
    header: "status",
    width: 10,
    value: (row) => row.status,
    render: (row) => (
      <Box className="flex-row gap-1">
        <Dot color={STATUS_TOKEN[row.status]} />
        <Text color={STATUS_TOKEN[row.status]}>{STATUS_LABEL[row.status]}</Text>
      </Box>
    ),
  },
  { key: "service", header: "service", width: 15 },
  {
    key: "commit",
    header: "commit",
    grow: 1,
    minWidth: 12,
    render: (row) => (
      <Text color="muted" wrap="truncate-end">
        {row.commit}
      </Text>
    ),
  },
  {
    key: "duration",
    header: "build",
    width: 6,
    align: "right",
    value: (row) => row.duration,
    render: (row) => <Text color={row.duration > 60 ? "warning" : "fg"}>{`${row.duration}s`}</Text>,
  },
  { key: "age", header: "age", width: 5, align: "right" },
];

const TREE_DATA: readonly TreeNode[] = PROJECT_TREE;

const TABS = [
  { id: "table", label: "Table", badge: DEPLOYS.length },
  { id: "tree", label: "Tree" },
  { id: "markdown", label: "Markdown" },
  { id: "code", label: "Code + Diff" },
];

export default function DataPage(): ReactNode {
  const theme = useTheme();
  const { cols } = useViewport();
  const columns = cols < 108 ? COMPACT_COLUMNS : COLUMNS;
  const [tab, setTab] = useState("table");
  const [focus, setFocus] = useState<Deploy>(DEPLOYS[0]!);
  const [selected, setSelected] = useState<Set<string | number>>(() => new Set(["dpl_a1f9"]));
  const [node, setNode] = useState<TreeNode | null>(TREE_DATA[0] ?? null);
  const { copy, copied } = useClipboard();

  return (
    <Box className="flex-col gap-1 h-full">
      <PageHeader title="Data" subtitle="Table · Tree · Markdown · Code · Diff — all keyboard driven" right={<Badge variant="accent">{`${selected.size} selected`}</Badge>} />

      <Tabs tabs={TABS} activeTab={tab} onChange={setTab} shortcuts={false} variant="pill" className="h-1 shrink-0" />

      {tab === "table" && (
        <Box className="flex-col gap-1 grow">
          <Panel title="Deployments · s sort · space select · enter open" height={18}>
            <Table
              columns={columns}
              rows={DEPLOYS}
              getRowKey={(row) => row.id}
              height={14}
              sortable
              selectionMode="multiple"
              selectedKeys={selected}
              onSelectionChange={setSelected}
              onHighlight={setFocus}
              onSelect={(row) => setFocus(row)}
              autoFocus
            />
          </Panel>

          <Panel title={`Inspector · ${focus.id}`} height={6} className="shrink-0">
            <Box className="flex-row gap-2 h-1 items-center">
              <Text bold color={theme.fg} wrap="nowrap">
                {focus.service}
              </Text>
              <Box className="flex-row gap-1">
                <Dot color={STATUS_TOKEN[focus.status]} />
                <Text color={STATUS_TOKEN[focus.status]}>{STATUS_LABEL[focus.status]}</Text>
              </Box>
              <Text color={theme.subtle}>{focus.region}</Text>
              <Text color={theme.muted} wrap="truncate-end">
                {focus.branch} · {focus.commit}
              </Text>
              <Box className="grow" />
              <Text color={focus.duration > 60 ? theme.warning : theme.muted}>{`${focus.duration}s`}</Text>
              <Button variant="ghost" onPress={() => void copy(focus.id)}>
                {copied ? "copied ✓" : "copy id"}
              </Button>
            </Box>
            <Box className="flex-row gap-1 h-1 items-center">
              <Text color={theme.subtle} wrap="nowrap">
                selected
              </Text>
              <Text color={theme.accent} wrap="truncate-end">
                {selected.size === 0 ? "—" : Array.from(selected).join(", ")}
              </Text>
            </Box>
            <Text color={theme.subtle} wrap="nowrap">
              Space toggles selection · s cycles sort · S reverses · Tab moves focus
            </Text>
          </Panel>
        </Box>
      )}

      {tab === "tree" && (
        <Box className="flex-row gap-1 grow">
          <Panel title="Project tree · arrows expand · enter select" className="grow">
            <Tree
              data={TREE_DATA}
              defaultExpanded={["app", "app/data"]}
              height={20}
              onSelect={setNode}
              onHighlight={setNode}
              autoFocus
            />
          </Panel>
          <Panel title="Selection" width={38} className="shrink-0">
            {node ? (
              <>
                <Text bold color={theme.fg} wrap="nowrap">
                  {node.label}
                </Text>
                <Text color={theme.subtle} wrap="nowrap">
                  {node.id}
                </Text>
                <Text color={theme.muted} wrap="wrap">
                  {node.hint ?? "A folder in the App Router. Folders become routes and layouts."}
                </Text>
                <Text color={theme.subtle} wrap="wrap">
                  ← collapses · → expands · Space toggles · Enter selects
                </Text>
              </>
            ) : (
              <Text color={theme.muted}>Highlight a node.</Text>
            )}
          </Panel>
        </Box>
      )}

      {tab === "markdown" && (
        <Panel title="README.md" className="grow">
          <ScrollBox focusable className="grow">
            <Markdown content={README_MARKDOWN} codeMaxHeight={10} codeLineNumbers />
          </ScrollBox>
        </Panel>
      )}

      {tab === "code" && (
        <Box className="flex-row gap-1 grow">
          <Panel title="app/components/counter.tsx" className="grow">
            <Code code={CODE_SAMPLE} language="tsx" showLineNumbers highlightLines={[5, 6, 7]} maxHeight={18} />
          </Panel>
          <Panel title="Diff · adding a keymap" className="grow">
            <Diff patch={{ before: DIFF_BEFORE, after: DIFF_AFTER, filename: "counter.tsx" }} showLineNumbers maxHeight={18} />
          </Panel>
        </Box>
      )}
    </Box>
  );
}
