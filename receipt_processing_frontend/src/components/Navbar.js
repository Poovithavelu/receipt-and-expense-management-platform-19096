import { Link, NavLink } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="brand">Receiptron</Link>
      </div>
      <div className="nav-center">
        <NavLink to="/upload" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Upload</NavLink>
        <NavLink to="/status" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Processing</NavLink>
        <NavLink to="/documents" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Documents</NavLink>
        <NavLink to="/overview" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Expenses</NavLink>
        <NavLink to="/admin" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Admin</NavLink>
      </div>
      <div className="nav-right">
        <ThemeToggleButton />
      </div>
    </nav>
  );
}

function ThemeToggleButton() {
  const toggle = () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };
  return (
    <button className="theme-toggle-btn" onClick={toggle} aria-label="Toggle theme">
      🌗
    </button>
  );
}
