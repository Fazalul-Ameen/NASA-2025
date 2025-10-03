import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="home-page-container">
      <h1>Meteor Madness – Exploring Space Events</h1>

      <p className="intro-text">
        Meteor Madness is a web application designed to visualize and explore meteor and asteroid events in our solar system. 
        Using real-world datasets, the platform provides interactive visualizations, allowing users to better understand these fascinating celestial objects.
      </p>

      <h2>Purpose of the Project</h2>
      <p>
        The main goal of this project is to make space data more accessible and engaging. 
        This project combines data science, astronomy, and web development to create a learning platform for students, researchers, and space enthusiasts alike.
      </p>

      <h2>Features</h2>
      <ul>
        <li>Visualize meteor and asteroid data interactively.</li>
        <li>Observe realistic meteor animations in a dynamic space background.</li>
        <li>Explore trends, frequency, and trajectories of meteors over time.</li>
        <li>Responsive and clean user interface suitable for all devices.</li>
      </ul>
      
      <Link to="/simulation" className="explore-btn">Explore Simulation</Link>
    </div>
  );
}