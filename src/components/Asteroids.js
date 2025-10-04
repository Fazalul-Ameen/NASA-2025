import { useEffect, useState } from "react";
import "./Asteroid.css";

function Asteroids() {
    const [date, setDate] = useState(() => {
        const today = new Date().toISOString().split('T')[0];
        return today;
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("Please select a date and click 'Search Asteroids' to get started.");
    const [asteroids, setAsteroids] = useState([]);

    const apiKey = 'DEMO_KEY';

    const fetchAsteroids = async (selectedDate) => {
        setLoading(true);
        setMessage('');
        setAsteroids([]);
        try {
            const url = "https://nasa-hackathon-backend-two.vercel.app/near_items";
            const response = await fetch(
                url, 
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ "start_date": selectedDate, "end_date": selectedDate })
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `API request failed with status: ${response.status}`);
            }
            const data = await response.json();
            const neos = data.near_earth_objects[selectedDate];
            if (!neos || neos.length === 0) {
                setMessage('No near-Earth objects found for this date.');
            } else {
                setAsteroids(neos);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}. Please check your API key and try again.`);
            setAsteroids([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAsteroids(date);
    }, []);

    const handleSearch = () => {
        if (date) {
            fetchAsteroids(date);
        } else {
            setMessage('Please select a valid date.');
        }
    };

    const createAsteroidCard = (asteroid) => {
        const isHazardous = asteroid.is_potentially_hazardous_asteroid;
        const riskText = isHazardous ? 'High' : 'Low';
        const riskEmoji = isHazardous ? '⚠' : '✅';
        const cardClass = isHazardous ? 'hazardous' : 'non-hazardous';
        const minDiameterKm = asteroid.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2);
        const maxDiameterKm = asteroid.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2);
        const closeApproach = asteroid.close_approach_data[0];
        const approachDate = closeApproach.close_approach_date_full || 'N/A';
        const missDistanceKm = parseFloat(closeApproach.miss_distance.kilometers).toLocaleString('en-US');
        const relativeVelocityKph = parseFloat(closeApproach.relative_velocity.kilometers_per_hour).toLocaleString('en-US');
        return (
            <div key={asteroid.id} className={`card ${isHazardous ? 'hazardous' : 'non-hazardous'}`}>
                <div className="flex-row">
                    <img src="https://placehold.co/100x100/1e293b/FFFFFF?text=ASTEROID" alt="Asteroid" />
                    <div>
                        <h3>{asteroid.name}</h3>
                        <p className="jpl-id">JPL ID: {asteroid.neo_reference_id}</p>
                    </div>
                </div>
                <div>
                    <div className="info-row">
                        <span className="label">Hazard Risk:</span>
                        <span className="value">{riskEmoji} {riskText}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Size (km):</span>
                        <span className="value">{minDiameterKm} - {maxDiameterKm}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Close Approach:</span>
                        <span className="value">{approachDate}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Velocity (kph):</span>
                        <span className="value">{relativeVelocityKph}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Miss Distance (km):</span>
                        <span className="value">{missDistanceKm}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container">
            <header className="asteroid-header">
                <h1>Asteroid Tracker</h1>
                <p>
                    Select a date to see asteroids passing near Earth.
                </p>
            </header>

            <section className="section-date">
                <h2>Select Date</h2>
                <div className="input-row">
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                    />
                    <button onClick={handleSearch}>
                        Search Asteroids
                    </button>
                </div>
            </section>

            <section>
                {loading && (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Loading asteroid data...</p>
                    </div>
                )}
                {!loading && message && (
                    <div className="message">{message}</div>
                )}
            </section>

            <section className="asteroid-grid">
                {asteroids.map(createAsteroidCard)}
            </section>
        </div>
    );
}

export default Asteroids;