import React from "react";
import "./Footer.css";

export default function Footer(props) {
  return (
    <footer className="footer" style={props.style}>
      <p>&copy; 2025 Team-Lunar Ways. All rights reserved.</p>
      <p>Source:<a href="https://api.nasa.gov/">NASA</a></p>
    </footer>
  );
}
