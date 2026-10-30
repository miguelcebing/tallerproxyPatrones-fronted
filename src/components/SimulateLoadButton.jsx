import { Button, Spinner } from "@heroui/react";

export function SimulateLoadButton({ isSimulating, onSimulate }) {
  return (
    <Button
      variant="primary"
      onPress={onSimulate}
      isDisabled={isSimulating}
      className="h-10 rounded-xl px-4 font-medium"
    >
      {isSimulating ? (
        <>
          <Spinner size="sm" color="current" />
          Simulando…
        </>
      ) : (
        "Simular carga"
      )}
    </Button>
  );
}
