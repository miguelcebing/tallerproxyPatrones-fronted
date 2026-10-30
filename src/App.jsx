import { Suspense, lazy } from "react";
import { ConnectionBanner } from "./components/ConnectionBanner";
import { DashboardHeader } from "./components/DashboardHeader";
import { FilterBar } from "./components/FilterBar";
import { LogsTable } from "./components/LogsTable";
import { ServiceCard } from "./components/ServiceCard";
import { useDashboardData } from "./hooks/useDashboardData";
import { buildChartData } from "./utils/chartData";

const ResponseTimeChart = lazy(() =>
  import("./components/ResponseTimeChart").then((module) => ({ default: module.ResponseTimeChart })),
);

export default function App() {
  const dashboard = useDashboardData();
  const services = dashboard.summary?.services ?? [];
  const chartData = buildChartData(dashboard.chartLogs);
  const showCardSkeletons = dashboard.isLoading && services.length === 0;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <DashboardHeader
        summary={dashboard.summary}
        lastUpdated={dashboard.lastUpdated}
        isRefreshing={dashboard.isRefreshing}
        isSimulating={dashboard.isSimulating}
        onSimulate={dashboard.runSimulation}
      />

      <ConnectionBanner message={dashboard.error} />

      <section aria-label="Resumen por servicio" className="grid gap-4 md:grid-cols-3">
        {showCardSkeletons
          ? Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="panel h-48 animate-pulse" aria-hidden="true" />
            ))
          : services.map((service) => <ServiceCard key={service.serviceId} service={service} />)}
      </section>

      <Suspense fallback={<div className="panel h-72 animate-pulse" aria-hidden="true" />}>
        <ResponseTimeChart data={chartData} />
      </Suspense>

      <FilterBar
        filters={dashboard.filters}
        onChange={dashboard.updateFilters}
        onReset={dashboard.resetFilters}
      />

      <LogsTable
        page={dashboard.logs}
        isLoading={dashboard.isLoading}
        onPrevious={() => dashboard.changePage(dashboard.page - 1)}
        onNext={() => dashboard.changePage(dashboard.page + 1)}
      />

      <footer className="pb-4 text-center font-mono text-[0.7rem] text-ink-dim">
        Proxy de auditoría · Spring Boot + React · actualización cada 3 s
      </footer>
    </div>
  );
}
