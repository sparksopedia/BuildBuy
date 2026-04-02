import type { Scale } from "./constants";

export function genCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export function pct(score: number, scale: Scale): number {
  if (scale.max === scale.min) return 0;
  return (score - scale.min) / (scale.max - scale.min);
}

export function getVerdict(ratio: number) {
  if (ratio < 0.3) return { label: "Strong Build", shortLabel: "Build", col: "#1D4ED8", bg: "#DBEAFE" };
  if (ratio < 0.5) return { label: "Lean Build", shortLabel: "Build ↗", col: "#2563EB", bg: "#EFF6FF" };
  if (ratio < 0.7) return { label: "Lean Buy", shortLabel: "Buy ↗", col: "#16A34A", bg: "#DCFCE7" };
  return { label: "Strong Buy", shortLabel: "Buy", col: "#15803D", bg: "#F0FDF4" };
}
