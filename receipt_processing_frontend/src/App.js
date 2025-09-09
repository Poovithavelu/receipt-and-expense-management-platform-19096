import React, { useEffect, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import AppRouter from './AppRouter';
import { DocumentProvider } from './context/DocumentContext';
import { BrowserRouter } from 'react-router-dom';

/**
 * Main application component providing theme toggle, global state, and routes.
 */

// PUBLIC_INTERFACE
export default function App() {
  /** Root of the React application. */
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((p) => (p === 'light' ? 'dark' : 'light'));

  return (
    <div className="App">
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
      <BrowserRouter>
        <DocumentProvider>
          <Navbar />
          <AppRouter />
        </DocumentProvider>
      </BrowserRouter>
    </div>
  );
}
