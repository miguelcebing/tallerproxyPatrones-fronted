const DATE_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "short",
  timeStyle: "medium",
});

const CLOCK_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  timeStyle: "medium",
});

export function formatDuration(milliseconds) {
  if (!Number.isFinite(milliseconds)) {
    return "—";
  }
  if (milliseconds >= 1000) {
    return `${(milliseconds / 1000).toFixed(2)} s`;
  }
  return `${Math.round(milliseconds)} ms`;
}

export function formatPercent(value) {
  if (!Number.isFinite(value)) {
    return "—";
  }
  return `${value.toFixed(1)} %`;
}

export function formatCount(value) {
  if (!Number.isFinite(value)) {
    return "—";
  }
  return new Intl.NumberFormat("es-CO").format(value);
}

export function formatTimestamp(timestamp) {
  if (!timestamp) {
    return "—";
  }
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return DATE_FORMATTER.format(date);
}

export function formatClock(timestamp) {
  if (!timestamp) {
    return "—";
  }
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return CLOCK_FORMATTER.format(date);
}

export function toIsoInstant(localDateTimeValue) {
  if (!localDateTimeValue) {
    return undefined;
  }
  const date = new Date(localDateTimeValue);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return date.toISOString();
}

export function formatJson(value) {
  if (value === null || value === undefined) {
    return "—";
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}
