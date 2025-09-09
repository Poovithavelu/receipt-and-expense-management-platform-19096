import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react';

/**
 * Global document state and actions for the receipt processing frontend.
 * Provides documents, selected document, upload queue, processing statuses, filters, and admin stats.
 */

const DocumentStateContext = createContext(undefined);
const DocumentDispatchContext = createContext(undefined);

// Types and initial state
const initialState = {
  documents: [], // list items with minimal fields for listing
  selectedDocument: null, // full detailed document object
  uploadQueue: [], // {file, tempId, status, progress, error, backendId?}
  processing: {}, // map: docId -> {status, progress, lastUpdate}
  filters: {
    query: '',
    dateFrom: '',
    dateTo: '',
    vendor: '',
    minAmount: '',
    maxAmount: '',
    category: '',
    status: '',
  },
  pagination: {
    page: 1,
    pageSize: 20,
    total: 0,
  },
  admin: {
    stats: null,
    recentActivity: [],
    systemHealth: null,
  },
};

const types = {
  SET_DOCUMENTS: 'SET_DOCUMENTS',
  SET_SELECTED_DOCUMENT: 'SET_SELECTED_DOCUMENT',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  ENQUEUE_UPLOAD: 'ENQUEUE_UPLOAD',
  UPDATE_UPLOAD: 'UPDATE_UPLOAD',
  REMOVE_UPLOAD: 'REMOVE_UPLOAD',
  UPDATE_PROCESSING: 'UPDATE_PROCESSING',
  SET_ADMIN: 'SET_ADMIN',
};

function reducer(state, action) {
  switch (action.type) {
    case types.SET_DOCUMENTS:
      return { ...state, documents: action.payload.items, pagination: { ...state.pagination, total: action.payload.total, page: action.payload.page, pageSize: action.payload.pageSize } };
    case types.SET_SELECTED_DOCUMENT:
      return { ...state, selectedDocument: action.payload };
    case types.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case types.SET_PAGINATION:
      return { ...state, pagination: { ...state.pagination, ...action.payload } };
    case types.ENQUEUE_UPLOAD:
      return { ...state, uploadQueue: [...state.uploadQueue, action.payload] };
    case types.UPDATE_UPLOAD:
      return {
        ...state,
        uploadQueue: state.uploadQueue.map((u) => (u.tempId === action.payload.tempId ? { ...u, ...action.payload.update } : u)),
      };
    case types.REMOVE_UPLOAD:
      return { ...state, uploadQueue: state.uploadQueue.filter((u) => u.tempId !== action.payload.tempId) };
    case types.UPDATE_PROCESSING:
      return { ...state, processing: { ...state.processing, [action.payload.id]: { ...state.processing[action.payload.id], ...action.payload.update } } };
    case types.SET_ADMIN:
      return { ...state, admin: { ...state.admin, ...action.payload } };
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function DocumentProvider({ children }) {
  /** Provides global document state to the app. */
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo(
    () => ({
      setDocuments: (items, total, page, pageSize) => dispatch({ type: types.SET_DOCUMENTS, payload: { items, total, page, pageSize } }),
      setSelectedDocument: (doc) => dispatch({ type: types.SET_SELECTED_DOCUMENT, payload: doc }),
      setFilters: (filters) => dispatch({ type: types.SET_FILTERS, payload: filters }),
      setPagination: (pagination) => dispatch({ type: types.SET_PAGINATION, payload: pagination }),
      enqueueUpload: (uploadItem) => dispatch({ type: types.ENQUEUE_UPLOAD, payload: uploadItem }),
      updateUpload: (tempId, update) => dispatch({ type: types.UPDATE_UPLOAD, payload: { tempId, update } }),
      removeUpload: (tempId) => dispatch({ type: types.REMOVE_UPLOAD, payload: { tempId } }),
      updateProcessing: (id, update) => dispatch({ type: types.UPDATE_PROCESSING, payload: { id, update } }),
      setAdmin: (admin) => dispatch({ type: types.SET_ADMIN, payload: admin }),
    }),
    []
  );

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return (
    <DocumentStateContext.Provider value={value}>
      <DocumentDispatchContext.Provider value={dispatch}>{children}</DocumentDispatchContext.Provider>
    </DocumentStateContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useDocumentState() {
  /** Access global document state and actions. */
  const ctx = useContext(DocumentStateContext);
  if (!ctx) throw new Error('useDocumentState must be used within DocumentProvider');
  return ctx;
}

// PUBLIC_INTERFACE
export function useDocumentActions() {
  /** Access dispatcher actions for document state. */
  const ctx = useContext(DocumentStateContext);
  if (!ctx) throw new Error('useDocumentActions must be used within DocumentProvider');
  return ctx.actions;
}

// PUBLIC_INTERFACE
export function usePolling(callback, intervalMs, deps = []) {
  /** Utility hook to poll on an interval, cleans up automatically. */
  const savedCallback = React.useRef(callback);
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback, ...deps]);
  React.useEffect(() => {
    if (!intervalMs) return undefined;
    const id = setInterval(() => savedCallback.current(), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}
