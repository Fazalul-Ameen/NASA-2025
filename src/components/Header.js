import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/asteroids", label: "Asteroids" },
  { path: "/meteors", label: "Meteors" },
  { path: "/simulation", label: "Simulation" },
  { path: "/about", label: "About Us" },
];

export default function Header(props) {
  const [isNavOpen, setNavOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="header" style={props.style}>
      <h1>
        <Link to="/" onClick={() => setNavOpen(false)}>🌠 Meteor Madness</Link>
      </h1>
      <nav className={isNavOpen ? "nav-active" : ""}>
        <ul>
          {navItems.map(item => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={() => setNavOpen(false)}
                className={location.pathname === item.path ? "selected" : ""}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <button
        className="hamburger"
        onClick={() => setNavOpen(!isNavOpen)}
        aria-label="Toggle navigation"
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </button>
    </header>
  );
}