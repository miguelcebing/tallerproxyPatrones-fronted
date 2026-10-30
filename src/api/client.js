const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function readProblem(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function request(path, { method = "GET", body, signal } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  if (!response.ok) {
    const problem = await readProblem(response);
    throw new ApiError(problem?.detail ?? `Error ${response.status}`, response.status);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
