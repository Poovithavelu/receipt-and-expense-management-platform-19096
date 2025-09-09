import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import DocumentsPage from './pages/DocumentsPage';
import DocumentDetailPage from './pages/DocumentDetailPage';
import AdminDashboard from './pages/AdminDashboard';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App">
      <BrowserRouter>
        <header className="App-header" style={{ minHeight: 'auto' }}>
          <div className="navbar" style={{ display: 'flex', gap: 16, alignItems: 'center', width: '100%', padding: '12px 16px', background: 'var(--bg-secondary)' }}>
            <Link to="/" className="title" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 700 }}>
              Receipt Manager
            </Link>
            <nav style={{ display: 'flex', gap: 12 }}>
              <NavLink to="/upload" className="App-link">Upload</NavLink>
              <NavLink to="/documents" className="App-link">Documents</NavLink>
              <NavLink to="/admin" className="App-link">Admin</NavLink>
            </nav>
            <div style={{ marginLeft: 'auto' }}>
              <button 
                className="theme-toggle" 
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
              </button>
            </div>
          </div>
        </header>
        <main style={{ padding: 24 }}>
          <Routes>
            <Route path="/" element={<DocumentsPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/documents/:id" element={<DocumentDetailPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<div style={{ padding: 24, textAlign: 'left' }}><h2>Not Found</h2><p>The page you are looking for does not exist.</p></div>} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
