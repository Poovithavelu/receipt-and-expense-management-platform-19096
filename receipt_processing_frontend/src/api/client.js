//
// PUBLIC_INTERFACE
/**
 * Simple API client for interacting with the backend.
 * Base URL is taken from REACT_APP_API_BASE or defaults to http://localhost:3001.
 * Exposes helper methods for GET/POST/PUT/PATCH/DELETE requests.
 */
const API_BASE =
  process.env.REACT_APP_API_BASE && process.env.REACT_APP_API_BASE.trim().length > 0
    ? process.env.REACT_APP_API_BASE
    : "http://localhost:3001";

/**
 * Internal helper to build headers with JSON content by default.
 */
function buildHeaders(extra = {}) {
  return {
    "Content-Type": "application/json",
    ...extra,
  };
}

/**
 * Internal helper to process fetch responses and throw on HTTP errors.
 */
async function handleResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json().catch(() => ({})) : await res.text();

  if (!res.ok) {
    const error = new Error(
      typeof data === "string" && data ? data : (data && data.message) || `HTTP ${res.status}`
    );
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

// PUBLIC_INTERFACE
export const apiClient = {
  /** Get the configured base URL for diagnostics or advanced usage. */
  get baseUrl() {
    return API_BASE;
  },

  // PUBLIC_INTERFACE
  /** Perform a GET request. */
  async get(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "GET",
      headers: buildHeaders(options.headers),
      ...options,
    });
    return handleResponse(res);
  },

  // PUBLIC_INTERFACE
  /** Perform a POST request with JSON body by default. */
  async post(path, body, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: buildHeaders(options.headers),
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
      // If using FormData, let the browser set Content-Type with boundary
      ...(body instanceof FormData ? { headers: options.headers || {} } : {}),
      ...options,
    });
    return handleResponse(res);
  },

  // PUBLIC_INTERFACE
  /** Perform a PUT request with JSON body by default. */
  async put(path, body, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "PUT",
      headers: buildHeaders(options.headers),
      body: JSON.stringify(body ?? {}),
      ...options,
    });
    return handleResponse(res);
  },

  // PUBLIC_INTERFACE
  /** Perform a PATCH request with JSON body by default. */
  async patch(path, body, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "PATCH",
      headers: buildHeaders(options.headers),
      body: JSON.stringify(body ?? {}),
      ...options,
    });
    return handleResponse(res);
  },

  // PUBLIC_INTERFACE
  /** Perform a DELETE request. */
  async del(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "DELETE",
      headers: buildHeaders(options.headers),
      ...options,
    });
    return handleResponse(res);
  },
};

export default apiClient;
