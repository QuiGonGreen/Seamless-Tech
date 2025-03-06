// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('.webgl'),
    alpha: true,
    antialias: true
});

// Device detection
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Texture loader
const textureLoader = new THREE.TextureLoader();

// Define colors for the futuristic theme
const COLORS = {
    buildings: 0x260241,  // Dark purple (base color)
    buildingEmissive: 0x5865F2,  // Blue accent color
    cars: [0xb8860b, 0x5865F2, 0xff69b4, 0x32cd32, 0xff4500],  // Gold, blue, pink, green, orange
    rings: 0xb8860b,  // Gold
    ground: 0x260241,  // Dark purple
    lights: 0xffffff   // White
};

// Create space port city
function createSpacePort() {
    const spacePortGroup = new THREE.Group();

    // Ground/base platform
    const groundGeometry = new THREE.CylinderGeometry(15, 15, 0.5, 64);
    const groundMaterial = new THREE.MeshPhongMaterial({
        color: COLORS.ground,
        emissive: COLORS.buildingEmissive,
        emissiveIntensity: 0.2,
        shininess: 30
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.y = -3;
    spacePortGroup.add(ground);

    // Add grid patterns to the ground
    const gridHelper = new THREE.GridHelper(30, 30, 0xb8860b, 0x5865F2);
    gridHelper.position.y = -2.7;
    spacePortGroup.add(gridHelper);

    // Create buildings
    const buildingCount = 50;
    for (let i = 0; i < buildingCount; i++) {
        // Randomize building properties
        const height = Math.random() * 8 + 2;
        const width = Math.random() * 1.5 + 0.5;
        const depth = Math.random() * 1.5 + 0.5;
        
        // Create building with windows
        const building = createBuilding(width, height, depth);
        
        // Position buildings in a circular pattern
        const angle = (i / buildingCount) * Math.PI * 2;
        const radius = Math.random() * 6 + 8;
        building.position.x = Math.cos(angle) * radius;
        building.position.z = Math.sin(angle) * radius;
        building.position.y = -3 + (height / 2);
        
        // Rotate buildings to face center
        building.rotation.y = -angle;
        
        spacePortGroup.add(building);
    }

    // Create central tower (tallest building at center)
    const centralTower = createCentralTower();
    centralTower.position.y = 4;
    spacePortGroup.add(centralTower);

    // Add hovering rings around central tower
    const rings = createHoveringRings();
    rings.position.y = 8;
    spacePortGroup.add(rings);

    // Create flying cars
    const cars = createFlyingCars(30);
    spacePortGroup.add(cars);

    return spacePortGroup;
}

// Create a building with windows
function createBuilding(width, height, depth) {
    const group = new THREE.Group();
    
    // Main building structure
    const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
    const buildingMaterial = new THREE.MeshPhongMaterial({
        color: COLORS.buildings,
        emissive: COLORS.buildingEmissive,
        emissiveIntensity: 0.2,
        shininess: 30
    });
    const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
    group.add(buildingMesh);
    
    // Add windows as small bright cubes
    const windowSize = 0.1;
    const windowGeometry = new THREE.BoxGeometry(windowSize, windowSize, windowSize);
    const windowMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.6
    });
    
    // Determine number of windows based on building size
    const windowsX = Math.floor(width / 0.3);
    const windowsY = Math.floor(height / 0.3);
    const windowsZ = Math.floor(depth / 0.3);
    
    // Place windows on all faces
    for (let x = 0; x < windowsX; x++) {
        for (let y = 0; y < windowsY; y++) {
            // Only add some windows (random pattern)
            if (Math.random() > 0.3) {
                // Front face
                const windowFront = new THREE.Mesh(windowGeometry, windowMaterial);
                windowFront.position.set(
                    (x / windowsX) * width - width / 2 + width / windowsX / 2,
                    (y / windowsY) * height - height / 2 + height / windowsY / 2,
                    depth / 2 + 0.01
                );
                group.add(windowFront);
                
                // Back face
                const windowBack = new THREE.Mesh(windowGeometry, windowMaterial);
                windowBack.position.set(
                    (x / windowsX) * width - width / 2 + width / windowsX / 2,
                    (y / windowsY) * height - height / 2 + height / windowsY / 2,
                    -depth / 2 - 0.01
                );
                group.add(windowBack);
            }
        }
    }
    
    // Side windows
    for (let y = 0; y < windowsY; y++) {
        for (let z = 0; z < windowsZ; z++) {
            if (Math.random() > 0.3) {
                // Right side
                const windowRight = new THREE.Mesh(windowGeometry, windowMaterial);
                windowRight.position.set(
                    width / 2 + 0.01,
                    (y / windowsY) * height - height / 2 + height / windowsY / 2,
                    (z / windowsZ) * depth - depth / 2 + depth / windowsZ / 2
                );
                group.add(windowRight);
                
                // Left side
                const windowLeft = new THREE.Mesh(windowGeometry, windowMaterial);
                windowLeft.position.set(
                    -width / 2 - 0.01,
                    (y / windowsY) * height - height / 2 + height / windowsY / 2,
                    (z / windowsZ) * depth - depth / 2 + depth / windowsZ / 2
                );
                group.add(windowLeft);
            }
        }
    }
    
    return group;
}

