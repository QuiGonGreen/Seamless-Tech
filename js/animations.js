// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('.webgl'),
    alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Load the logo texture
const textureLoader = new THREE.TextureLoader();
const logoTexture = textureLoader.load('Images/logo.png');

// Create a plane geometry for the logo
const geometry = new THREE.PlaneGeometry(3, 3);

// Create a shader material for the hologram effect
const material = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uTexture: { value: logoTexture }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uTime;
        uniform sampler2D uTexture;
        varying vec2 vUv;
        void main() {
            vec2 uv = vUv;
            uv.y += sin(uv.x * 10.0 + uTime * 5.0) * 0.05;
            vec4 color = texture2D(uTexture, uv);
            float scanline = sin(uv.y * 100.0 + uTime * 10.0) * 0.1;
            color.rgb += scanline;
            gl_FragColor = color;
        }
    `,
    transparent: true
});

const logoMesh = new THREE.Mesh(geometry, material);
scene.add(logoMesh);

camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    material.uniforms.uTime.value += 0.05;
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});