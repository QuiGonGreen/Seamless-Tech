// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('.webgl'),
    alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Remove ambient light
// const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
// scene.add(ambientLight);

// Add a directional light to simulate sunlight from the left side
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(-5, 3, 5); // Position the light to the left side
scene.add(directionalLight);

// Load Earth texture and create a sphere geometry
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('Images/earth.jpg');
const earthGeometry = new THREE.SphereGeometry(1.5, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial({ 
    map: earthTexture,
    roughness: 0.8,
    metalness: 0.2
});
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earthMesh);

// Load atmosphere texture and create a sphere geometry for the atmosphere
const atmosphereTexture = textureLoader.load('Images/earth_atmosphere.png');
const atmosphereGeometry = new THREE.SphereGeometry(1.55, 32, 32);
const atmosphereMaterial = new THREE.MeshBasicMaterial({
    map: atmosphereTexture,
    transparent: true,
    opacity: 0.5
});
const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
scene.add(atmosphereMesh);

camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    earthMesh.rotation.y += 0.001; // Rotate Earth slowly
    atmosphereMesh.rotation.y += 0.001; // Rotate atmosphere slowly
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});