import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import './Simulation.css'; 

// --- Helper functions moved outside the component ---
const loader = new THREE.TextureLoader();

function createEarth() {
    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = -23.4 * Math.PI / 180;

    const earthGeometry = new THREE.SphereGeometry(5, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: loader.load("/assets/textures/earth-min.png")
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);

    const cloudsMesh = new THREE.Mesh(
        earthGeometry,
        new THREE.MeshStandardMaterial({
            map: loader.load("/assets/textures/8k_earth_clouds-min.jpg"),
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            alphaMap: loader.load("/assets/textures/8k_earth_clouds-min.jpg"),
        })
    );
    cloudsMesh.scale.setScalar(1.005);

    earthGroup.add(earthMesh);
    earthGroup.add(cloudsMesh);
    return { earthGroup, earthMesh, cloudsMesh };
}

function createPlanets() {
    const mercuryMesh = new THREE.Mesh(new THREE.SphereGeometry(1.92, 32, 32), new THREE.MeshPhongMaterial({ map: loader.load("/assets/textures/2k_mercury.jpg") }));
    const venusMesh = new THREE.Mesh(new THREE.SphereGeometry(4.75, 32, 32), new THREE.MeshPhongMaterial({ map: loader.load("/assets/textures/2k_venus.jpg") }));
    venusMesh.rotation.z = 3 * Math.PI / 180;
    const marsMesh = new THREE.Mesh(new THREE.SphereGeometry(2.66, 32, 32), new THREE.MeshPhongMaterial({ map: loader.load("/assets/textures/2k_mars.jpg") }));
    marsMesh.rotation.z = -25 * Math.PI / 180;
    const jupiterMesh = new THREE.Mesh(new THREE.SphereGeometry(30, 64, 64), new THREE.MeshPhongMaterial({ map: loader.load("/assets/textures/2k_jupiter.jpg") }));
    const saturnMesh = new THREE.Mesh(new THREE.SphereGeometry(25.2, 64, 64), new THREE.MeshPhongMaterial({ map: loader.load("/assets/textures/2k_saturn.jpg") }));
    const ringMesh = new THREE.Mesh(new THREE.RingGeometry(28, 50, 64), new THREE.MeshBasicMaterial({ map: loader.load("/assets/textures/2k_saturn_ring.png"), side: THREE.DoubleSide, transparent: true }));
    ringMesh.rotation.x = -Math.PI / 2;
    saturnMesh.add(ringMesh);
    const uranusMesh = new THREE.Mesh(new THREE.SphereGeometry(20.05, 64, 64), new THREE.MeshPhongMaterial({ map: loader.load("/assets/textures/2k_uranus.jpg") }));
    const neptuneMesh = new THREE.Mesh(new THREE.SphereGeometry(19.4, 64, 64), new THREE.MeshPhongMaterial({ map: loader.load("/assets/textures/2k_neptune.jpg") }));
    return { mercuryMesh, venusMesh, marsMesh, jupiterMesh, saturnMesh, uranusMesh, neptuneMesh };
}

function createSun() {
    const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(200, 64, 64), new THREE.MeshBasicMaterial({ color: "#FDB813" }));
    return sunMesh;
}

function getStarfield({ numStars = 2500, radius = 2000 } = {}) {
    const verts = [];
    const colors = [];
    for (let i = 0; i < numStars; i += 1) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        verts.push(x, y, z);
        const col = new THREE.Color().setHSL(0.6, 0.2, Math.random());
        colors.push(col.r, col.g, col.b);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({ size: 2.5, vertexColors: true, transparent: true, map: loader.load("/assets/textures/circle.png") });
    return new THREE.Points(geo, mat);
}

// --- The React Component ---

