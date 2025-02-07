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
renderer.sortObjects = true;

// Enhanced lighting setup
const ambientLight = new THREE.AmbientLight(0x404040, 2.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(-5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Earth material with specular highlights
const textureLoader = new THREE.TextureLoader();
const earthMaterial = new THREE.MeshPhongMaterial({
    map: textureLoader.load('Images/00_earthmap1k.jpg'),
    normalMap: textureLoader.load('Images/01_earthbump1k.jpg'),
    specularMap: textureLoader.load('Images/02_earthspec1k.jpg'),
    emissiveMap: textureLoader.load('Images/03_earthlights1k.jpg'),
    emissive: 0xffffff,
    emissiveIntensity: 0.3,
    shininess: 25,
    specular: 0x222222
});

// Earth mesh with smooth rotation
const earthGeometry = new THREE.SphereGeometry(2, 128, 128);
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
earthMesh.rotation.z = 0.41;
scene.add(earthMesh);

// Dynamic cloud layer
const cloudMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('Images/04_earthcloudmap.jpg'),
    alphaMap: textureLoader.load('Images/05_earthcloudmaptrans.jpg'),
    transparent: true,
    opacity: 0.9,
    metalness: 0.1,
    roughness: 0.8,
    depthWrite: false,
    blending: THREE.CustomBlending,
    blendSrc: THREE.SrcAlphaFactor,
    blendDst: THREE.OneFactor
});

const cloudGeometry = new THREE.SphereGeometry(2.03, 128, 128);
const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
cloudMesh.renderOrder = 2; // Explicit render order
scene.add(cloudMesh);

// Teal atmosphere glow
const atmosphereMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x40E0D0,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide,
    metalness: 0.15,
    roughness: 0.65,
    depthWrite: false,
    transmission: 0.1 // Subtple light transmission
});

const atmosphereMesh = new THREE.Mesh(
    new THREE.SphereGeometry(2.08, 128, 128),
    atmosphereMaterial
);
atmosphereMesh.renderOrder = 1;
scene.add(atmosphereMesh);

// Starfield with twinkle effect
const starGeometry = new THREE.BufferGeometry();
const starVertices = [];
for (let i = 0; i < 10000; i++) {
    starVertices.push(
        THREE.MathUtils.randFloatSpread(2500),
        THREE.MathUtils.randFloatSpread(2500),
        THREE.MathUtils.randFloatSpread(2500)
    );
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

const starMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 0.65,
    sizeAttenuation: true,
    depthWrite: false
});

const stars = new THREE.Points(starGeometry, starMaterial);
stars.renderOrder = 0;
scene.add(stars);

camera.position.z = 5;

// Smooth animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.0005;
    
    earthMesh.rotation.y += 0.0018;
    cloudMesh.rotation.y += 0.0023;
    atmosphereMesh.rotation.y += 0.0009;
    
    // Subtle cloud opacity variation
    cloudMaterial.opacity = 0.85 + Math.sin(time) * 0.05;
    
    // Gentle atmosphere pulsation
    atmosphereMaterial.opacity = 0.28 + Math.sin(time * 0.8) * 0.02;
    
    renderer.render(scene, camera);
}

animate();

// Responsive handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});