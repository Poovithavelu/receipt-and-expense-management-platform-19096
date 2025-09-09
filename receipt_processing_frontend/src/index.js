import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Ensure a default theme on first load
if (!document.documentElement.getAttribute('data-theme')) {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
}

// Basic layout styles for main content
const style = document.createElement('style');
style.innerHTML = `
  main { max-width: 1280px; margin: 0 auto; padding: 12px; }
  @media (max-width: 768px) { main { padding: 8px; } }
`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
