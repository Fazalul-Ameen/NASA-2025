import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SpaceBackground from "./components/SpaceBackground";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import AboutPage from "./components/AboutPage";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <SpaceBackground /> {/* Full-screen animated background */}
      <div className="overlay-content">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/*<Route path="/asteroids" element={<Asteroids />} />
          <Route path="/meteors" element={<Meteors />} />
          <Route path="/simulation" element={<Simulation />} />*/}
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
