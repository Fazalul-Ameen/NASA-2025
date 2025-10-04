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
            <div key={asteroid.id} className={`card rounded-xl p-6 shadow-lg transform transition-transform duration-300 hover:scale-105 ${cardClass}`}>
                <div className="flex items-center space-x-4 mb-4">
                    <img src="https://placehold.co/100x100/1e293b/FFFFFF?text=ASTEROID" alt="Asteroid" className="w-16 h-16 rounded-full border-2 border-gray-600" />
                    <div>
                        <h3 className="text-xl font-bold text-white">{asteroid.name}</h3>
                        <p className="text-gray-400 text-sm">JPL ID: {asteroid.neo_reference_id}</p>
                    </div>
                </div>
                <div className="space-y-3 text-gray-300">
                    <div className="flex items-center">
                        <span className="font-semibold w-1/2">Hazard Risk:</span>
                        <span className="text-white font-bold ml-2">{riskEmoji} {riskText}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-1/2">Size (km):</span>
                        <span className="text-white ml-2">{minDiameterKm} - {maxDiameterKm}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-1/2">Close Approach:</span>
                        <span className="text-white ml-2">{approachDate}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-1/2">Velocity (kph):</span>
                        <span className="text-white ml-2">{relativeVelocityKph}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-1/2">Miss Distance (km):</span>
                        <span className="text-white ml-2">{missDistanceKm}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container rounded-xl p-6 bg-gray-900 border border-gray-700 shadow-xl">
            <header className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-600">
                    Near-Earth Object Tracker
                </h1>
                <p className="mt-2 text-lg text-gray-400">
                    Data from NASA's NeoWs API. Select a date to see asteroids passing near Earth.
                </p>
            </header>

            <section className="mb-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-white">Select Date</h2>
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="w-full md:w-auto bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300"
                    />
                    <button
                        className="w-full md:w-auto bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        onClick={handleSearch}
                    >
                        Search Asteroids
                    </button>
                </div>
            </section>

            <section className="mb-8">
                {loading && (
                    <div className="flex justify-center items-center py-10">
                        <div className="spinner"></div>
                        <p className="ml-4 text-gray-400">Loading asteroid data...</p>
                    </div>
                )}
                {!loading && message && (
                    <div className="text-center text-gray-400 py-10">{message}</div>
                )}
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {asteroids.map(createAsteroidCard)}
            </section>
        </div>
    );
}

export default Asteroids;