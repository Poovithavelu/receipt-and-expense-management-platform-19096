import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import ProcessingPage from './pages/ProcessingPage';
import DocumentsListPage from './pages/DocumentsListPage';
import DocumentDetailsPage from './pages/DocumentDetailsPage';
import SearchPage from './pages/SearchPage';
import AdminPage from './pages/AdminPage';

// PUBLIC_INTERFACE
export default function AppRouter() {
  /** Defines application routes. */
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/upload" replace />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/processing" element={<ProcessingPage />} />
      <Route path="/documents" element={<DocumentsListPage />} />
      <Route path="/documents/:id" element={<DocumentDetailsPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/upload" replace />} />
    </Routes>
  );
}