function Simulation() {
    const mountRef = useRef(null);
    const [isToolMenuOpen, setToolMenuOpen] = useState(false);
    const [isRevolving, setRevolving] = useState(false);
    const [celestialInfo, setCelestialInfo] = useState({ name: '', details: '', visible: false, x: 0, y: 0 });

    const isRevolvingRef = useRef(isRevolving);
    useEffect(() => {
        // --- Basic Scene Setup ---
        const currentMount = mountRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 3000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        
        // **FIX APPLIED**: Hide info box when camera drag starts, prevents flicker.
        controls.addEventListener('start', () => {
            setCelestialInfo(prev => ({ ...prev, visible: false }));
        });

        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();

        // --- Lighting ---
        const ambientLight = new THREE.AmbientLight(0x333333);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(-2, 0.5, 1.5);
        scene.add(ambientLight, directionalLight);

        // --- Create Celestial Objects ---
        const stars = getStarfield();
        const { earthGroup, earthMesh, cloudsMesh } = createEarth();
        const sunMesh = createSun();
        const { mercuryMesh, venusMesh, marsMesh, jupiterMesh, saturnMesh, uranusMesh, neptuneMesh } = createPlanets();
        scene.add(stars, earthGroup, sunMesh, mercuryMesh, venusMesh, marsMesh, jupiterMesh, saturnMesh, uranusMesh, neptuneMesh);

        // --- Positioning ---
        sunMesh.position.set(-600, 0, 0);
        mercuryMesh.position.set(-300, 0, 0);
        venusMesh.position.set(-100, 0, 0);
        marsMesh.position.set(200, 0, 0);
        jupiterMesh.position.set(600, 0, 0);
        saturnMesh.position.set(950, 0, 0);
        uranusMesh.position.set(1350, 0, 0);
        neptuneMesh.position.set(1750, 0, 0);
        
        camera.position.z = 50;
        camera.lookAt(earthGroup.position);

        // --- Post-processing (Bloom Effect) ---
        const renderScene = new RenderPass(scene, camera);
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(currentMount.clientWidth, currentMount.clientHeight), 1.5, 0.4, 0.85);
        bloomPass.threshold = 0;
        bloomPass.strength = 2;
        bloomPass.radius = 0;
        const bloomComposer = new EffectComposer(renderer);
        bloomComposer.addPass(renderScene);
        bloomComposer.addPass(bloomPass);

        // --- Data Mapping for Info Display ---
        const meshMap = new Map();
        meshMap.set(earthMesh, ["<h2>Earth</h2>", "<p>Distance from Sun: 150 million km</p><p>Radius: 6,371 km</p><p>The only planet known to support life.</p>"]);
        meshMap.set(sunMesh, ["<h2>Sun</h2>", "<p>Type: G-type main-sequence star</p><p>Radius: 696,340 km</p><p>Contains 99.86% of the Solar System's mass.</p>"]);
        meshMap.set(mercuryMesh, ["<h2>Mercury</h2>", "<p>Distance from Sun: 58 million km</p><p>Radius: 2,440 km</p><p>Mercury has no atmosphere and extreme temperature swings.</p>"]);
        meshMap.set(venusMesh, ["<h2>Venus</h2>", "<p>Distance from Sun: 108 million km</p><p>Radius: 6,052 km</p><p>Venus spins in the opposite direction to most planets.</p>"]);
        meshMap.set(marsMesh, ["<h2>Mars</h2>", "<p>Distance from Sun: 228 million km</p><p>Radius: 3,390 km</p><p>Mars is home to the tallest volcano in the solar system, Olympus Mons.</p>"]);
        meshMap.set(jupiterMesh, ["<h2>Jupiter</h2>", "<p>Distance from Sun: 778 million km</p><p>Radius: 69,911 km</p><p>Jupiter has a giant storm called the Great Red Spot.</p>"]);
        meshMap.set(saturnMesh, ["<h2>Saturn</h2>", "<p>Distance from Sun: 1,429 million km</p><p>Radius: 58,232 km</p><p>Saturn's rings are made mostly of ice particles.</p>"]);
        meshMap.set(uranusMesh, ["<h2>Uranus</h2>", "<p>Distance from Sun: 2,871 million km</p><p>Radius: 25,362 km</p><p>Uranus rotates on its side, making its seasons extreme.</p>"]);
        meshMap.set(neptuneMesh, ["<h2>Neptune</h2>", "<p>Distance from Sun: 4,498 million km</p><p>Radius: 24,622 km</p><p>Neptune has the strongest winds in the solar system.</p>"]);

        const planetOrbits = [
            { mesh: mercuryMesh, radius: 300, speed: 0.008, angle: 0 },
            { mesh: venusMesh, radius: 500, speed: 0.003, angle: 0 },
            { mesh: earthGroup, radius: 600, speed: 0.002, angle: 0},
            { mesh: marsMesh, radius: 800, speed: 0.0015, angle: 0 },
            { mesh: jupiterMesh, radius: 1200, speed: 0.0005, angle: 0 },
            { mesh: saturnMesh, radius: 1550, speed: 0.0002, angle: 0 },
            { mesh: uranusMesh, radius: 1950, speed: 0.00008, angle: 0 },
            { mesh: neptuneMesh, radius: 2350, speed: 0.00003, angle: 0 }
        ];

        const animate = () => {
            if (isRevolvingRef.current) {
                planetOrbits.forEach(planet => {
                    planet.angle += planet.speed;
                    planet.mesh.position.x = Math.cos(planet.angle) * planet.radius + sunMesh.position.x;
                    planet.mesh.position.z = Math.sin(planet.angle) * planet.radius;
                });
            }
            earthMesh.rotation.y += 0.005;
            cloudsMesh.rotation.y += 0.005;
            [mercuryMesh, venusMesh, marsMesh, jupiterMesh, saturnMesh, uranusMesh, neptuneMesh].forEach(p => p.rotation.y += 0.005);
            stars.rotation.y -= 0.0005;
            controls.update();
            bloomComposer.render();
        };
        renderer.setAnimationLoop(animate);

        const handleWindowResize = () => {
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            bloomComposer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        };

        const onPointerClick = (event) => {
            if (event.target.closest('.tool-menu') === null && event.target.closest('#tools') === null) {
                setToolMenuOpen(false);
            }
            pointer.x = (event.clientX / currentMount.clientWidth) * 2 - 1;
            pointer.y = -(event.clientY / currentMount.clientHeight) * 2 + 1;
            raycaster.setFromCamera(pointer, camera);
            
            const intersects = raycaster.intersectObjects(scene.children, true);
            let foundClickableObject = false;
            for (const intersect of intersects) {
                const clickedObject = intersect.object;
                const data = meshMap.get(clickedObject);
                if (data) {
                    setCelestialInfo({ name: data[0], details: data[1], visible: true, x: event.clientX, y: event.clientY });
                    foundClickableObject = true;
                    break;
                }
            }
            if (!foundClickableObject) {
                setCelestialInfo(prev => ({ ...prev, visible: false }));
            }
        };

        window.addEventListener('resize', handleWindowResize);
        window.addEventListener('click', onPointerClick);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
            window.removeEventListener('click', onPointerClick);
            renderer.setAnimationLoop(null);
            renderer.dispose();
            currentMount.removeChild(renderer.domElement);
        };
    }, []); 

    
    useEffect(() => {
        isRevolvingRef.current = isRevolving;
    }, [isRevolving]);

    return (
        <div className="simulation-container">
                <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

            <div 
                id="tools" 
                className="fas fa-tools" 
                onClick={() => setToolMenuOpen(!isToolMenuOpen)}
            ></div>

            {isToolMenuOpen && (
                <div className="tool-menu">
                    <div className="tool-item">
                        <p>Planet Revolution</p>
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                title="Toggle planet revolution"
                                checked={isRevolving}
                                onChange={(e) => setRevolving(e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
            )}
            
            {celestialInfo.visible && (
                <>
                    <div id="show-name" style={{ left: `${celestialInfo.x}px`, top: `${celestialInfo.y}px` }} 
                         dangerouslySetInnerHTML={{ __html: celestialInfo.name }}>
                    </div>
                    <div id="show-details" 
                         dangerouslySetInnerHTML={{ __html: celestialInfo.details }}>
                    </div>
                </>
            )}
        </div>
    );
}

export default Simulation;