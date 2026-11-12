import type { ReactNode } from "react";
import { render } from "@textjs/app/testing";
import { Box, ThemeProvider, themes } from "@textjs/app";
import Overview from "../app/page";
import DataPage from "../app/data/page";
import Charts from "../app/charts/page";
import Forms from "../app/forms/page";
import Keyboard from "../app/keyboard/page";

let failures = 0;
function check(name: string, ok: boolean, detail = ""): void {
  if (ok) console.log(`  ✓ ${name}`);
  else {
    failures += 1;
    console.log(`  ✗ ${name} ${detail}`);
  }
}

async function mount(Page: () => ReactNode) {
  return render(
    <ThemeProvider theme={themes.geistDark}>
      <Box className="w-full h-full flex-col" bg={themes.geistDark.bg}>
        <Page />
      </Box>
    </ThemeProvider>,
    { cols: 116, rows: 34 },
  );
}

console.log("overview");
{
  const app = await mount(Overview);
  check("starts at count 0", app.lastFrame().includes("count = 0"));
  await app.press("up");
  await app.press("up");
  check("up increments", app.lastFrame().includes("count = 2"));
  await app.press("down");
  check("down decrements", app.lastFrame().includes("count = 1"));
  await app.press("r");
  check("r resets", app.lastFrame().includes("count = 0"));
  await app.unmount();
}

console.log("data");
{
  const app = await mount(DataPage);
  check("table is focused", app.lastFrame().includes("dpl_a1f9"));
  check("one selected", app.lastFrame().includes("1 selected"));
  await app.press("space");
  check("space deselects", app.lastFrame().includes("0 selected"));
  await app.press("space");
  check("space selects", app.lastFrame().includes("1 selected"));
  await app.press("s");
  check("s sorts without crashing", app.lastFrame().includes("dpl_"));
  await app.unmount();
}

console.log("charts");
{
  const app = await mount(Charts);
  check("live badge", app.lastFrame().includes("live"));
  await app.press("p");
  check("p pauses", app.lastFrame().includes("paused"));
  await app.press("p");
  check("p resumes", app.lastFrame().includes("live"));
  await app.unmount();
}

console.log("forms");
{
  const app = await mount(Forms);
  check("unsaved", app.lastFrame().includes("unsaved"));
  await app.press("ctrl+s");
  check("ctrl+s saves even from input", app.lastFrame().includes("saved"));
  await app.unmount();
}

console.log("keyboard");
{
  const app = await mount(Keyboard);
  await app.press("n");
  check("n increments step", app.lastFrame().includes("01"));
  await app.press("up");
  check("unclaimed key reaches inspector", app.lastFrame().includes("↑"));
  await app.press("g g");
  check("g g sequence resets", app.lastFrame().includes("00"));
  await app.unmount();
}

if (failures > 0) {
  throw new Error(`${failures} interaction check(s) failed`);
}
console.log("\nall interaction checks passed");
