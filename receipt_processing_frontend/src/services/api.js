//
// Centralized API client for backend integration
//

const defaultBaseUrl =
  process.env.REACT_APP_BACKEND_BASE_URL || "/api";

/**
 * Normalize base URL ensuring no trailing slash
 */
const getBaseUrl = () => {
  const raw = defaultBaseUrl;
  if (!raw) return "";
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
};

const BASE_URL = getBaseUrl();

/**
 * Helpers to build full URL with query params
 */
function buildUrl(path, params) {
  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  if (!params) return url;
  const usp = new URLSearchParams(params);
  const qs = usp.toString();
  return qs ? `${url}?${qs}` : url;
}

/**
 * Handle fetch with JSON body and errors
 */
async function httpRequest(path, { method = "GET", headers = {}, body, isFormData = false } = {}) {
  const finalHeaders = { ...(isFormData ? {} : { "Content-Type": "application/json" }), ...headers };
  const response = await fetch(buildUrl(path), {
    method,
    headers: finalHeaders,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!response.ok) {
    const errorPayload = isJson ? await response.json().catch(() => ({})) : await response.text().catch(() => "");
    const error = new Error(`Request failed with status ${response.status}`);
    error.status = response.status;
    error.payload = errorPayload;
    throw error;
  }

  return isJson ? response.json() : response.text();
}

// PUBLIC_INTERFACE
export async function uploadDocument(file, metadata = {}) {
  /** Upload a receipt/document file with optional metadata. Returns created document info. */
  const formData = new FormData();
  formData.append("file", file);
  Object.entries(metadata).forEach(([k, v]) => formData.append(k, v));
  return httpRequest("/documents", { method: "POST", body: formData, isFormData: true });
}

// PUBLIC_INTERFACE
export async function getProcessingStatus(documentId) {
  /** Fetch processing status for a document by ID. */
  return httpRequest(`/documents/${encodeURIComponent(documentId)}/status`);
}

// PUBLIC_INTERFACE
export async function listDocuments({ q, page = 1, pageSize = 20, status, category } = {}) {
  /** List/search documents with optional filters and pagination. */
  const params = { q, page, pageSize, status, category };
  return httpRequest("/documents", { method: "GET", headers: {}, body: undefined, isFormData: false, params });
}

// Add support for query params via wrapper for GET
httpRequest.get = async (path, params) => httpRequest(path + (params ? `?${new URLSearchParams(params).toString()}` : ""), { method: "GET" });

// PUBLIC_INTERFACE
export async function getDocument(documentId) {
  /** Get a single document details. */
  return httpRequest(`/documents/${encodeURIComponent(documentId)}`, { method: "GET" });
}

// PUBLIC_INTERFACE
export async function updateDocument(documentId, payload) {
  /** Update document metadata (e.g., category, notes). */
  return httpRequest(`/documents/${encodeURIComponent(documentId)}`, { method: "PUT", body: payload });
}

// PUBLIC_INTERFACE
export async function deleteDocument(documentId) {
  /** Delete a document by ID. */
  return httpRequest(`/documents/${encodeURIComponent(documentId)}`, { method: "DELETE" });
}

// PUBLIC_INTERFACE
export async function getExpensesOverview({ from, to, groupBy = "month" } = {}) {
  /** Retrieve expenses aggregation for dashboards. */
  const params = { from, to, groupBy };
  return httpRequest.get("/analytics/expenses-overview", params);
}

// PUBLIC_INTERFACE
export async function getAdminStats() {
  /** Retrieve high-level admin stats/metrics. */
  return httpRequest("/admin/stats", { method: "GET" });
}

export default {
  uploadDocument,
  getProcessingStatus,
  listDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
  getExpensesOverview,
  getAdminStats,
};