// Create central tower
function createCentralTower() {
    const group = new THREE.Group();
    
    // Base structure
    const baseGeometry = new THREE.CylinderGeometry(2, 2.5, 12, 16);
    const baseMaterial = new THREE.MeshPhongMaterial({
        color: COLORS.buildings,
        emissive: COLORS.buildingEmissive,
        emissiveIntensity: 0.4,
        shininess: 50
    });
    const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
    group.add(baseMesh);
    
    // Top dome
    const domeGeometry = new THREE.SphereGeometry(2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMaterial = new THREE.MeshPhongMaterial({
        color: 0x5865F2,
        emissive: 0x5865F2,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.8,
        shininess: 100
    });
    const dome = new THREE.Mesh(domeGeometry, domeMaterial);
    dome.position.y = 6;
    group.add(dome);
    
    // Add windows to the tower
    const windowCount = 40;
    const windowGeometry = new THREE.BoxGeometry(0.15, 0.3, 0.05);
    const windowMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.8
    });
    
    for (let i = 0; i < windowCount; i++) {
        const angle = (i / windowCount) * Math.PI * 2;
        const y = Math.random() * 10 - 5;  // Position windows along height
        
        const window = new THREE.Mesh(windowGeometry, windowMaterial);
        window.position.set(
            Math.cos(angle) * 2,
            y,
            Math.sin(angle) * 2
        );
        window.rotation.y = -angle;
        group.add(window);
    }
    
    // Add antenna at the top
    const antennaGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
    const antennaMaterial = new THREE.MeshPhongMaterial({
        color: 0xb8860b,
        emissive: 0xb8860b,
        emissiveIntensity: 0.3
    });
    const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    antenna.position.y = 8;
    group.add(antenna);
    
    // Add blinking light at antenna top
    const blinkingLightGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const blinkingLightMaterial = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 1
    });
    const blinkingLight = new THREE.Mesh(blinkingLightGeometry, blinkingLightMaterial);
    blinkingLight.position.y = 9.5;
    blinkingLight.userData.isBlinking = true;  // Flag for animation
    group.add(blinkingLight);
    
    return group;
}

// Create hovering rings
function createHoveringRings() {
    const group = new THREE.Group();
    
    const ringCount = 3;
    for (let i = 0; i < ringCount; i++) {
        const radius = 3 + i * 0.8;
        const tubeRadius = 0.08;
        const ringGeometry = new THREE.TorusGeometry(radius, tubeRadius, 16, 100);
        const ringMaterial = new THREE.MeshPhongMaterial({
            color: COLORS.rings,
            emissive: COLORS.rings,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.8,
            shininess: 100
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.userData.rotationSpeed = 0.002 - i * 0.0005;  // Different speed for each ring
        ring.userData.hoverSpeed = 0.001 + i * 0.001;      // Different hover speed
        ring.userData.hoverAmplitude = 0.2 - i * 0.05;     // Different hover amplitude
        ring.userData.hoverOffset = i * Math.PI / 3;       // Phase offset for hovering
        group.add(ring);
    }
    
    return group;
}

// Create flying cars
function createFlyingCars(count) {
    const group = new THREE.Group();
    
    for (let i = 0; i < count; i++) {
        const car = createFlyingCar();
        
        // Set initial position on a random path
        const pathRadius = Math.random() * 10 + 8;
        const height = Math.random() * 10 - 2;
        const angle = Math.random() * Math.PI * 2;
        
        car.position.set(
            Math.cos(angle) * pathRadius,
            height,
            Math.sin(angle) * pathRadius
        );
        
        // Store car animation parameters in userData
        car.userData.pathRadius = pathRadius;
        car.userData.height = height;
        car.userData.speed = Math.random() * 0.01 + 0.005;
        car.userData.angle = angle;
        car.userData.wobbleSpeed = Math.random() * 0.05 + 0.02;
        car.userData.wobbleAmplitude = Math.random() * 0.1 + 0.05;
        car.userData.wobbleOffset = i;
        
        group.add(car);
    }
    
    return group;
}

// Create individual flying car (Jetsons style)
function createFlyingCar() {
    const group = new THREE.Group();
    
    // Choose a random color for the car
    const carColor = COLORS.cars[Math.floor(Math.random() * COLORS.cars.length)];
    
    // Car body (saucer-like shape)
    const bodyGeometry = new THREE.CapsuleGeometry(0.3, 0.4, 4, 8);
    bodyGeometry.rotateZ(Math.PI / 2);  // Rotate to make it horizontal
    
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: carColor,
        emissive: carColor,
        emissiveIntensity: 0.3,
        shininess: 80
    });
    
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    group.add(body);
    
    // Top dome (cockpit)
    const domeGeometry = new THREE.SphereGeometry(0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMaterial = new THREE.MeshPhongMaterial({
        color: 0xadd8e6,  // Light blue
        transparent: true,
        opacity: 0.7,
        shininess: 100
    });
    
    const dome = new THREE.Mesh(domeGeometry, domeMaterial);
    dome.position.y = 0.15;
    group.add(dome);
    
    // Bottom thrusters/hover jets
    const thrusterCount = 3;
    for (let i = 0; i < thrusterCount; i++) {
        const angle = (i / thrusterCount) * Math.PI * 2;
        
        const thrusterGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.1, 8);
        const thrusterMaterial = new THREE.MeshPhongMaterial({
            color: 0x808080,  // Gray
            shininess: 50
        });
        
        const thruster = new THREE.Mesh(thrusterGeometry, thrusterMaterial);
        thruster.position.set(
            Math.cos(angle) * 0.25,
            -0.2,
            Math.sin(angle) * 0.25
        );
        group.add(thruster);
        
        // Add thruster glow
        const glowGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const glowMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ffff,  // Cyan
            emissive: 0x00ffff,
            emissiveIntensity: 1,
            transparent: true,
            opacity: 0.8
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.y = -0.05;
        glow.userData.pulsate = true;  // Mark for animation
        thruster.add(glow);
    }
    
    return group;
}

