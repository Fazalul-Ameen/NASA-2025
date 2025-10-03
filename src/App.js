import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import SpaceBackground from "./components/SpaceBackground";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import Meteors from "./components/Meteors";
import Asteroids from "./components/Asteroids";
import Simulation from "./components/Simulation";
import AboutPage from "./components/AboutPage";
import "./App.css";

function App() {
  const location = useLocation(); 

  return (
    <div className="app-container">
      { location.pathname !== "/simulation" && <SpaceBackground />}
      <div className="overlay-content">
        <Header style={
          location.pathname === "/simulation" ? {
            position: "absolute",
            top: 0,
            right: "-35px"
          } : {}
        } />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/asteroids" element={<Asteroids />} />
          <Route path="/meteors" element={<Meteors />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        { location.pathname !== "/simulation" && <Footer />}
      </div>
    </div>
  );
}

export default App;
