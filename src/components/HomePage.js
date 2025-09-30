import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  return (
      <div style={{ maxWidth: "800px", margin: "100px auto", color: "white" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
        Meteor Madness – Exploring Space Events
      </h1>

      <p style={{ fontSize: "1.2rem", lineHeight: "1.8" }}>
        Meteor Madness is a web application designed to visualize and explore meteor and asteroid events in our solar system. 
        Using real-world datasets, the platform provides interactive visualizations of meteor trajectories, frequency, 
        and impact data, allowing users to better understand these fascinating celestial objects.
      </p>

      <h2 style={{ fontSize: "1.8rem", marginTop: "40px", marginBottom: "15px" }}>
        Purpose of the Project
      </h2>
      <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
        The main goal of this project is to make space data more accessible and engaging. 
        By providing a visually appealing interface with a dynamic meteor background, 
        users can explore complex data in a simple and intuitive way. 
        This project combines data science, astronomy, and web development to create a learning platform for students, researchers, and space enthusiasts alike.
      </p>

      <h2 style={{ fontSize: "1.8rem", marginTop: "40px", marginBottom: "15px" }}>
        Features
      </h2>
      <ul style={{ fontSize: "1.1rem", lineHeight: "1.6", paddingLeft: "20px" }}>
        <li>Visualize meteor and asteroid data interactively.</li>
        <li>Observe realistic meteor animations in a dynamic space background.</li>
        <li>Explore trends, frequency, and trajectories of meteors over time.</li>
        <li>Responsive and clean user interface suitable for desktop and mobile.</li>
      </ul>
      <Link to="/data" className="explore-btn">Explore Simulation</Link>
    </div>
  );
}
