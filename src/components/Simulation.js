import "./Simulation.css";
function Simulation() {
    const srcUrl = `https://heckmon.github.io/nasa-hackathon/?t=${Date.now()}`;
    return (
        <iframe 
            title="simulation"
            src= {srcUrl}
            className="simulation-frame"
            style={{ width: "100%", height: "100vh", border: "none" }}
        />
    );
}

export default Simulation;