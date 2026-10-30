import { useEffect, useRef } from "react";

export function usePolling(task, intervalMs, restartKey) {
  const taskRef = useRef(task);

  useEffect(() => {
    taskRef.current = task;
  }, [task]);

  useEffect(() => {
    let cancelled = false;
    let timerId;
    const controller = new AbortController();

    const tick = async () => {
      try {
        await taskRef.current(controller.signal);
      } catch (error) {
        if (error?.name === "AbortError") {
          return;
        }
      }
      if (!cancelled) {
        timerId = setTimeout(tick, intervalMs);
      }
    };

    tick();

    return () => {
      cancelled = true;
      clearTimeout(timerId);
      controller.abort();
    };
  }, [intervalMs, restartKey]);
}
