import { Skeleton } from "@heroui/react";

export function LoadingState() {
  return (
    <section className="panel animate-rise space-y-3 p-5" aria-busy="true" aria-live="polite">
      <span className="sr-only">Cargando registros…</span>
      {Array.from({ length: 6 }, (_, index) => (
        <Skeleton key={index} className="h-10 w-full rounded-lg" />
      ))}
    </section>
  );
}
