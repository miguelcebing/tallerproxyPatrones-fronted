export const SERVICE_SERIES = [
  { id: "inventory-service", label: "Inventario", color: "#67e8f9" },
  { id: "order-service", label: "Pedidos", color: "#a78bfa" },
  { id: "payment-service", label: "Pagos", color: "#fbbf24" },
];

export const CHART_SAMPLE_LIMIT = 20;

function byTimestampAscending(left, right) {
  return new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime();
}

export function buildChartData(entries, limit = CHART_SAMPLE_LIMIT) {
  const safeEntries = Array.isArray(entries) ? [...entries].sort(byTimestampAscending) : [];

  const perService = SERVICE_SERIES.map((series) => ({
    ...series,
    samples: safeEntries.filter((entry) => entry.serviceId === series.id).slice(-limit),
  }));

  const length = perService.reduce((max, series) => Math.max(max, series.samples.length), 0);

  return Array.from({ length }, (_, index) => {
    const point = { call: index + 1 };
    perService.forEach((series) => {
      const sample = series.samples[index];
      if (sample) {
        point[series.id] = sample.durationMs;
      }
    });
    return point;
  });
}
