import { makeStyles, tokens } from "@fluentui/react-components";

export function isFiniteNumber(v: string): boolean {
  const n = Number(v);
  return Number.isFinite(n);
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString([], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// eslint-disable-next-line react-refresh/only-export-components
export const useStyles = await makeStyles({
  shell: {
    maxWidth: "980px",
    margin: "0 auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "8px",
  },
  box: {
    display: "flex",
    flexDirection: "column",
    boxShadow: "gray 0 1px 8px",
    borderRadius: "8px",
    padding: "15px",
  },
  exerciseRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1px",
  },
  tiny: {
    color: tokens.colorNeutralForeground3,
    fontSize: "12px",
  },
});
