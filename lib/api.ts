export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function getErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  if ("message" in payload && typeof payload.message === "string") return payload.message;
  return null;
}

async function parseResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  const text = await response.text();
  return text ? { message: text } : null;
}

export async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const payload = await parseResponse(response);

  if (!response.ok) {
    const message = getErrorMessage(payload) || "Request failed";
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}
