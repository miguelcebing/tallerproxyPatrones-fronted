import { useCallback, useMemo, useState } from "react";
import { fetchLogs, fetchSummary, simulateLoad } from "../api/services";
import { toIsoInstant } from "../utils/format";
import { usePolling } from "./usePolling";

const POLLING_INTERVAL_MS = 3000;
const TABLE_PAGE_SIZE = 20;
const CHART_SAMPLE_SIZE = 100;
const EMPTY_FILTERS = { service: "", status: "", from: "", to: "" };
const CONNECTION_ERROR = "No se pudo conectar con el backend. Reintentando…";

export function useDashboardData() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(0);
  const [summary, setSummary] = useState(null);
  const [logs, setLogs] = useState(null);
  const [chartLogs, setChartLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);

  const query = useMemo(
    () => ({
      service: filters.service || undefined,
      status: filters.status || undefined,
      from: toIsoInstant(filters.from),
      to: toIsoInstant(filters.to),
    }),
    [filters],
  );

  const load = useCallback(
    async (signal) => {
      setIsRefreshing(true);
      try {
        const [summaryData, logsPage, chartPage] = await Promise.all([
          fetchSummary(signal),
          fetchLogs({ ...query, page, size: TABLE_PAGE_SIZE }, signal),
          fetchLogs({ page: 0, size: CHART_SAMPLE_SIZE }, signal),
        ]);
        setSummary(summaryData);
        setLogs(logsPage);
        setChartLogs(chartPage?.content ?? []);
        setLastUpdated(new Date());
        setError(null);
      } catch (requestError) {
        if (requestError?.name !== "AbortError") {
          setError(CONNECTION_ERROR);
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [query, page],
  );

  const restartKey = `${JSON.stringify(query)}|${page}|${refreshToken}`;
  usePolling(load, POLLING_INTERVAL_MS, restartKey);

  const updateFilters = useCallback((nextFilters) => {
    setFilters((current) => ({ ...current, ...nextFilters }));
    setPage(0);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setPage(0);
  }, []);

  const changePage = useCallback((nextPage) => {
    setPage((current) => Math.max(0, nextPage ?? current));
  }, []);

  const refreshNow = useCallback(() => {
    setRefreshToken((token) => token + 1);
  }, []);

  const runSimulation = useCallback(async () => {
    setIsSimulating(true);
    try {
      await simulateLoad();
      refreshNow();
    } catch {
      setError("No se pudo ejecutar la simulación de carga.");
    } finally {
      setIsSimulating(false);
    }
  }, [refreshNow]);

  return {
    filters,
    updateFilters,
    resetFilters,
    page,
    changePage,
    summary,
    logs,
    chartLogs,
    isLoading,
    isRefreshing,
    isSimulating,
    error,
    lastUpdated,
    runSimulation,
  };
}
