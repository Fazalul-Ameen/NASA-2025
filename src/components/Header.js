import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header(props) {
  const [isNavOpen, setNavOpen] = useState(false);

  return (
    <header className="header" style={props.style}>
      <h1>
        <Link to="/" onClick={() => setNavOpen(false)}>🌠 Meteor Madness</Link>
      </h1>
      <nav className={isNavOpen ? "nav-active" : ""}>
        <ul>
          <li><Link to="/" onClick={() => setNavOpen(false)}>Home</Link></li>
          <li><Link to="/asteroids" onClick={() => setNavOpen(false)}>Asteroids</Link></li>
          <li><Link to="/meteors" onClick={() => setNavOpen(false)}>Meteors</Link></li>
          <li><Link to="/simulation" onClick={() => setNavOpen(false)}>Simulation</Link></li>
          <li><Link to="/about" onClick={() => setNavOpen(false)}>About Us</Link></li>
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