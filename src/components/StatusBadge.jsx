import { Chip } from "@heroui/react";

export function StatusBadge({ status }) {
  const isSuccess = status === "SUCCESS";

  return (
    <Chip color={isSuccess ? "success" : "danger"} variant="soft" size="sm">
      {isSuccess ? "Éxito" : "Error"}
    </Chip>
  );
}
