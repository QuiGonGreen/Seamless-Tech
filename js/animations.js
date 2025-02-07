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

// Lighting setup
const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(-5, 3, 5);
scene.add(directionalLight);

// Earth material with enhanced emissive properties
const textureLoader = new THREE.TextureLoader();

const loadTexture = (path) => {
    return new Promise((resolve, reject) => {
        textureLoader.load(
            path,
            (texture) => resolve(texture),
            undefined,
            (error) => reject(new Error(`Failed to load texture: ${path}`))
        );
    });
};

Promise.all([
    loadTexture('Images/00_earthmap1k.jpg'),
    loadTexture('Images/01_earthbump1k.jpg'),
    loadTexture('Images/02_earthspec1k.jpg'),
    loadTexture('Images/03_earthlights1k.jpg')
]).then(([map, normalMap, specularMap, emissiveMap]) => {
    const earthMaterial = new THREE.MeshPhongMaterial({
        map,
        normalMap,
        specularMap,
        emissiveMap,
        emissive: 0xffffff,
        emissiveIntensity: 0.2,
        shininess: 15,
        transparent: true,
        opacity: 1 // Set opacity to 1 or remove this line
    });

    // Earth mesh
    const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthMesh.rotation.z = 0.41;
    scene.add(earthMesh);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        earthMesh.rotation.y += 0.002;
        atmosphereMesh.rotation.y += 0.002;
        renderer.render(scene, camera);
    }

    animate();
}).catch((error) => {
    console.error(error);
});

// Atmosphere effect
const atmosphereMaterial = new THREE.MeshPhongMaterial({
    color: 0x80a7e6,
    transparent: true,
    opacity: 0.15,
    side: THREE.DoubleSide
});
const atmosphereMesh = new THREE.Mesh(
    new THREE.SphereGeometry(2.05, 64, 64),
    atmosphereMaterial
);
scene.add(atmosphereMesh);

// Star background
const starGeometry = new THREE.BufferGeometry();
const starVertices = [];
for (let i = 0; i < 10000; i++) {
    const x = THREE.MathUtils.randFloatSpread(2000);
    const y = THREE.MathUtils.randFloatSpread(2000);
    const z = THREE.MathUtils.randFloatSpread(2000);
    starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.7 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

camera.position.z = 5;

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});