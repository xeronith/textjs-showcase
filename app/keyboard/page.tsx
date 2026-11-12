import { useState, type ReactNode } from "react";
import {
  AsciiFont,
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  Input,
  Kbd,
  Slider,
  Text,
  useFocusManager,
  useInput,
  useKeymap,
  useKeymapBindings,
  useTheme,
  useToast,
} from "@textjs/app";
import { InfoRow, PageHeader, Panel } from "../../components/ui";

interface LastKey {
  key: string;
  code: string;
  modifiers: string;
}

const pretty = (key: string): string => (key === "space" ? "space" : key === "return" ? "enter" : key);

export default function KeyboardPage(): ReactNode {
  const theme = useTheme();
  const toast = useToast();
  const focus = useFocusManager();
  const bindings = useKeymapBindings();
  const [steps, setSteps] = useState(0);
  const [action, setAction] = useState("Waiting for a binding…");
  const [debug, setDebug] = useState(false);
  const [last, setLast] = useState<LastKey | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [include, setInclude] = useState(true);
  const [delay, setDelay] = useState(100);

  useKeymap(
    {
      n: {
        label: "Next step",
        group: "Keyboard lab",
        hint: true,
        run: () => {
          setSteps((value) => value + 1);
          setAction("n → next step");
        },
      },
      p: {
        label: "Previous step",
        group: "Keyboard lab",
        hint: true,
        run: () => {
          setSteps((value) => Math.max(0, value - 1));
          setAction("p → previous step");
        },
      },
      x: {
        label: "Reset the step counter",
        group: "Keyboard lab",
        run: () => {
          setSteps(0);
          setAction("x → reset");
        },
      },
      "g g": {
        label: "Sequence g g — jump to the top",
        group: "Keyboard lab",
        run: () => {
          setSteps(0);
          setAction("g g → sequence matched");
          toast.info("Sequence matched", { description: "g then g, within a second." });
        },
      },
      "ctrl+shift+d": {
        label: "Toggle debug badge",
        group: "Keyboard lab",
        run: () => {
          setDebug((value) => !value);
          setAction("ctrl+shift+d → debug toggled");
        },
      },
    },
    { group: "Keyboard lab" },
  );

  useInput(
    (event) => {
      if (event.key === "tab") return;
      const modifiers = [event.ctrl && "ctrl", event.meta && "meta", event.alt && "alt", event.shift && "shift"].filter(Boolean).join("+");
      setLast({ key: pretty(event.key), code: event.code, modifiers: modifiers === "" ? "none" : modifiers });
      setHistory((keys) => [pretty(event.key), ...keys].slice(0, 8));
    },
    { priority: -1 },
  );

  return (
    <Box className="flex-col gap-1 h-full">
      <PageHeader
        title="Keyboard"
        subtitle="useKeymap · useInput · focus manager · KeyHelp · CommandPalette"
        right={debug ? <Badge variant="warning">debug</Badge> : <Badge variant="outline">idle</Badge>}
      />

      <Box className="flex-row gap-1 grow">
        <Box className="flex-col gap-1 grow">
          <Panel title="Keymap lab" height={9}>
            <Box className="flex-row items-center gap-3 h-1">
              <Text color={theme.subtle} wrap="nowrap">
                STEP
              </Text>
              <Text bold color={theme.accent} wrap="nowrap">
                {String(steps).padStart(2, "0")}
              </Text>
              <Text color={theme.muted} wrap="truncate-end">
                {action}
              </Text>
            </Box>
            <Divider title="try these" />
            <Box className="flex-row gap-2 h-1 items-center">
              <Text color={theme.muted} wrap="nowrap">
                <Kbd>n</Kbd> next
              </Text>
              <Text color={theme.muted} wrap="nowrap">
                <Kbd>p</Kbd> previous
              </Text>
              <Text color={theme.muted} wrap="nowrap">
                <Kbd>x</Kbd> reset
              </Text>
            </Box>
            <Box className="flex-row gap-2 h-1 items-center">
              <Text color={theme.muted} wrap="nowrap">
                <Kbd>g g</Kbd> sequence
              </Text>
              <Text color={theme.muted} wrap="nowrap">
                <Kbd>ctrl+shift+d</Kbd> debug
              </Text>
            </Box>
            <Text color={theme.subtle} wrap="wrap">
              Labeled bindings appear in <Text color={theme.accent}>?</Text> and the <Kbd>ctrl+k</Kbd> palette.
              Matched keys are consumed before lower-priority handlers see them.
            </Text>
          </Panel>

          <Panel title="Focus playground" height={8}>
            <Box className="flex-row gap-1 h-1 items-center">
              <Button id="focus-alpha" variant="secondary" onPress={() => setNote("Pressed Alpha")}>
                Alpha
              </Button>
              <Button id="focus-beta" variant="secondary" onPress={() => setNote("Pressed Beta")}>
                Beta
              </Button>
              <Button id="focus-gamma" variant="secondary" onPress={() => setNote("Pressed Gamma")}>
                Gamma
              </Button>
              <Box className="grow" />
              <Badge variant="info">{focus.activeId ?? "no focus"}</Badge>
            </Box>
            <Input
              id="focus-input"
              value={note}
              onChange={setNote}
              placeholder="Focus me, then type…"
              onSubmit={(value) => toast.success("Submitted", { description: value === "" ? "(empty)" : value })}
            />
            <Text color={theme.subtle} wrap="wrap">
              <Kbd>Tab</Kbd> / <Kbd>shift+tab</Kbd> move focus. <Kbd>Enter</Kbd> presses the focused button.
            </Text>
            <Box className="flex-row gap-2 h-1 items-center">
              <Checkbox checked={include} onChange={setInclude} label="Include disabled" />
              <Slider
                label="Delay"
                value={delay}
                onChange={setDelay}
                min={0}
                max={500}
                step={50}
                width={10}
                formatValue={(value) => `${value}ms`}
              />
            </Box>
          </Panel>

          <Panel title="Priority lanes" height={8}>
            <Text color={theme.accent} wrap="nowrap">
              priority 10 · focused editor
            </Text>
            <Text color={theme.subtle} wrap="wrap">
              Text inputs consume printable keys first.
            </Text>
            <Text color={theme.warning} wrap="nowrap">
              priority 0 · useKeymap / useInput
            </Text>
            <Text color={theme.subtle} wrap="wrap">
              Bindings run in order and stop propagation.
            </Text>
            <Text color={theme.muted} wrap="nowrap">
              priority −1 · passive listeners
            </Text>
            <Text color={theme.subtle} wrap="wrap">
              The inspector sees only unclaimed keys.
            </Text>
          </Panel>
        </Box>

        <Panel title="Live input · useInput" width={40} className="shrink-0">
          <Text color={theme.subtle} wrap="nowrap">
            LAST UNHANDLED KEY
          </Text>
          {last === null ? (
            <Box height={3} className="items-center">
              <Text color={theme.subtle}>tap a key</Text>
            </Box>
          ) : asciiSafe(last.key) ? (
            <AsciiFont text={last.key.toUpperCase()} font="compact" color={theme.accent} />
          ) : (
            <Box height={3} className="items-center">
              <Text bold color={theme.accent}>
                {last.key}
              </Text>
            </Box>
          )}
          <InfoRow label="code" value={last?.code ?? "press a key"} />
          <InfoRow label="modifiers" value={last?.modifiers ?? "none"} />
          <Divider title="history" />
          <Box className="flex-row flex-wrap gap-1">
            {history.length === 0 ? (
              <Text color={theme.muted}>Nothing yet.</Text>
            ) : (
              history.map((key, index) => <Kbd key={`${key}-${index}`}>{key}</Kbd>)
            )}
          </Box>
          <Divider title={`active bindings · ${bindings.length}`} />
          {bindings.slice(0, 8).map((binding) => (
            <Box key={binding.id} className="flex-row h-1 items-center gap-1">
              <Text color={theme.accent} width={14} wrap="nowrap">
                {binding.keys}
              </Text>
              <Text color={theme.muted} wrap="truncate-end">
                {binding.label}
              </Text>
            </Box>
          ))}
          <Box className="grow" />
          <Text color={theme.subtle} wrap="wrap">
            Digits 1–6 and the lab’s n / p / x keys are handled by keymaps, so they never reach this panel.
            Try <Kbd>j</Kbd>, <Kbd>k</Kbd> or <Kbd>/</Kbd>.
          </Text>
        </Panel>
      </Box>

      <Text color={theme.subtle} wrap="nowrap">
        <Kbd>?</Kbd> every binding · <Kbd>ctrl+k</Kbd> fuzzy command search · <Kbd>1</Kbd>–<Kbd>6</Kbd> switch pages
      </Text>
    </Box>
  );
}

function asciiSafe(key: string): boolean {
  const glyph = key.toUpperCase();
  return /^[A-Z0-9.\-/: ]+$/.test(glyph) && glyph.length <= 7;
}
