import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import ProcessingStatusPage from './pages/ProcessingStatusPage';
import DocumentsPage from './pages/DocumentsPage';
import ExpensesOverviewPage from './pages/ExpensesOverviewPage';
import AdminPage from './pages/AdminPage';

// PUBLIC_INTERFACE
function App() {
  // Apply saved theme if present
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/status" element={<ProcessingStatusPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/overview" element={<ExpensesOverviewPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
