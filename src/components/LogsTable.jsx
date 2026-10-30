import { useId, useState } from "react";
import { Button } from "@heroui/react";
import { formatDuration, formatTimestamp } from "../utils/format";
import { EmptyState } from "./EmptyState";
import { LoadingState } from "./LoadingState";
import { LogDetails } from "./LogDetails";
import { StatusBadge } from "./StatusBadge";

const SERVICE_LABELS = {
  "inventory-service": "Inventario",
  "order-service": "Pedidos",
  "payment-service": "Pagos",
};

const COLUMNS = ["Request ID", "Servicio", "Operación", "Duración", "Estado", "Fecha"];

export function LogsTable({ page, isLoading, onPrevious, onNext }) {
  const [expandedId, setExpandedId] = useState(null);
  const baseId = useId();
  const logs = page?.content ?? [];

  const toggle = (requestId) => {
    setExpandedId((current) => (current === requestId ? null : requestId));
  };

  const handleKeyDown = (event, requestId) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle(requestId);
    }
  };

  if (isLoading && !page) {
    return <LoadingState />;
  }

  if (logs.length === 0) {
    return <EmptyState />;
  }

  const currentPage = page.page ?? 0;
  const totalPages = Math.max(page.totalPages ?? 0, 1);

  return (
    <section className="panel animate-rise overflow-hidden" aria-label="Registro de llamadas">
      <div className="panel-heading">
        <div>
          <h2 className="text-base font-semibold text-ink">Registro de llamadas</h2>
          <p className="text-xs text-ink-dim">Actualización automática cada 3 segundos.</p>
        </div>
        <span className="font-mono text-xs text-ink-dim">{page.totalElements ?? logs.length} logs</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line/50">
              {COLUMNS.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-4 py-3 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-ink-dim"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          {logs.map((log) => {
            const expanded = expandedId === log.requestId;
            const detailId = `${baseId}-${log.requestId}`;
            return (
              <tbody key={log.requestId}>
                <tr
                  className="log-row"
                  tabIndex={0}
                  aria-expanded={expanded}
                  aria-controls={detailId}
                  onClick={() => toggle(log.requestId)}
                  onKeyDown={(event) => handleKeyDown(event, log.requestId)}
                >
                  <td className="px-4 py-3 font-mono text-xs text-ink-soft">
                    {log.requestId.slice(0, 8)}
                    <span className="sr-only"> {log.requestId}</span>
                  </td>
                  <td className="px-4 py-3 text-ink">
                    {SERVICE_LABELS[log.serviceId] ?? log.serviceId}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-ink-soft">{log.operation}</td>
                  <td className="px-4 py-3 font-mono text-xs tabular-nums text-ink">
                    {formatDuration(log.durationMs)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={log.status} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-ink-dim">
                    {formatTimestamp(log.timestamp)}
                  </td>
                </tr>
                {expanded && (
                  <tr id={detailId} className="bg-canvas/60">
                    <td colSpan={COLUMNS.length} className="px-4 py-4">
                      <LogDetails log={log} />
                    </td>
                  </tr>
                )}
              </tbody>
            );
          })}
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-line/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-ink-dim">
          Página {currentPage + 1} de {totalPages}
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onPress={onPrevious} isDisabled={currentPage <= 0}>
            Anterior
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onPress={onNext}
            isDisabled={currentPage + 1 >= totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </section>
  );
}