// Add ambient and directional lighting to the scene
const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xfff4e6, 1.2);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Point light in the center for the central tower
const centerLight = new THREE.PointLight(0x5865F2, 1, 20);
centerLight.position.set(0, 5, 0);
scene.add(centerLight);

// Add space background with stars
const starGeometry = new THREE.BufferGeometry();
const starVertices = [];
for (let i = 0; i < 5000; i++) {
    starVertices.push(
        THREE.MathUtils.randFloatSpread(500),
        THREE.MathUtils.randFloatSpread(500),
        THREE.MathUtils.randFloatSpread(500)
    );
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

const starMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 0.5,
    transparent: true,
    opacity: 0.8,
    depthWrite: false
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Create and add the space port
const spacePort = createSpacePort();
scene.add(spacePort);

// Position camera
camera.position.set(0, 8, 20);
camera.lookAt(0, 0, 0);

// Animation variables
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

// Add mouse move event listener to move camera slightly with mouse
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) / 100;
    mouseY = (event.clientY - windowHalfY) / 100;
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
    // Rotate entire space port slowly
    spacePort.rotation.y += 0.0005;
    
    // Animate stars (subtle rotation)
    stars.rotation.y += 0.0001;
    stars.rotation.x += 0.0001;
    
    // Animate hovering rings
    spacePort.children.forEach(child => {
        if (child.children && child.children.length > 0) {
            child.children.forEach(subChild => {
                // Animate rings
                if (subChild.userData.rotationSpeed) {
                    subChild.rotation.z += subChild.userData.rotationSpeed;
                    subChild.position.y = subChild.userData.hoverAmplitude * 
                        Math.sin(time * subChild.userData.hoverSpeed + subChild.userData.hoverOffset);
                }
                
                // Animate blinking lights
                if (subChild.userData.isBlinking) {
                    subChild.material.emissiveIntensity = 0.5 + 0.5 * Math.sin(time * 5);
                }
            });
        }
    });
    
    // Animate flying cars
    spacePort.children.forEach(child => {
        if (child.userData.pathRadius) {
            // Update car position along path
            child.userData.angle += child.userData.speed;
            
            // Calculate new position on the path
            child.position.x = Math.cos(child.userData.angle) * child.userData.pathRadius;
            child.position.z = Math.sin(child.userData.angle) * child.userData.pathRadius;
            
            // Make cars wobble/hover
            child.position.y = child.userData.height + 
                child.userData.wobbleAmplitude * 
                Math.sin(time * child.userData.wobbleSpeed + child.userData.wobbleOffset);
            
            // Rotate car to face direction of movement
            child.rotation.y = -child.userData.angle + Math.PI / 2;
            
            // Slight banking on turns
            child.rotation.z = Math.sin(time * child.userData.wobbleSpeed * 2) * 0.1;
            
            // Animate thruster glows
            child.children.forEach(part => {
                if (part.children) {
                    part.children.forEach(glow => {
                        if (glow.userData.pulsate) {
                            glow.scale.setScalar(0.8 + 0.3 * Math.sin(time * 10 + child.userData.wobbleOffset));
                        }
                    });
                }
            });
        }
    });
    
    // Smooth camera movement with mouse
    targetX = mouseX * 0.5;
    targetY = mouseY * 0.5;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    // Render scene
    renderer.render(scene, camera);
}

// Start animation
animate();

// Responsive handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});