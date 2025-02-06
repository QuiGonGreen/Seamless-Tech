// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('.webgl'),
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create rose gold orb
const geometry = new THREE.SphereGeometry(1.5, 64, 64);
const material = new THREE.MeshStandardMaterial({
    color: 0xB76E79, // Rose gold base color
    metalness: 0.7,
    roughness: 0.3,
    emissive: 0xB76E79,
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.9
});

const orb = new THREE.Mesh(geometry, material);
scene.add(orb);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xB76E79, 1.5, 100);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

camera.position.z = 4;

// Figure-8 animation parameters
let time = 0;
const radius = 2.5;
const speed = 0.02;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Figure-8 motion using parametric equations
    time += speed;
    orb.position.x = radius * Math.sin(time);
    orb.position.z = radius * Math.sin(time * 2) * 0.5;
    
    // Gentle rotation
    orb.rotation.y += 0.005;
    
    // Subtle pulsing effect
    orb.scale.setScalar(1 + Math.sin(time * 2) * 0.05);

    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});