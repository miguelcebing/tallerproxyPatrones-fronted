import { Card, Chip } from "@heroui/react";
import { formatCount, formatDuration, formatPercent } from "../utils/format";
import { isServiceDegraded } from "../utils/serviceStatus";

const SERVICE_LABELS = {
  "inventory-service": "Inventario",
  "order-service": "Pedidos",
  "payment-service": "Pagos",
};

export function ServiceCard({ service }) {
  const degraded = isServiceDegraded(service);
  const label = SERVICE_LABELS[service.serviceId] ?? service.serviceId;

  return (
    <Card
      className={`animate-rise relative overflow-hidden border bg-panel/85 ${
        degraded ? "border-rose/70 shadow-[0_0_0_1px_oklch(0.69_0.2_22_/_0.35)]" : "border-line/60"
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1 ${degraded ? "bg-rose" : "bg-cyan/70"}`}
      />
      <Card.Header className="flex items-start justify-between gap-3 pt-5">
        <div>
          <p className="metric-label">{service.serviceId}</p>
          <Card.Title className="mt-1 text-lg font-semibold text-ink">{label}</Card.Title>
        </div>
        <Chip color={degraded ? "danger" : "success"} variant="soft" size="sm">
          {degraded ? "Con problemas" : "Operativo"}
        </Chip>
      </Card.Header>
      <Card.Content className="pb-5">
        <dl className="grid grid-cols-3 gap-3">
          <div>
            <dt className="metric-label">Llamadas</dt>
            <dd className="metric-value">{formatCount(service.totalCalls)}</dd>
          </div>
          <div>
            <dt className="metric-label">Éxito</dt>
            <dd className={`metric-value ${degraded ? "text-rose" : "text-mint"}`}>
              {formatPercent(service.successRate)}
            </dd>
          </div>
          <div>
            <dt className="metric-label">Promedio</dt>
            <dd className="metric-value">{formatDuration(service.avgResponseTimeMs)}</dd>
          </div>
        </dl>
        <p className="mt-4 font-mono text-xs text-ink-dim">
          {formatCount(service.errorCalls)} errores · tasa de error {formatPercent(service.errorRate)}
        </p>
      </Card.Content>
    </Card>
  );
}
