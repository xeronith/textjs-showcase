import type { ReactNode } from "react";
import { Box, Text, useTheme } from "@textjs/app";
import Link from "@textjs/app/link";

export default function NotFound(): ReactNode {
  const theme = useTheme();
  return (
    <Box className="flex-col grow items-center justify-center gap-1">
      <Text bold color={theme.danger}>
        404
      </Text>
      <Text color={theme.muted}>This console route does not exist.</Text>
      <Link href="/" autoFocus>
        Back to the overview
      </Link>
    </Box>
  );
}
