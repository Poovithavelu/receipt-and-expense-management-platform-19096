const DEFAULT_BASE = process.env.REACT_APP_API_BASE_URL || '';

/**
 * Centralized API client for backend integration.
 * Uses REACT_APP_API_BASE_URL from environment. Do not hardcode URLs.
 */

async function request(path, { method = 'GET', headers = {}, body, raw } = {}) {
  const url = `${DEFAULT_BASE}${path}`;
  const options = {
    method,
    headers: {
      ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  };

  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${method} ${path} failed: ${res.status} ${text}`);
  }
  if (raw) {
    return res;
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  return res.text();
}

// PUBLIC_INTERFACE
export const Api = {
  /** Upload a document (receipt/invoice) */
  uploadDocument: (formData) => request('/api/documents/upload', { method: 'POST', body: formData }),

  /** Get processing status by document id */
  getStatus: (id) => request(`/api/documents/${encodeURIComponent(id)}/status`, { method: 'GET' }),

  /** Search documents with filters and pagination */
  searchDocuments: (params) => {
    const q = new URLSearchParams();
    Object.entries(params || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null && `${v}`.length > 0) q.append(k, v);
    });
    return request(`/api/documents/search?${q.toString()}`, { method: 'GET' });
  },

  /** Get document details including current version and extracted fields */
  getDocumentDetails: (id) => request(`/api/documents/${encodeURIComponent(id)}`, { method: 'GET' }),

  /** Get versions/history of a document */
  getDocumentVersions: (id) => request(`/api/documents/${encodeURIComponent(id)}/versions`, { method: 'GET' }),

  /** Admin stats and monitoring dashboard data */
  getAdminStats: () => request('/api/admin/stats', { method: 'GET' }),
  getAdminActivity: () => request('/api/admin/activity', { method: 'GET' }),
  getSystemHealth: () => request('/api/admin/health', { method: 'GET' }),
};

export default Api;
