import "./Simulation.css";
function Simulation() {
    const srcUrl = `https://heckmon.github.io/nasa-hackathon/?t=${Date.now()}`;
    return (
        <iframe 
            title="simulation"
            src= {srcUrl}
            className="simulation-frame"
        />
    );
}

export default Simulation;