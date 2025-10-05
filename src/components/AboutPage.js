import React from "react";
import { Link } from "react-router-dom";
import "./AboutPage.css";

export default function AboutPage() {
  return (
    <div className="about-page">
      <h2>About Meteor Madness</h2>
      <p>
        Meteor Madness is a NASA Space Apps Challenge project that visualizes meteors and asteroid
        data in an interactive web interface. Explore trajectories and live
        data sourced from NASA.
      </p>
      <Link to="https://www.spaceappschallenge.org/2025/find-a-team/lunarway/?tab=members" className="explore-btn">Know more about us..</Link>
    </div>
  );
}
