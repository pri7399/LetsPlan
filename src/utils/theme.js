export const C = {
  bg: "#0a0e17",
  card: "#111827",
  cardAlt: "#1a2234",
  border: "#1e293b",
  accent: "#22d3ee",
  accentDim: "rgba(34,211,238,0.12)",
  green: "#34d399",
  greenDim: "rgba(52,211,153,0.12)",
  red: "#f87171",
  redDim: "rgba(248,113,113,0.12)",
  amber: "#fbbf24",
  amberDim: "rgba(251,191,36,0.12)",
  text: "#e2e8f0",
  textDim: "#94a3b8",
  textMuted: "#64748b",
  white: "#ffffff",
  purple: "#a78bfa",
  purpleDim: "rgba(167,139,250,0.12)",
  orange: "#fb923c",
  orangeDim: "rgba(251,146,60,0.12)",
};

export const statusColors = {
  Earning: { color: C.accent, bg: C.accentDim },
  Coasting: { color: C.orange, bg: C.orangeDim },
  Retired: { color: C.green, bg: C.greenDim },
  Dead: { color: C.textMuted, bg: C.cardAlt },
};

export const inputStyle = {
  background: C.bg,
  border: `1px solid ${C.border}`,
  borderRadius: 8,
  color: C.text,
  padding: "8px 12px",
  fontSize: 14,
  width: "100%",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

export const labelStyle = {
  fontSize: 12,
  fontWeight: 600,
  color: C.textDim,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: 4,
};

export const cardStyle = {
  background: C.card,
  border: `1px solid ${C.border}`,
  borderRadius: 16,
  padding: 24,
};

export const badgeStyle = (color, bg) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "2px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  color,
  background: bg,
});
