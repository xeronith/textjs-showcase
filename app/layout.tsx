import { useState, type ReactNode } from "react";
import {
  Badge,
  Box,
  CommandPalette,
  KeyHelp,
  KeyHints,
  ScrollBox,
  StatusBar,
  Text,
  ThemeProvider,
  Toaster,
  themes,
  useKeymap,
  useTheme,
  useViewport,
  type ThemeName,
} from "@textjs/app";
import Link from "@textjs/app/link";
import { usePathname, useRouter } from "@textjs/app/navigation";

const THEME_ORDER: readonly ThemeName[] = ["geistDark", "tokyoNight", "opencodeDark", "amberCrt", "geistLight"];

const PAGES: readonly { href: string; label: string; key: string }[] = [
  { href: "/", label: "Overview", key: "1" },
  { href: "/primitives", label: "Layout", key: "2" },
  { href: "/data", label: "Data", key: "3" },
  { href: "/charts", label: "Charts", key: "4" },
  { href: "/forms", label: "Forms", key: "5" },
  { href: "/keyboard", label: "Keyboard", key: "6" },
];

export default function RootLayout({ children }: { children?: ReactNode }): ReactNode {
  const [themeName, setThemeName] = useState<ThemeName>("geistDark");
  const cycleTheme = (): void => {
    setThemeName((current) => {
      const index = THEME_ORDER.indexOf(current);
      return THEME_ORDER[(index + 1) % THEME_ORDER.length] ?? "geistDark";
    });
  };

  return (
    <ThemeProvider theme={themes[themeName]}>
      <Shell themeName={themeName} onCycleTheme={cycleTheme}>
        {children}
      </Shell>
    </ThemeProvider>
  );
}

function Shell({
  children,
  themeName,
  onCycleTheme,
}: {
  children?: ReactNode;
  themeName: ThemeName;
  onCycleTheme: () => void;
}): ReactNode {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { cols, rows } = useViewport();
  const compact = cols < 100;
  const [paletteOpen, setPaletteOpen] = useState(false);

  useKeymap(
    {
      "1": { label: "Go to Overview", group: "Pages", run: () => router.push("/") },
      "2": { label: "Go to Layout", group: "Pages", run: () => router.push("/primitives") },
      "3": { label: "Go to Data", group: "Pages", run: () => router.push("/data") },
      "4": { label: "Go to Charts", group: "Pages", run: () => router.push("/charts") },
      "5": { label: "Go to Forms", group: "Pages", run: () => router.push("/forms") },
      "6": { label: "Go to Keyboard", group: "Pages", run: () => router.push("/keyboard") },
      "t": { label: "Cycle color theme", group: "App", hint: true, run: onCycleTheme },
      "ctrl+k": {
        label: "Open command palette",
        group: "App",
        hint: true,
        command: false,
        run: () => setPaletteOpen(true),
      },
    },
    { group: "App" },
  );

  return (
    <Box className="flex-col w-full h-full" bg={theme.bg}>
      <Box className="flex-row h-1 items-center px-2 gap-2 shrink-0" bg={theme.surface} borderBottom borderColor={theme.border}>
        <Text bold color={theme.accent} wrap="nowrap">
          ▼ TEXT.JS
        </Text>
        {!compact && (
          <Text color={theme.subtle} wrap="nowrap">
            SHOWCASE
          </Text>
        )}
        <Box className="grow" />
        {PAGES.map((page) => {
          const active = pathname === page.href;
          return (
            <Link
              key={page.href}
              href={page.href}
              className={active ? "text-accent bold" : "text-muted"}
              wrap="nowrap"
            >
              {compact ? page.key : `${page.key} ${page.label}`}
            </Link>
          );
        })}
        {!compact && <Badge variant="outline">{theme.name}</Badge>}
      </Box>

      <Box className="grow flex-col px-2 pt-1 overflow-hidden">
        <ScrollBox className="grow" focusable showScrollbar>
          {/* A fixed design grid: shorter consoles scroll instead of compressing panels. */}
          <Box className="flex-col" height={31}>
            {children}
          </Box>
        </ScrollBox>
      </Box>

      <StatusBar height={1} className="px-2 shrink-0" bg={theme.surface} borderTop borderColor={theme.border}>
        <KeyHints
          gap={2}
          items={
            compact
              ? [
                  { keys: "1-6", label: "pages" },
                  { keys: "ctrl+k", label: "commands" },
                ]
              : [
                  { keys: "1-6", label: "pages" },
                  { keys: "ctrl+k", label: "commands" },
                  { keys: "?", label: "keys" },
                  { keys: "t", label: "theme" },
                ]
          }
        />
        <Text color={theme.subtle} wrap="nowrap">
          {`${cols}×${rows} · ${themeName}`}
        </Text>
      </StatusBar>

      <CommandPalette
        keys={null}
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        width={64}
        placeholder="Jump to a page or run a command…"
        commands={[
          {
            id: "theme",
            label: "Cycle color theme",
            group: "Appearance",
            keys: "t",
            keywords: ["dark", "light", "tokyo", "amber", "colors"],
            run: onCycleTheme,
          },
          {
            id: "docs",
            label: "Open Text.js documentation",
            group: "Links",
            keywords: ["textjs", "docs", "website"],
            run: () => window.open("https://textjs.org/docs", "_blank", "noopener"),
          },
        ]}
      />

      <KeyHelp title="Keyboard shortcuts" />
      <Toaster position="bottom-right" width={38} />
    </Box>
  );
}
