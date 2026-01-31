const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const apiFetch = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem("accessToken");
  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Error" }));
    throw new Error(error.message || "Request failed");
  }
  return response.json();
};
