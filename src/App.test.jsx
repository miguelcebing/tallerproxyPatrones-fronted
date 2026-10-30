import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const SUMMARY = {
  totalCalls: 4,
  errorCalls: 1,
  errorRate: 25,
  avgResponseTimeMs: 120,
  services: [
    {
      serviceId: "inventory-service",
      totalCalls: 2,
      successCalls: 2,
      errorCalls: 0,
      successRate: 100,
      errorRate: 0,
      avgResponseTimeMs: 90,
      degraded: false,
    },
    {
      serviceId: "order-service",
      totalCalls: 1,
      successCalls: 1,
      errorCalls: 0,
      successRate: 100,
      errorRate: 0,
      avgResponseTimeMs: 110,
      degraded: false,
    },
    {
      serviceId: "payment-service",
      totalCalls: 1,
      successCalls: 0,
      errorCalls: 1,
      successRate: 0,
      errorRate: 100,
      avgResponseTimeMs: 200,
      degraded: true,
    },
  ],
};

const LOG = {
  requestId: "b3b7c0de-0000-4000-8000-000000000000",
  serviceId: "payment-service",
  operation: "charge",
  durationMs: 87,
  status: "ERROR",
  timestamp: "2026-10-30T15:04:05.123Z",
  input: [{ orderId: "ORD-1", amount: 120.5 }],
  response: null,
  errorMessage: "Simulated failure in payment-service while executing 'charge'",
  stackTrace: ["boom"],
};

const LOGS_PAGE = { content: [LOG], page: 0, size: 20, totalElements: 1, totalPages: 1 };

function jsonResponse(payload) {
  return Promise.resolve(
    new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

describe("App", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url) => {
        const target = String(url);
        if (target.includes("/summary")) {
          return jsonResponse(SUMMARY);
        }
        if (target.includes("/simulate-load")) {
          return jsonResponse({ requested: 50, successful: 40, failed: 10 });
        }
        return jsonResponse(LOGS_PAGE);
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shouldRenderServiceCardsAndLogTable", async () => {
    render(<App />);

    await waitFor(() => expect(screen.getAllByText("Inventario").length).toBeGreaterThan(0));

    expect(screen.getAllByText("Pedidos").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pagos").length).toBeGreaterThan(0);
    expect(screen.getByText("Con problemas")).toBeInTheDocument();
    expect(screen.getByText("Registro de llamadas")).toBeInTheDocument();
    expect(screen.getByText("charge")).toBeInTheDocument();
    expect(screen.getByText("Simular carga")).toBeInTheDocument();
  });
});
