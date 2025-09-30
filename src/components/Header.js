import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <h1><Link to="/">🌠 Meteor Madness</Link></h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/asteroids">Asteroids</Link></li>
          <li><Link to="/meteors">Meteors</Link></li>
          <li><Link to="/simulation">Simulation</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </nav>
    </header>
  );
}
