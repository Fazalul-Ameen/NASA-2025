import React, { useState } from "react"; // Import useState
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  // State to manage whether the mobile navigation is open or not
  const [isNavOpen, setNavOpen] = useState(false);

  return (
    <header className="header">
      <h1>
        {/* Your title with the Link component */}
        <Link to="/" onClick={() => setNavOpen(false)}>🌠 Meteor Madness</Link>
      </h1>

      {/* The navigation menu */}
      {/* We add the 'nav-active' class when isNavOpen is true */}
      <nav className={isNavOpen ? "nav-active" : ""}>
        <ul>
          {/* Each Link now has an onClick to close the menu upon navigation */}
          <li><Link to="/" onClick={() => setNavOpen(false)}>Home</Link></li>
          <li><Link to="/asteroids" onClick={() => setNavOpen(false)}>Asteroids</Link></li>
          <li><Link to="/meteors" onClick={() => setNavOpen(false)}>Meteors</Link></li>
          <li><Link to="/simulation" onClick={() => setNavOpen(false)}>Simulation</Link></li>
          <li><Link to="/about" onClick={() => setNavOpen(false)}>About</Link></li>
        </ul>
      </nav>

      {/* The Hamburger Menu Icon */}
      {/* This button toggles the isNavOpen state */}
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