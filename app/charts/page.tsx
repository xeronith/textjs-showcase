import { useState, type ReactNode } from "react";
import {
  Badge,
  BarChart,
  Box,
  Button,
  Gradient,
  LineChart,
  ProgressBar,
  Sparkline,
  Spinner,
  Text,
  useInterval,
  useKeymap,
  useTheme,
} from "@textjs/app";
import { PageHeader, Panel } from "../../components/ui";
import { nextPoint, wave } from "../../lib/showcase";

interface ApiMetrics {
  rps: number;
  p99: number;
  errorRate: number;
  at: string;
}

const REGIONS = [
  { label: "iad1", value: 42 },
  { label: "sfo1", value: 68 },
  { label: "fra1", value: 31 },
  { label: "sin1", value: 94 },
  { label: "syd1", value: 55 },
];

export default function ChartsPage(): ReactNode {
  const theme = useTheme();
  const [paused, setPaused] = useState(false);
  const [requests, setRequests] = useState<number[]>(() => wave(48, 64, 16, 3));
  const [errors, setErrors] = useState<number[]>(() => wave(48, 14, 9, 11));
  const [api, setApi] = useState<ApiMetrics | null>(null);
  const [loading, setLoading] = useState(false);

  useInterval(() => {
    if (paused) return;
    setRequests((series) => [...series.slice(1), nextPoint(series[series.length - 1] ?? 60, 18)]);
    setErrors((series) => [...series.slice(1), Math.max(2, Math.min(40, nextPoint(series[series.length - 1] ?? 14, 9)))]);
  }, 800);

  const refresh = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch("/api/metrics");
      setApi((await response.json()) as ApiMetrics);
    } catch {
      setApi(null);
    } finally {
      setLoading(false);
    }
  };

  useKeymap(
    {
      p: { label: "Pause / resume the live chart", group: "Charts", hint: true, run: () => setPaused((value) => !value) },
      f: { label: "Fetch /api/metrics", group: "Charts", hint: true, run: () => void refresh() },
    },
    { group: "Charts" },
  );

  const current = requests[requests.length - 1] ?? 0;
  const currentErrors = errors[errors.length - 1] ?? 0;

  return (
    <Box className="flex-col gap-1 h-full">
      <PageHeader
        title="Charts"
        subtitle="LineChart · BarChart · Sparkline · ProgressBar · Gradient"
        right={<Badge variant={paused ? "warning" : "success"}>{paused ? "paused" : "live"}</Badge>}
      />

      <Box className="flex-row gap-1 h-6 shrink-0">
        <Panel title="Requests" className="grow basis-0">
          <Text bold color={theme.fg} wrap="nowrap">
            {`${current.toFixed(0)} rps`}
          </Text>
          <Sparkline data={requests} height={2} min={0} max={100} color={theme.accent} />
          <Text color={theme.subtle} wrap="nowrap">
            +12% vs the previous hour
          </Text>
        </Panel>
        <Panel title="Error rate" className="grow basis-0">
          <Text bold color={currentErrors > 28 ? theme.danger : theme.fg} wrap="nowrap">
            {`${(currentErrors / 4).toFixed(1)}%`}
          </Text>
          <Sparkline data={errors} height={2} min={0} max={40} color={currentErrors > 28 ? theme.danger : theme.warning} />
          <Text color={theme.subtle} wrap="nowrap">
            budget 1.0%
          </Text>
        </Panel>
        <Panel title="Edge cache" className="grow basis-0">
          <Text bold color={theme.fg} wrap="nowrap">
            98.4% hit
          </Text>
          <ProgressBar value={98.4} max={100} showValue={false} color={theme.success} />
          <Text color={theme.subtle} wrap="nowrap">
            stale-while-revalidate
          </Text>
        </Panel>
      </Box>

      <Box className="flex-row gap-1 shrink-0" height={20}>
        <Panel title={`Requests vs errors · ${paused ? "paused" : "800ms tick"}`} className="grow" height={20}>
          <LineChart
            series={[
              { data: requests, label: "requests", color: theme.accent },
              { data: errors, label: "errors", color: theme.danger },
            ]}
            height={14}
            min={0}
            max={100}
            marker="quadrant"
            axis
            formatValue={(value) => `${Math.round(value)}`}
          />
          <Gradient colors="geist" bold>
            {"EVERY CHANGED FRAME IS ONE console.log CALL"}
          </Gradient>
        </Panel>

        <Box className="flex-col gap-1 shrink-0" width={34} height={20}>
          <Panel title="p99 by region" height={11}>
            <BarChart data={REGIONS} max={100} gap={1} formatValue={(value) => `${value}ms`} color={theme.info} />
          </Panel>
          <Panel title="Route handler" height={8}>
            <Text color={theme.subtle} wrap="nowrap">
              GET /api/metrics
            </Text>
            {loading ? (
              <Spinner variant="dots" label="fetching" color={theme.accent} />
            ) : (
              <Text color={api === null ? theme.muted : theme.success} wrap="wrap">
                {api === null
                  ? "press f or the button"
                  : `${api.rps.toFixed(0)} rps · p99 ${api.p99.toFixed(0)}ms · ${(api.errorRate * 100).toFixed(1)}% err`}
              </Text>
            )}
            <Button variant="secondary" onPress={() => void refresh()}>
              Fetch metrics
            </Button>
          </Panel>
        </Box>
      </Box>

      <Text color={theme.subtle} wrap="nowrap">
        <Text color={theme.accent}>p</Text> pause the stream · <Text color={theme.accent}>f</Text> call the route handler · data updates one cell at a time
      </Text>
    </Box>
  );
}
