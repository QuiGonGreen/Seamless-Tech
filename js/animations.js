// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing Three.js animation...");
    
    // Check if the canvas exists before initializing Three.js
    const canvas = document.querySelector('.webgl');
    if (!canvas) {
        console.error("Canvas element with class 'webgl' not found!");
        return;
    }
    
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });

    // Device detection
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    console.log("Mobile device detected:", isMobile);

    // Set renderer size and pixel ratio
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Texture loader
    const textureLoader = new THREE.TextureLoader();

    // Define colors for the Jetsons-inspired futuristic theme
    const COLORS = {
        buildings: 0x6baed6,  // Light blue base
        buildingEmissive: 0x4292c6, // Emissive blue glow
        cars: [0xff5252, 0x2196f3, 0xffeb3b, 0x4caf50, 0xff9800], // Red, blue, yellow, green, orange
        rings: 0x42a5f5,  // Bright blue
        ground: 0x0d47a1,  // Deep blue
        highlights: 0x64ffda,  // Aqua highlight
        windows: 0xbbdefb   // Light blue windows
    };

    // Create space port city - Jetsons Style
    function createSpacePort() {
        const spacePortGroup = new THREE.Group();

        // Ground/base platform - more space-age style
        const groundGeometry = new THREE.CylinderGeometry(18, 20, 1, 64);
        const groundMaterial = new THREE.MeshPhongMaterial({
            color: COLORS.ground,
            emissive: COLORS.buildingEmissive,
            emissiveIntensity: 0.2,
            shininess: 80
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.position.y = -3;
        spacePortGroup.add(ground);

        // Add futuristic concentric rings to the ground
        for (let i = 0; i < 5; i++) {
            const ringGeometry = new THREE.RingGeometry(3 + i * 3, 3 + i * 3 + 0.2, 64);
            const ringMaterial = new THREE.MeshPhongMaterial({
                color: COLORS.highlights,
                side: THREE.DoubleSide,
                emissive: COLORS.highlights,
                emissiveIntensity: 0.5
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = -Math.PI / 2;
            ring.position.y = -2.9;
            spacePortGroup.add(ring);
        }

        // Create retro-futuristic Jetsons-style buildings
        createJetsonsBuildings(spacePortGroup);
        
        // Create central tower - iconic space needle style
        const centralTower = createCentralTower();
        centralTower.position.y = 4;
        spacePortGroup.add(centralTower);

        // Add hovering rings around central tower
        const rings = createHoveringRings();
        rings.position.y = 8;
        spacePortGroup.add(rings);

        // Create flying cars - Jetsons style with bubble tops
        // Reduce count for mobile devices
        const carCount = isMobile ? 8 : 15;
        const cars = createFlyingCars(carCount);
        spacePortGroup.add(cars);

        return spacePortGroup;
    }

    // Create Jetsons-style buildings with thin supports and bubble-like tops
    function createJetsonsBuildings(parentGroup) {
        // Reduce building count for mobile devices
        const buildingCount = isMobile ? 25 : 40;
        const buildingPositions = [];
        
        for (let i = 0; i < buildingCount; i++) {
            // Determine building height and style variations
            const height = Math.random() * 5 + 2;
            const radius = Math.random() * 0.8 + 0.5;
            
            // Create a group for the building
            const building = new THREE.Group();
            
            // Create thin support column
            const supportGeometry = new THREE.CylinderGeometry(0.1, 0.1, height, 8);
            const supportMaterial = new THREE.MeshPhongMaterial({
                color: 0xd3d3d3,  // Light gray
                shininess: 50
            });
            const support = new THREE.Mesh(supportGeometry, supportMaterial);
            support.position.y = height / 2;
            building.add(support);
            
            // Create building top - bubble or saucer shaped
            let topGeometry;
            if (Math.random() > 0.5) {
                // Saucer shaped
                topGeometry = new THREE.CapsuleGeometry(radius, radius * 0.5, 16, 8);
                topGeometry.rotateZ(Math.PI / 2);
            } else {
                // Bubble dome
                topGeometry = new THREE.SphereGeometry(radius, 16, 16);
            }
            
            const topMaterial = new THREE.MeshPhongMaterial({
                color: COLORS.buildings,
                transparent: true,
                opacity: 0.9,
                emissive: COLORS.buildingEmissive,
                emissiveIntensity: 0.3,
                shininess: 90
            });
            
            const top = new THREE.Mesh(topGeometry, topMaterial);
            top.position.y = height;
            building.add(top);
            
            // Add windows as glowing dots
            addBuildingWindows(top, radius);
            
            // Position buildings in a circular pattern with variation
            const angle = (i / buildingCount) * Math.PI * 2;
            const buildingRadius = Math.random() * 5 + 10;
            
            // Check for overlap with existing buildings
            let overlap = false;
            const newPos = {
                x: Math.cos(angle) * buildingRadius,
                z: Math.sin(angle) * buildingRadius
            };
            
            for (const pos of buildingPositions) {
                const dist = Math.sqrt(
                    Math.pow(newPos.x - pos.x, 2) + 
                    Math.pow(newPos.z - pos.z, 2)
                );
                if (dist < 2.5) {
                    overlap = true;
                    break;
                }
            }
            
            if (!overlap) {
                building.position.set(newPos.x, -3, newPos.z);
                buildingPositions.push(newPos);
                parentGroup.add(building);
            }
        }
    }

    // Add windows to buildings
    function addBuildingWindows(buildingTop, radius) {
        // Reduce window count for mobile devices
        const windowCount = Math.floor(radius * (isMobile ? 10 : 20));
        const windowGeometry = new THREE.SphereGeometry(0.06, 8, 8);
        const windowMaterial = new THREE.MeshPhongMaterial({
            color: COLORS.windows,
            emissive: COLORS.windows,
            emissiveIntensity: 0.7
        });
        
        for (let i = 0; i < windowCount; i++) {
            if (Math.random() > 0.5) {
                const phi = Math.acos(-1 + (2 * Math.random()));
                const theta = 2 * Math.PI * Math.random();
                
                const x = radius * 0.9 * Math.sin(phi) * Math.cos(theta);
                const y = radius * 0.9 * Math.sin(phi) * Math.sin(theta);
                const z = radius * 0.9 * Math.cos(phi);
                
                const window = new THREE.Mesh(windowGeometry, windowMaterial);
                window.position.set(x, y, z);
                buildingTop.add(window);
            }
        }
    }

    // Create central tower - Space Needle inspired
    function createCentralTower() {
        const group = new THREE.Group();
        
        // Thin support column
        const columnGeometry = new THREE.CylinderGeometry(0.2, 0.3, 12, 16);
        const columnMaterial = new THREE.MeshPhongMaterial({
            color: 0xe0e0e0,  // Silver
            emissive: 0x303030,
            emissiveIntensity: 0.2,
            metalness: 0.7,
            shininess: 80
        });
        const column = new THREE.Mesh(columnGeometry, columnMaterial);
        group.add(column);
        
        // Saucer/dish at the top - Jetsons iconic shape
        const saucerGeometry = new THREE.CapsuleGeometry(3, 0.8, 20, 16);
        saucerGeometry.rotateZ(Math.PI / 2);
        const saucerMaterial = new THREE.MeshPhongMaterial({
            color: COLORS.buildings,
            emissive: COLORS.buildingEmissive,
            emissiveIntensity: 0.4,
            transparent: true,
            opacity: 0.9,
            shininess: 100
        });
        const saucer = new THREE.Mesh(saucerGeometry, saucerMaterial);
        saucer.position.y = 6;
        group.add(saucer);
        
        // Add windows around the saucer edge
        const windowCount = 24;
        const windowGeometry = new THREE.SphereGeometry(0.12, 8, 8);
        const windowMaterial = new THREE.MeshPhongMaterial({
            color: COLORS.windows,
            emissive: COLORS.windows,
            emissiveIntensity: 0.8
        });
        
        for (let i = 0; i < windowCount; i++) {
            const angle = (i / windowCount) * Math.PI * 2;
            
            const window = new THREE.Mesh(windowGeometry, windowMaterial);
            window.position.set(
                Math.cos(angle) * 2.7,
                6,
                Math.sin(angle) * 2.7
            );
            group.add(window);
        }
        
        // Add antenna at the top
        const antennaGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
        const antennaMaterial = new THREE.MeshPhongMaterial({
            color: 0xf5f5f5,  // White
            emissive: 0xff0000,
            emissiveIntensity: 0.3
        });
        const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
        antenna.position.y = 7.5;
        group.add(antenna);
        
        // Add blinking light at antenna top
        const blinkingLightGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const blinkingLightMaterial = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 1
        });
        const blinkingLight = new THREE.Mesh(blinkingLightGeometry, blinkingLightMaterial);
        blinkingLight.position.y = 8.5;
        blinkingLight.userData.isBlinking = true;  // Flag for animation
        group.add(blinkingLight);
        
        return group;
    }

    // Create hovering rings
    function createHoveringRings() {
        const group = new THREE.Group();
        
        const ringCount = 3;
        for (let i = 0; i < ringCount; i++) {
            const radius = 3.5 + i * 0.7;
            const tubeRadius = 0.06;
            const ringGeometry = new THREE.TorusGeometry(radius, tubeRadius, 16, 100);
            const ringMaterial = new THREE.MeshPhongMaterial({
                color: COLORS.rings,
                emissive: COLORS.rings,
                emissiveIntensity: 0.6,
                transparent: true,
                opacity: 0.8,
                shininess: 100
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            ring.userData.rotationSpeed = 0.002 - i * 0.0005;  // Different speed for each ring
            ring.userData.hoverSpeed = 0.001 + i * 0.001;      // Different hover speed
            ring.userData.hoverAmplitude = 0.1 - i * 0.02;     // Different hover amplitude
            ring.userData.hoverOffset = i * Math.PI / 3;       // Phase offset for hovering
            group.add(ring);
        }
        
        return group;
    }

    // Create flying cars - classic Jetsons style
    function createFlyingCars(count) {
        const group = new THREE.Group();
        
        // Define car paths with different heights and radiuses
        const paths = [
            { radius: 12, height: 3, clockwise: true },
            { radius: 8, height: 5, clockwise: false },
            { radius: 15, height: 2, clockwise: true },
            { radius: 22, height: 8, clockwise: true },
            { radius: 18, height: 6, clockwise: false }
        ];
        
        for (let i = 0; i < count; i++) {
            const car = createJetsonsCar();
            
            // Assign to a path
            const pathIndex = i % paths.length;
            const path = paths[pathIndex];
            
            // Set initial position on path
            const offset = (i * Math.PI * 2) / (count / paths.length);
            const angle = path.clockwise ? offset : -offset;
            
            car.position.set(
                Math.cos(angle) * path.radius,
                path.height,
                Math.sin(angle) * path.radius
            );
            
            // Store car animation parameters in userData
            car.userData.pathRadius = path.radius;
            car.userData.height = path.height;
            car.userData.speed = 0.01 + Math.random() * 0.01;
            car.userData.clockwise = path.clockwise;
            car.userData.angle = angle;
            car.userData.wobbleSpeed = 0.01 + Math.random() * 0.03;
            car.userData.wobbleAmplitude = 0.05 + Math.random() * 0.05;
            car.userData.tailLength = 5 + Math.floor(Math.random() * 8);
            
            // Create trailing effect for each car
            car.userData.trail = createCarTrail(car.userData.tailLength, car.children[0].material.color);
            group.add(car.userData.trail);
            
            group.add(car);
        }
        
        return group;
    }

    // Create individual Jetsons-style flying car
    function createJetsonsCar() {
        const group = new THREE.Group();
        
        // Choose a random color for the car
        const carColorIndex = Math.floor(Math.random() * COLORS.cars.length);
        const carColor = COLORS.cars[carColorIndex];
        
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
        
        // Bubble dome (classic Jetsons style)
        const domeGeometry = new THREE.SphereGeometry(0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const domeMaterial = new THREE.MeshPhongMaterial({
            color: 0xadd8e6,  // Light blue
            transparent: true,
            opacity: 0.6,
            shininess: 100
        });
        
        const dome = new THREE.Mesh(domeGeometry, domeMaterial);
        dome.position.y = 0.15;
        group.add(dome);
        
        // Add tiny figures inside (simplified)
        const figureGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const figureMaterial = new THREE.MeshPhongMaterial({
            color: 0x333333  // Dark gray
        });
        const figure = new THREE.Mesh(figureGeometry, figureMaterial);
        figure.position.set(0, 0.05, 0);
        dome.add(figure);
        
        // Bottom thrusters glow
        const glowGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const glowMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ffff,  // Cyan
            emissive: 0x00ffff,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.6
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.y = -0.2;
        glow.scale.y = 0.5;
        glow.userData.pulsate = true;
        group.add(glow);
        
        return group;
    }

    // Create trailing effect behind cars
    function createCarTrail(length, color) {
        const trail = new THREE.Group();
        
        const trailMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.4
        });
        
        for (let i = 0; i < length; i++) {
            const size = 0.08 - (i * 0.01);
            const sphereGeometry = new THREE.SphereGeometry(Math.max(0.02, size), 8, 8);
            const sphere = new THREE.Mesh(sphereGeometry, trailMaterial.clone());
            sphere.material.opacity = 0.4 - (i * 0.05);
            trail.add(sphere);
        }
        
        return trail;
    }

    // Add ambient and directional lighting to the scene
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xfff4e6, 1.2);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Point light in the center for the central tower
    const centerLight = new THREE.PointLight(COLORS.buildingEmissive, 1, 20);
    centerLight.position.set(0, 5, 0);
    scene.add(centerLight);

    // Add space background with stars - reduce count for mobile
    const starCount = isMobile ? 1500 : 3000;
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    for (let i = 0; i < starCount; i++) {
        starVertices.push(
            THREE.MathUtils.randFloatSpread(500),
            THREE.MathUtils.randFloatSpread(500),
            THREE.MathUtils.randFloatSpread(500)
        );
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    const starMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: isMobile ? 0.8 : 0.5,  // Bigger stars on mobile
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

    // Car positions history for trails
    const carHistory = [];

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
        
        // Animate flying cars and their trails
        spacePort.children.forEach(child => {
            if (child.userData.pathRadius) {
                // Update car position along path
                child.userData.angle += child.userData.clockwise ? 
                    child.userData.speed : -child.userData.speed;
                
                // Calculate new position on the path
                child.position.x = Math.cos(child.userData.angle) * child.userData.pathRadius;
                child.position.z = Math.sin(child.userData.angle) * child.userData.pathRadius;
                
                // Make cars wobble/hover
                child.position.y = child.userData.height + 
                    child.userData.wobbleAmplitude * 
                    Math.sin(time * child.userData.wobbleSpeed + child.userData.angle);
                
                // Rotate car to face direction of movement
                child.rotation.y = -child.userData.angle + Math.PI / 2;
                
                // Slight banking on turns
                child.rotation.z = Math.sin(time * child.userData.wobbleSpeed * 2) * 0.2;
                
                // Update car trail
                if (child.userData.trail) {
                    const trail = child.userData.trail;
                    for (let i = trail.children.length - 1; i > 0; i--) {
                        trail.children[i].position.copy(trail.children[i-1].position);
                    }
                    trail.children[0].position.copy(child.position);
                    trail.children[0].position.y -= 0.1;
                }
                
                // Animate thruster glow
                child.children.forEach(part => {
                    if (part.userData.pulsate) {
                        part.scale.x = 1 + 0.2 * Math.sin(time * 10);
                        part.scale.z = 1 + 0.2 * Math.sin(time * 10);
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
    
    // Hide loading screen once everything is initialized
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    }
    
    console.log("Three.js animation initialized successfully!");
});