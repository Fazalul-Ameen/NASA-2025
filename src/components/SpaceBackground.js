import React, { useEffect, useState } from "react";
import "./SpaceBackground.css";

export default function SpaceBackground() {
  const [meteors, setMeteors] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      const meteor = {
        id,
        top: Math.random() * 80,            // random starting top
        left: 110,                          // start just offscreen right
        size: 1 + Math.random() * 2,        // thickness
        length: 60 + Math.random() * 80,    // tail length
        duration: 1 + Math.random() * 1.5,  // speed
        angle: -100                          // direction top-right → bottom-left
      };
      setMeteors(prev => [...prev, meteor]);

      // remove meteor after animation ends
      setTimeout(() => setMeteors(prev => prev.filter(m => m.id !== id)), meteor.duration * 1000);
    }, 150); // frequent meteors

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-bg">
      {meteors.map(m => (
        <div
          key={m.id}
          className="meteor"
          style={{
            top: `${m.top}%`,
            left: `${m.left}vw`,
            width: `${m.size}px`,
            height: `${m.length}px`,
            transform: `rotate(${m.angle}deg)`,
            animationDuration: `${m.duration}s`,
          }}
        />
      ))}

      <div className="stars">
        
      </div>
    </div>
  );
}
