import { Button } from "@heroui/react";

const SERVICE_OPTIONS = [
  { value: "", label: "Todos los servicios" },
  { value: "inventory-service", label: "Inventario" },
  { value: "order-service", label: "Pedidos" },
  { value: "payment-service", label: "Pagos" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Todos los estados" },
  { value: "SUCCESS", label: "Éxito" },
  { value: "ERROR", label: "Error" },
];

const FIELD_CLASSES =
  "h-10 rounded-xl border border-line/70 bg-panel-raised px-3 text-sm text-ink transition-colors hover:border-cyan/50 focus:border-cyan focus:outline-none";

export function FilterBar({ filters, onChange, onReset }) {
  return (
    <section className="panel animate-rise p-4" aria-label="Filtros de logs">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[1.1fr_1fr_1fr_1fr_auto]">
        <label className="flex flex-col gap-1.5">
          <span className="metric-label">Servicio</span>
          <select
            className={FIELD_CLASSES}
            value={filters.service}
            onChange={(event) => onChange({ service: event.target.value })}
          >
            {SERVICE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="metric-label">Estado</span>
          <select
            className={FIELD_CLASSES}
            value={filters.status}
            onChange={(event) => onChange({ status: event.target.value })}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="metric-label">Desde</span>
          <input
            type="datetime-local"
            className={FIELD_CLASSES}
            value={filters.from}
            onChange={(event) => onChange({ from: event.target.value })}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="metric-label">Hasta</span>
          <input
            type="datetime-local"
            className={FIELD_CLASSES}
            value={filters.to}
            onChange={(event) => onChange({ to: event.target.value })}
          />
        </label>

        <div className="flex items-end">
          <Button variant="ghost" className="h-10 w-full xl:w-auto" onPress={onReset}>
            Limpiar filtros
          </Button>
        </div>
      </div>
    </section>
  );
}
