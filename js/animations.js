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

// Realistic sunlight setup - Position adjusted to left side
const directionalLight = new THREE.DirectionalLight(0xfff4e6, 4.0);
directionalLight.position.set(-5, 0, 0); // Changed to negative X for left-side illumination
directionalLight.castShadow = true;
scene.add(directionalLight);

// Minimal ambient light to prevent complete darkness
const minimalAmbient = new THREE.AmbientLight(0x404040, 0.1);
scene.add(minimalAmbient);

// Earth material with enhanced night lights
const textureLoader = new THREE.TextureLoader();
const earthMaterial = new THREE.MeshPhongMaterial({
    map: textureLoader.load('Images/00_earthmap1k.jpg'),
    normalMap: textureLoader.load('Images/01_earthbump1k.jpg'),
    specularMap: textureLoader.load('Images/02_earthspec1k.jpg'),
    emissiveMap: textureLoader.load('Images/03_earthlights1k.jpg'),
    emissive: 0xffffff,
    emissiveIntensity: 1.2, // Increased night lights visibility
    shininess: 20,
    specular: 0x333333
});

// Earth mesh
const earthGeometry = new THREE.SphereGeometry(2, 128, 128);
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
earthMesh.rotation.z = 0.41;
scene.add(earthMesh);

// Cloud layer
const cloudMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('Images/04_earthcloudmap.jpg'),
    alphaMap: textureLoader.load('Images/05_earthcloudmaptrans.jpg'),
    transparent: true,
    opacity: 0.6,
    metalness: 0.05,
    roughness: 0.7,
    depthWrite: false
});

const cloudGeometry = new THREE.SphereGeometry(2.03, 128, 128);
const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
scene.add(cloudMesh);

// Border atmosphere effect
const atmosphereMaterial = new THREE.ShaderMaterial({
    uniforms: {
        glowColor: { value: new THREE.Color(0x40E0D0) },
        viewVector: { value: camera.position }
    },
    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewDir = -normalize(mvPosition.xyz);
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
            float intensity = 1.2 - dot(vNormal, vViewDir);
            vec3 atmosphere = glowColor * pow(intensity, 3.0);
            gl_FragColor = vec4(atmosphere, pow(intensity, 3.0) * 0.5);
        }
    `,
    side: THREE.FrontSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
});

const atmosphereMesh = new THREE.Mesh(
    new THREE.SphereGeometry(2.08, 128, 128),
    atmosphereMaterial
);
scene.add(atmosphereMesh);

// Star background
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
    depthWrite: false
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.0005;
    
    earthMesh.rotation.y += 0.0008;
    cloudMesh.rotation.y += 0.001;
    atmosphereMesh.rotation.y += 0.0004;
    
    atmosphereMaterial.uniforms.viewVector.value = camera.position;
    
    renderer.render(scene, camera);
}

animate();

// Responsive handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});