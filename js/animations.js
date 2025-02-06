// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('.webgl'),
    alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Add a directional light to simulate sunlight from the left side
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(-5, 3, 5); // Position the light to the left side
scene.add(directionalLight);

// Load Earth texture and create a sphere geometry
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('textures/00_earthmap1k.jpg');
const earthNormalTexture = textureLoader.load('textures/01_earthbump1k.jpg');
const earthSpecularTexture = textureLoader.load('textures/02_earthspec1k.jpg');
const earthLightsTexture = textureLoader.load('textures/03_earthlights1k.jpg');
const earthGeometry = new THREE.SphereGeometry(1.5, 32, 32);
const earthMaterial = new THREE.MeshPhongMaterial({ 
    map: earthTexture,
    normalMap: earthNormalTexture,
    specularMap: earthSpecularTexture,
    emissiveMap: earthLightsTexture,
    shininess: 10
});
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earthMesh);

// Load atmosphere texture and create a sphere geometry for the atmosphere
const atmosphereTexture = textureLoader.load('textures/05_earthcloudmaptrans.jpg');
const atmosphereGeometry = new THREE.SphereGeometry(1.55, 32, 32);
const atmosphereMaterial = new THREE.MeshBasicMaterial({
    map: atmosphereTexture,
    transparent: true,
    opacity: 0.5
});
const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
scene.add(atmosphereMesh);

// Load starfield texture and create a sphere geometry for the background
const starTexture = textureLoader.load('textures/stars/circle.png');
const starGeometry = new THREE.SphereGeometry(90, 64, 64);
const starMaterial = new THREE.MeshBasicMaterial({
    map: starTexture,
    side: THREE.BackSide
});
const starMesh = new THREE.Mesh(starGeometry, starMaterial);
scene.add(starMesh);

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