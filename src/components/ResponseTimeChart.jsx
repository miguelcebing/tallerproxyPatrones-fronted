import { Card } from "@heroui/react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SERVICE_SERIES } from "../utils/chartData";
import { formatDuration } from "../utils/format";

const LABELS = Object.fromEntries(SERVICE_SERIES.map((series) => [series.id, series.label]));

const TOOLTIP_STYLE = {
  backgroundColor: "oklch(0.215 0.026 265)",
  border: "1px solid oklch(0.36 0.03 265)",
  borderRadius: "0.75rem",
  color: "oklch(0.97 0.008 265)",
  fontSize: "0.75rem",
};

function labelFor(seriesId) {
  return LABELS[seriesId] ?? seriesId;
}

export function ResponseTimeChart({ data }) {
  return (
    <Card className="animate-rise border border-line/60 bg-panel/85">
      <Card.Header className="flex flex-col items-start gap-1 border-b border-line/50 pb-4">
        <Card.Title className="text-base font-semibold text-ink">Tiempo de respuesta</Card.Title>
        <Card.Description className="text-sm text-ink-dim">
          Últimas 20 llamadas por servicio, en milisegundos.
        </Card.Description>
      </Card.Header>
      <Card.Content className="pt-5">
        {data.length === 0 ? (
          <p className="py-16 text-center text-sm text-ink-dim">
            Sin datos todavía. Genera tráfico con «Simular carga».
          </p>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
                <CartesianGrid stroke="oklch(0.36 0.03 265 / 0.45)" strokeDasharray="3 4" vertical={false} />
                <XAxis
                  dataKey="call"
                  stroke="oklch(0.63 0.02 265)"
                  tick={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
                  tickLine={false}
                />
                <YAxis
                  stroke="oklch(0.63 0.02 265)"
                  tick={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
                  tickLine={false}
                  width={56}
                  tickFormatter={(value) => `${value} ms`}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  labelFormatter={(value) => `Llamada ${value}`}
                  formatter={(value, name) => [formatDuration(value), labelFor(name)]}
                />
                <Legend formatter={labelFor} wrapperStyle={{ fontSize: "0.75rem", paddingTop: 8 }} />
                {SERVICE_SERIES.map((series) => (
                  <Line
                    key={series.id}
                    type="monotone"
                    dataKey={series.id}
                    name={series.id}
                    stroke={series.color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card.Content>
    </Card>
  );
}
