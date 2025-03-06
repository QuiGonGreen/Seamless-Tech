// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the canvas from the landing section
    const canvas = document.querySelector('.webgl');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }

    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Get 2D context for drawing
    const ctx = canvas.getContext('2d');
    
    // Check if device is mobile for performance optimizations
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Animation configuration
    const config = {
        // Colors in The Jetsons style
        colors: {
            background: '#140033',      // Deep space purple
            stars: '#FFFFFF',           // White stars
            buildingLight: '#64DFDF',   // Teal/aqua building lights
            buildingDark: '#5390D9',    // Blue building base
            saucerLight: '#FFCFD2',     // Light pink for flying saucers
            saucerDark: '#FB6F92',      // Dark pink for flying saucers
            platformColor: '#5F56E8',   // Purple for main platform
            platformEdge: '#A682FF',    // Light purple for platform edge
            supportColor: '#7678ED',    // Support column color
            domeColor: '#7400B8',       // Purple for dome tops
            glowColor: '#4EA8DE',       // Blue glow
            rocketTrail: '#FF9E00'      // Orange for rocket trails
        },
        // Animation settings
        animation: {
            starCount: isMobile ? 80 : 150,       // Fewer stars on mobile
            buildingCount: isMobile ? 12 : 18,    // Fewer buildings on mobile
            saucerCount: isMobile ? 4 : 8,        // Fewer flying saucers on mobile
            cloudCount: isMobile ? 3 : 6          // Fewer clouds on mobile
        },
        // Performance settings
        performance: {
            pixelSize: isMobile ? 4 : 2,          // Larger pixels (more 8-bit) on mobile
            frameSkip: isMobile ? 2 : 1           // Skip frames on mobile for better performance
        }
    };
    
    // Objects for animation
    let stars = [];
    let buildings = [];
    let saucers = [];
    let clouds = [];
    let frameCount = 0;
    
    // Platform configuration
    const platform = {
        x: canvas.width / 2,
        y: canvas.height * 0.65,
        radius: isMobile ? canvas.width * 0.4 : canvas.width * 0.3,
        supportWidth: isMobile ? 30 : 40,
        hoverAmount: 2,
        hoverSpeed: 0.3
    };
    
    // Initialize stars
    function initStars() {
        stars = [];
        for (let i = 0; i < config.animation.starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height * 0.7, // Stars only in the upper 70% of screen
                size: Math.random() * 2 + 1,
                twinkle: Math.random() * 0.05 + 0.01,
                twinkleOffset: Math.random() * Math.PI * 2
            });
        }
    }
    
    // Initialize buildings on the circular platform - Jetsons-style bubble topped buildings
    function initBuildings() {
        buildings = [];
        const platformRadius = platform.radius * 0.85; // Buildings stay within platform radius
        
        for (let i = 0; i < config.animation.buildingCount; i++) {
            // Distribute buildings in a circular pattern
            const angle = (i / config.animation.buildingCount) * Math.PI * 2;
            
            // Random radius between 30% and 90% of platform radius
            const radius = (Math.random() * 0.6 + 0.3) * platformRadius;
            
            // Calculate x and y position on the platform
            const x = platform.x + Math.cos(angle) * radius;
            const y = platform.y + Math.sin(angle) * radius;
            
            // Different heights for variety
            const heightFactor = Math.random() * 0.2 + 0.1;
            const height = canvas.height * heightFactor;
            
            // Building dimensions
            const buildingWidth = (15 + Math.random() * 15) * config.performance.pixelSize;
            
            // Some buildings have animated lights
            const hasLight = Math.random() > 0.3;
            
            buildings.push({
                x: x,
                y: y,
                height: height,
                width: buildingWidth,
                hasLight: hasLight,
                lightBlinkRate: Math.random() * 0.1 + 0.02,
                topShape: Math.random() > 0.5 ? 'dome' : 'ufo', // Two building top shapes
                hoverOffset: Math.random() * Math.PI * 2, // For hover animation
                hoverAmount: Math.random() * 2 + 1 // How much it hovers up/down
            });
        }
        
        // Sort by height so taller buildings are drawn in back
        buildings.sort((a, b) => b.height - a.height);
    }
    
    // Initialize flying saucers (Jetsons-style flying cars)
    function initSaucers() {
        saucers = [];
        for (let i = 0; i < config.animation.saucerCount; i++) {
            saucers.push({
                x: Math.random() * canvas.width,
                y: Math.random() * (canvas.height * 0.6),
                size: (Math.random() * 10 + 15) * config.performance.pixelSize,
                speed: (Math.random() * 1 + 0.5) * (Math.random() > 0.5 ? 1 : -1),
                hoverOffset: Math.random() * Math.PI * 2,
                hoverAmount: Math.random() * 2 + 1,
                trail: [] // Array to store trail positions
            });
        }
    }
    
    // Initialize clouds (stylized 8-bit clouds)
    function initClouds() {
        clouds = [];
        for (let i = 0; i < config.animation.cloudCount; i++) {
            clouds.push({
                x: Math.random() * canvas.width,
                y: Math.random() * (canvas.height * 0.3) + 50,
                width: (Math.random() * 80 + 60) * config.performance.pixelSize,
                height: (Math.random() * 20 + 20) * config.performance.pixelSize,
                speed: (Math.random() * 0.3 + 0.1) * (Math.random() > 0.5 ? 1 : -1)
            });
        }
    }
    
    // Draw an 8-bit star
    function drawStar(x, y, size, alpha) {
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        // For true 8-bit feel, we use rectangles, not circles
        ctx.fillRect(
            Math.floor(x / config.performance.pixelSize) * config.performance.pixelSize, 
            Math.floor(y / config.performance.pixelSize) * config.performance.pixelSize, 
            size * config.performance.pixelSize, 
            size * config.performance.pixelSize
        );
    }
    
    // Draw the central platform with support column
    function drawPlatform(time) {
        // Add hover effect to platform
        const hoverY = Math.sin(time * platform.hoverSpeed) * platform.hoverAmount;
        const platformY = platform.y + hoverY;
        
        // Draw support column
        ctx.fillStyle = config.colors.supportColor;
        ctx.fillRect(
            platform.x - platform.supportWidth / 2,
            platformY,
            platform.supportWidth,
            canvas.height - platformY
        );
        
        // Draw platform - main circle
        ctx.fillStyle = config.colors.platformColor;
        ctx.beginPath();
        ctx.arc(
            platform.x,
            platformY,
            platform.radius,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Draw platform edge highlight
        ctx.strokeStyle = config.colors.platformEdge;
        ctx.lineWidth = 4 * config.performance.pixelSize;
        ctx.beginPath();
        ctx.arc(
            platform.x,
            platformY,
            platform.radius,
            0,
            Math.PI * 2
        );
        ctx.stroke();
        
        // Draw platform top surface details - concentric rings
        for (let i = 1; i <= 3; i++) {
            const ringRadius = platform.radius * (0.3 * i);
            ctx.strokeStyle = `rgba(166, 130, 255, ${0.3 - i * 0.08})`;
            ctx.lineWidth = 2 * config.performance.pixelSize;
            ctx.beginPath();
            ctx.arc(
                platform.x,
                platformY,
                ringRadius,
                0,
                Math.PI * 2
            );
            ctx.stroke();
        }
    }
    
    // Draw Jetsons-style building on the platform
    function drawBuilding(building, time) {
        // Calculate hover effect for building
        const hoverY = Math.sin(time + building.hoverOffset) * building.hoverAmount;
        
        // Draw the building base
        ctx.fillStyle = config.colors.buildingDark;
        
        // Buildings grow upward from the platform
        const baseHeight = building.height;
        const baseWidth = building.width;
        
        // Draw the building as a rectangle topped with dome or UFO shape
        ctx.fillRect(
            Math.floor((building.x - baseWidth / 2) / config.performance.pixelSize) * config.performance.pixelSize,
            Math.floor((building.y - baseHeight - hoverY) / config.performance.pixelSize) * config.performance.pixelSize,
            baseWidth,
            baseHeight
        );
        
        // Draw the building top (dome or UFO shape)
        const topY = building.y - baseHeight - hoverY;
        
        if (building.topShape === 'dome') {
            // Draw dome
            ctx.fillStyle = config.colors.domeColor;
            ctx.beginPath();
            ctx.arc(
                building.x,
                topY,
                baseWidth / 2,
                Math.PI,
                0
            );
            ctx.fill();
            
            // Draw windows if this building has them
            if (building.hasLight) {
                const lightOn = Math.sin(time * building.lightBlinkRate) > 0;
                ctx.fillStyle = lightOn ? config.colors.buildingLight : 'rgba(100, 223, 223, 0.3)';
                
                // Draw windows on the building
                const windowRows = 3;
                const windowCols = 2;
                const windowSize = baseWidth / 5;
                const windowSpacing = baseHeight / (windowRows + 1);
                
                for (let row = 0; row < windowRows; row++) {
                    for (let col = 0; col < windowCols; col++) {
                        const windowX = building.x - baseWidth / 4 + col * baseWidth / 2;
                        const windowY = building.y - baseHeight + (row + 1) * windowSpacing - hoverY;
                        
                        ctx.fillRect(
                            Math.floor(windowX / config.performance.pixelSize) * config.performance.pixelSize,
                            Math.floor(windowY / config.performance.pixelSize) * config.performance.pixelSize,
                            windowSize,
                            windowSize
                        );
                    }
                }
            }
        } else {
            // Draw UFO shaped top
            ctx.fillStyle = config.colors.domeColor;
            
            // Draw UFO disk
            ctx.beginPath();
            ctx.ellipse(
                building.x,
                topY,
                baseWidth / 2,
                baseWidth / 4,
                0,
                0,
                Math.PI * 2
            );
            ctx.fill();
            
            // Draw windows around the edge
            if (building.hasLight) {
                const lightOn = Math.sin(time * building.lightBlinkRate) > 0;
                ctx.fillStyle = lightOn ? config.colors.buildingLight : 'rgba(100, 223, 223, 0.3)';
                
                const windowCount = 6;
                const windowSize = baseWidth / 6;
                
                for (let i = 0; i < windowCount; i++) {
                    const angle = (i / windowCount) * Math.PI * 2;
                    const windowX = building.x + Math.cos(angle) * (baseWidth / 2 - windowSize / 2);
                    const windowY = topY + Math.sin(angle) * (baseWidth / 4 - windowSize / 2);
                    
                    ctx.fillRect(
                        Math.floor(windowX / config.performance.pixelSize) * config.performance.pixelSize,
                        Math.floor(windowY / config.performance.pixelSize) * config.performance.pixelSize,
                        windowSize,
                        windowSize
                    );
                }
            }
        }
    }
    
    // Draw a flying saucer (Jetsons-style)
    function drawSaucer(saucer, time) {
        // Calculate hover effect
        const hoverY = Math.sin(time + saucer.hoverOffset) * saucer.hoverAmount;
        const y = saucer.y + hoverY;
        
        // Draw the saucer trails
        const trailLength = 8;
        if (saucer.trail.length > trailLength) {
            saucer.trail = saucer.trail.slice(-trailLength);
        }
        
        // Add current position to trail
        saucer.trail.push({x: saucer.x, y});
        
        // Draw the trail
        for (let i = 0; i < saucer.trail.length; i++) {
            const alpha = i / saucer.trail.length;
            const trailSize = (saucer.size / 5) * alpha;
            
            ctx.fillStyle = `rgba(255, 158, 0, ${alpha * 0.7})`;
            ctx.fillRect(
                Math.floor(saucer.trail[i].x / config.performance.pixelSize) * config.performance.pixelSize,
                Math.floor((saucer.trail[i].y + saucer.size / 3) / config.performance.pixelSize) * config.performance.pixelSize,
                trailSize,
                trailSize
            );
        }
        
        // Draw the saucer bottom
        ctx.fillStyle = config.colors.saucerDark;
        ctx.beginPath();
        ctx.ellipse(
            saucer.x,
            y,
            saucer.size / 2,
            saucer.size / 6,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Draw the cockpit dome
        ctx.fillStyle = config.colors.saucerLight;
        ctx.beginPath();
        ctx.arc(
            saucer.x,
            y - saucer.size / 6,
            saucer.size / 4,
            Math.PI,
            0
        );
        ctx.fill();
        
        // Draw pilot (simplified as a small rectangle)
        ctx.fillStyle = '#333333';
        ctx.fillRect(
            Math.floor(saucer.x / config.performance.pixelSize) * config.performance.pixelSize - saucer.size / 12,
            Math.floor((y - saucer.size / 6) / config.performance.pixelSize) * config.performance.pixelSize,
            saucer.size / 6,
            saucer.size / 12
        );
        
        // Add glow under the saucer
        ctx.fillStyle = `rgba(78, 168, 222, 0.5)`;
        ctx.beginPath();
        ctx.ellipse(
            saucer.x,
            y + saucer.size / 8,
            saucer.size / 3,
            saucer.size / 8,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
    
    // Draw stylized 8-bit cloud
    function drawCloud(cloud) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        
        // Draw main cloud body
        const x = Math.floor(cloud.x / config.performance.pixelSize) * config.performance.pixelSize;
        const y = Math.floor(cloud.y / config.performance.pixelSize) * config.performance.pixelSize;
        const width = Math.floor(cloud.width / config.performance.pixelSize) * config.performance.pixelSize;
        const height = Math.floor(cloud.height / config.performance.pixelSize) * config.performance.pixelSize;
        
        // Draw cloud as a series of circles for 8-bit cloud look
        const segments = 5;
        const segmentWidth = width / segments;
        
        for (let i = 0; i < segments; i++) {
            const segX = x + i * segmentWidth;
            const segHeight = height * (0.6 + Math.sin(i / segments * Math.PI) * 0.4);
            
            ctx.fillRect(
                segX,
                y - segHeight / 2,
                segmentWidth,
                segHeight
            );
        }
    }
    
    // Draw background with gradient
    function drawBackground() {
        // Create a gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#000033');   // Dark blue at top
        gradient.addColorStop(0.5, '#140033'); // Purple in middle
        gradient.addColorStop(1, '#290033');   // Dark magenta at bottom
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Animate all elements
    function animate() {
        frameCount++;
        
        // Skip frames on mobile for performance
        if (frameCount % config.performance.frameSkip !== 0) {
            requestAnimationFrame(animate);
            return;
        }
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate time for animations
        const time = Date.now() * 0.001;
        
        // Draw background
        drawBackground();
        
        // Draw stars with twinkling effect
        stars.forEach(star => {
            const twinkleAmount = Math.sin(time * star.twinkle + star.twinkleOffset) * 0.5 + 0.5;
            drawStar(star.x, star.y, star.size, 0.3 + twinkleAmount * 0.7);
        });
        
        // Draw clouds
        clouds.forEach(cloud => {
            // Move cloud
            cloud.x += cloud.speed;
            
            // Wrap around screen
            if (cloud.x > canvas.width + cloud.width / 2) {
                cloud.x = -cloud.width / 2;
            } else if (cloud.x < -cloud.width / 2) {
                cloud.x = canvas.width + cloud.width / 2;
            }
            
            // Draw the cloud
            drawCloud(cloud);
        });
        
        // Draw platform and support
        drawPlatform(time);
        
        // Draw buildings on platform
        buildings.forEach(building => {
            drawBuilding(building, time);
        });
        
        // Draw flying saucers
        saucers.forEach(saucer => {
            // Move saucer
            saucer.x += saucer.speed;
            
            // Wrap around screen
            if (saucer.x > canvas.width + saucer.size / 2) {
                saucer.x = -saucer.size / 2;
                saucer.trail = []; // Clear trail when wrapping
            } else if (saucer.x < -saucer.size / 2) {
                saucer.x = canvas.width + saucer.size / 2;
                saucer.trail = []; // Clear trail when wrapping
            }
            
            // Draw the saucer
            drawSaucer(saucer, time);
        });
        
        // Add occasional shooting star
        if (Math.random() < 0.005) {
            const startX = Math.random() * canvas.width;
            const startY = Math.random() * canvas.height * 0.3;
            const length = Math.random() * 100 + 50;
            const angle = Math.PI / 4 + Math.random() * Math.PI / 4;
            
            // Draw shooting star
            ctx.strokeStyle = config.colors.stars;
            ctx.lineWidth = 2 * config.performance.pixelSize;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX + Math.cos(angle) * length, startY + Math.sin(angle) * length);
            ctx.stroke();
        }
        
        // Continue animation loop
        requestAnimationFrame(animate);
    }
    
    // Handle window resize
    function handleResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Update platform position for new dimensions
        platform.x = canvas.width / 2;
        platform.y = canvas.height * 0.65;
        platform.radius = isMobile ? canvas.width * 0.4 : canvas.width * 0.3;
        
        // Reinitialize all elements for new dimensions
        initStars();
        initBuildings();
        initSaucers();
        initClouds();
    }
    
    // Initialize all elements
    initStars();
    initBuildings();
    initSaucers();
    initClouds();
    
    // Start animation
    animate();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
});