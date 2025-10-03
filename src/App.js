// src/App.js - Minor Change
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
  const isSimulationPage = location.pathname === "/simulation";

  return (
    // Add a class for the simulation page for specific styling
    <div className={isSimulationPage ? "simulation-layout" : ""}>
      { !isSimulationPage && <SpaceBackground />}
      <div className="overlay-content">
        <Header style={
          location.pathname === "/simulation" ? {
            position: "absolute",
            width: "100vw",
            top: 0,
          } : {}
        }/>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/asteroids" element={<Asteroids />} />
            <Route path="/meteors" element={<Meteors />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        { !isSimulationPage && <Footer />}
      </div>
    </div>
  );
}

export default App;