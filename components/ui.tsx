import type { ReactNode } from "react";
import { Box, Text, useTheme, type BoxProps } from "@textjs/app";

/** A bordered, titled container used across the showcase pages. */
export function Panel({
  title,
  className = "",
  children,
  ...box
}: BoxProps & { title?: string; children?: ReactNode }): ReactNode {
  const theme = useTheme();
  return (
    <Box
      {...box}
      className={`flex-col border rounded px-1 ${className}`}
      borderColor={box.borderColor ?? theme.border}
      title={title === undefined ? undefined : ` ${title} `}
      titleColor={theme.subtle}
    >
      {children}
    </Box>
  );
}

/** Page heading with an optional muted subtitle and right-aligned slot. */
export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}): ReactNode {
  const theme = useTheme();
  return (
    <Box className="flex-row h-1 items-center gap-2 shrink-0">
      <Text bold color={theme.fg} wrap="nowrap" flexShrink={0}>
        {title}
      </Text>
      {subtitle !== undefined && (
        <Text color={theme.subtle} wrap="truncate-end">
          {subtitle}
        </Text>
      )}
      <Box className="grow" />
      {right}
    </Box>
  );
}

/** One feature card for the overview grid. */
export function FeatureCard({ title, body }: { title: string; body: string }): ReactNode {
  const theme = useTheme();
  return (
    <Box className="flex-col border rounded px-1" height={5} borderColor={theme.border} bg={theme.surface}>
      <Text bold color={theme.fg} wrap="nowrap" flexShrink={0}>
        {title}
      </Text>
      <Text color={theme.muted} wrap="wrap">
        {body}
      </Text>
    </Box>
  );
}

/** Muted label + value row. */
export function InfoRow({ label, value, color }: { label: string; value: ReactNode; color?: string }): ReactNode {
  const theme = useTheme();
  return (
    <Box className="flex-row h-1 items-center gap-1">
      <Text color={theme.subtle} wrap="nowrap">
        {label}
      </Text>
      <Box className="grow" />
      <Text color={color ?? theme.fg} wrap="nowrap">
        {value}
      </Text>
    </Box>
  );
}

/** A colored status dot. */
export function Dot({ color }: { color: string }): ReactNode {
  return <Text color={color}>●</Text>;
}
