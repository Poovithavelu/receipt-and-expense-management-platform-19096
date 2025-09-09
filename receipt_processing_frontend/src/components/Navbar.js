import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

// PUBLIC_INTERFACE
export default function Navbar() {
  /** Top navigation bar with routes to core pages. */
  return (
    <nav className="navbar">
      <div className="navbar-brand">Receipts</div>
      <div className="navbar-links">
        <NavLink to="/upload" className={({ isActive }) => (isActive ? 'active' : '')}>Upload</NavLink>
        <NavLink to="/processing" className={({ isActive }) => (isActive ? 'active' : '')}>Processing</NavLink>
        <NavLink to="/documents" className={({ isActive }) => (isActive ? 'active' : '')}>Documents</NavLink>
        <NavLink to="/search" className={({ isActive }) => (isActive ? 'active' : '')}>Search</NavLink>
        <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : '')}>Admin</NavLink>
      </div>
    </nav>
  );
}
