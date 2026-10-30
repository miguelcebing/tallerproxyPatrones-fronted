export function EmptyState() {
  return (
    <section className="panel animate-rise flex flex-col items-center gap-2 px-6 py-16 text-center">
      <p className="text-base font-semibold text-ink">Aún no hay logs</p>
      <p className="max-w-md text-sm text-ink-dim">
        Usa «Simular carga» para generar 50 llamadas de prueba entre inventario, pedidos y pagos.
      </p>
    </section>
  );
}
