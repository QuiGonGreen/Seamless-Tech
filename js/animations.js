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

// Texture loader with NPOT handling
const textureLoader = new THREE.TextureLoader();
const createNPOTTexture = (path) => {
    const texture = textureLoader.load(path);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.LinearFilter;
    return texture;
};

// Improved lighting setup
const directionalLight = new THREE.DirectionalLight(0xfff4e6, 2.5);
directionalLight.position.set(5, 3, 2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
scene.add(ambientLight);

// Earth material with corrected texture handling
const earthMaterial = new THREE.MeshPhongMaterial({
    map: createNPOTTexture('Images/00_earthmap1k.jpg'),
    normalMap: createNPOTTexture('Images/01_earthbump1k.jpg'),
    specularMap: createNPOTTexture('Images/02_earthspec1k.jpg'),
    emissiveMap: createNPOTTexture('Images/03_earthlights1k.jpg'),
    emissive: 0xffffff,
    emissiveIntensity: 0.7,
    shininess: 15,
    specular: 0x222222,
    bumpScale: 0.04
});

// Earth mesh with corrected geometry
const earthGeometry = new THREE.SphereGeometry(2, 128, 128);
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
earthMesh.rotation.z = 0.41;
scene.add(earthMesh);

// Improved cloud material
const cloudMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('Images/04_earthcloudmap.jpg'),
    alphaMap: textureLoader.load('Images/05_earthcloudmaptrans.jpg'),
    transparent: true,
    opacity: 0.35,
    metalness: 0.0,
    roughness: 0.9,
    depthWrite: false,
    blending: THREE.CustomBlending
});

const cloudGeometry = new THREE.SphereGeometry(2.02, 128, 128);
const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
scene.add(cloudMesh);

// Atmosphere shader adjustments
const atmosphereMaterial = new THREE.ShaderMaterial({
    uniforms: {
        glowColor: { value: new THREE.Color(0x40E0D0) },
        viewVector: { value: camera.position },
        power: { value: 1.2 }
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
        uniform float power;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
            float intensity = power - dot(vNormal, vViewDir);
            vec3 atmosphere = glowColor * pow(intensity, 2.5);
            gl_FragColor = vec4(atmosphere, pow(intensity, 2.5) * 0.25);
        }
    `,
    side: THREE.FrontSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
});

const atmosphereMesh = new THREE.Mesh(
    new THREE.SphereGeometry(2.06, 128, 128),
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

// Animation loop with dynamic lighting
function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.0005;
    
    // Smooth Earth rotation
    earthMesh.rotation.y += 0.0008;
    cloudMesh.rotation.y += 0.001;
    
    // Dynamic light movement
    directionalLight.position.x = Math.sin(time) * 6;
    directionalLight.position.z = Math.cos(time) * 6;
    
    // Update atmosphere shader
    atmosphereMaterial.uniforms.viewVector.value.copy(camera.position);
    
    renderer.render(scene, camera);
}

animate();

// Responsive handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});