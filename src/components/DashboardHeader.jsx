import { formatClock, formatCount, formatPercent } from "../utils/format";
import { SimulateLoadButton } from "./SimulateLoadButton";

export function DashboardHeader({ summary, lastUpdated, isRefreshing, isSimulating, onSimulate }) {
  return (
    <header className="animate-rise flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <p className="metric-label flex items-center gap-2">
          <span className="inline-flex h-2 w-2 animate-pulse-dot rounded-full bg-mint" aria-hidden="true" />
          Monitoreo en vivo
        </p>
        <h1 className="text-sheen mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Observabilidad con Proxy de logging
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Cada llamada a inventario, pedidos y pagos pasa por un proxy que audita la operación, mide su
          duración y registra el resultado.
        </p>
        {summary ? (
          <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-ink-dim">
            <span>{formatCount(summary.totalCalls)} llamadas</span>
            <span aria-hidden="true">·</span>
            <span>{formatCount(summary.errorCalls)} errores</span>
            <span aria-hidden="true">·</span>
            <span>tasa de error {formatPercent(summary.errorRate)}</span>
          </p>
        ) : null}
      </div>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <p className="font-mono text-xs text-ink-dim" aria-live="polite">
          {isRefreshing ? "Actualizando…" : `Actualizado ${formatClock(lastUpdated)}`}
        </p>
        <SimulateLoadButton isSimulating={isSimulating} onSimulate={onSimulate} />
      </div>
    </header>
  );
}
