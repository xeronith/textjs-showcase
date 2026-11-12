import { useState, type ReactNode } from "react";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Confirm,
  Divider,
  Input,
  Kbd,
  RadioGroup,
  Select,
  Slider,
  Switch,
  Text,
  Textarea,
  useKeymap,
  useTheme,
  useToast,
} from "@textjs/app";
import { PageHeader, Panel } from "../../components/ui";

const PLANS = [
  { value: "starter", label: "Starter", hint: "free", description: "1 console app" },
  { value: "pro", label: "Pro", hint: "$20/mo", description: "unlimited routes" },
  { value: "team", label: "Team", hint: "$80/mo", description: "SSR + MCP" },
];

const TIMEZONES = [
  { value: "utc", label: "UTC", hint: "coordinated" },
  { value: "local", label: "Local time", hint: "device" },
  { value: "fixed", label: "Fixed offset", hint: "+02:00" },
];

export default function FormsPage(): ReactNode {
  const theme = useTheme();
  const toast = useToast();
  const [name, setName] = useState("Ada Lovelace");
  const [email, setEmail] = useState("ada@textjs.org");
  const [password, setPassword] = useState("correct-horse");
  const [bio, setBio] = useState("Building interfaces that render in the console.");
  const [plan, setPlan] = useState("pro");
  const [alerts, setAlerts] = useState(true);
  const [telemetry, setTelemetry] = useState(false);
  const [digest, setDigest] = useState(true);
  const [beta, setBeta] = useState(false);
  const [volume, setVolume] = useState(65);
  const [environment, setEnvironment] = useState("staging");
  const [timezone, setTimezone] = useState("utc");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const valid = name.trim().length >= 2 && email.includes("@");

  const save = (): void => {
    if (!valid) {
      toast.error("Check the form", { description: "A name and a valid email are required." });
      return;
    }
    setSavedAt(new Date().toLocaleTimeString());
    toast.success("Profile saved", { description: `${name.trim()} · ${plan} · ${environment}` });
  };

  useKeymap(
    {
      "ctrl+s": { label: "Save the profile", group: "Forms", hint: true, run: save },
    },
    { group: "Forms" },
  );

  return (
    <Box className="flex-col gap-1 h-full">
      <PageHeader
        title="Forms & Feedback"
        subtitle="Input · Textarea · Select · Switch · Checkbox · Radio · Slider · Dialog · Toast"
        right={<Badge variant="outline">{savedAt === null ? "unsaved" : `saved ${savedAt}`}</Badge>}
      />

      <Box className="flex-row gap-1 shrink-0" height={20}>
        <Panel title="Profile · controlled inputs" className="grow basis-0">
          <Text color={theme.subtle} wrap="nowrap">
            NAME
          </Text>
          <Input value={name} onChange={setName} placeholder="Your name" autoFocus />
          <Text color={valid ? theme.success : theme.danger} wrap="nowrap">
            {valid ? "✓ looks good" : "⨯ a name and a valid email are required"}
          </Text>

          <Text color={theme.subtle} wrap="nowrap">
            EMAIL
          </Text>
          <Input value={email} onChange={setEmail} placeholder="you@example.com" />

          <Text color={theme.subtle} wrap="nowrap">
            PASSWORD · masked
          </Text>
          <Input value={password} onChange={setPassword} mask="•" />

          <Text color={theme.subtle} wrap="nowrap">
            BIO
          </Text>
          <Textarea value={bio} onChange={setBio} minRows={3} maxRows={3} placeholder="A short bio…" />

          <Text color={theme.subtle} wrap="nowrap">
            PLAN
          </Text>
          <Select options={PLANS} value={plan} onChange={(value) => setPlan(value)} limit={3} showDescriptions={false} />

          <Text color={theme.subtle} wrap="wrap">
            Textarea supports wrapping, undo and cursor movement. Select filters as you type.
          </Text>
        </Panel>

        <Panel title="Preferences" className="grow basis-0">
          <Switch checked={alerts} onChange={setAlerts} label="Deploy alerts" description="notify on failed builds" />
          <Switch checked={telemetry} onChange={setTelemetry} label="Telemetry" description="anonymous frame stats" />
          <Checkbox checked={digest} onChange={setDigest} label="Weekly digest" description="every Monday" />
          <Checkbox checked={beta} onChange={setBeta} label="Beta channel" description="try the next renderer" />
          <Slider
            label="Volume"
            value={volume}
            onChange={setVolume}
            min={0}
            max={100}
            step={5}
            width={26}
            formatValue={(value) => `${value}%`}
          />
          <Text color={theme.subtle} wrap="nowrap">
            ENVIRONMENT
          </Text>
          <RadioGroup
            options={[
              { value: "production", label: "production" },
              { value: "staging", label: "staging" },
              { value: "preview", label: "preview" },
            ]}
            value={environment}
            onChange={setEnvironment}
            orientation="horizontal"
          />
          <Text color={theme.subtle} wrap="nowrap">
            TIMEZONE
          </Text>
          <Select options={TIMEZONES} value={timezone} onChange={(value) => setTimezone(value)} limit={3} showDescriptions={false} />

          <Divider title="actions" />

          <Box className="flex-row gap-1 h-1 items-center">
            <Button variant="primary" onPress={save} disabled={!valid}>
              Save profile
            </Button>
            <Button variant="secondary" onPress={() => toast.info("Nothing changed", { description: "Demo state is local." })}>
              Reset
            </Button>
            <Box className="grow" />
            <Text color={theme.subtle} wrap="nowrap">
              <Kbd>ctrl+s</Kbd> saves
            </Text>
          </Box>
          <Text color={theme.subtle} wrap="wrap">
            Tab between controls. Space toggles, arrows adjust, Enter presses. Every control is keyboard operable.
          </Text>
        </Panel>
      </Box>

      <Panel title="Feedback · toasts and modal focus" height={6}>
        <Box className="flex-row gap-1 h-1 items-center">
          <Button variant="secondary" onPress={() => toast.success("Deploy finished", { description: "console-web · 38s" })}>
            Success toast
          </Button>
          <Button variant="secondary" onPress={() => toast.warning("Slow frame", { description: "paint took 24ms" })}>
            Warning toast
          </Button>
          <Button variant="secondary" onPress={() => toast.info("Frame copied", { description: "1,048 cells · 149 spans" })}>
            Info toast
          </Button>
          <Box className="grow" />
          <Button variant="danger" onPress={() => setConfirmOpen(true)}>
            Delete workspace…
          </Button>
        </Box>
        <Text color={theme.muted} wrap="wrap">
          The <Text bold color={theme.fg}>Confirm</Text> dialog traps focus and input until it closes. Toasts stack in
          the bottom-right corner and auto-dismiss.
        </Text>
      </Panel>

      <Confirm
        open={confirmOpen}
        destructive
        title="Delete workspace?"
        message="This removes every deployment and cannot be undone."
        confirmLabel="Delete workspace"
        cancelLabel="Keep it"
        onConfirm={() => {
          setConfirmOpen(false);
          toast.error("Workspace deleted", { description: "Relax — this is only a demo." });
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
}
