import { formatJson } from "../utils/format";

export function LogDetails({ log }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section>
        <h3 className="metric-label mb-2">Entrada</h3>
        <pre className="code-block">{formatJson(log.input)}</pre>
      </section>
      {log.status === "SUCCESS" ? (
        <section>
          <h3 className="metric-label mb-2">Respuesta</h3>
          <pre className="code-block">{formatJson(log.response)}</pre>
        </section>
      ) : (
        <section>
          <h3 className="metric-label mb-2">Error</h3>
          <p className="mb-2 rounded-lg border border-rose/40 bg-rose/10 px-3 py-2 font-mono text-xs text-rose">
            {log.errorMessage ?? "Error sin mensaje"}
          </p>
          <pre className="code-block">{formatJson(log.stackTrace)}</pre>
        </section>
      )}
    </div>
  );
}
