// Wait for DOM content to load before initializing
document.addEventListener('DOMContentLoaded', () => {
    // Get the canvas element
    const canvas = document.getElementById('cityscapeCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas to full container size
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }

    // Initial resize
    resizeCanvas();

    // Resize canvas when window is resized
    window.addEventListener('resize', resizeCanvas);

    // Building properties
    const buildings = [];
    const stars = [];
    const shootingStars = [];
    
    // Colors
    const buildingColors = [
        '#111926', // Dark blue
        '#0a0f1a', // Deeper blue
        '#141e33', // Navy blue
        '#192231', // Dark slate
        '#1e293b'  // Slate blue
    ];
    
    const windowColors = [
        'rgba(255, 255, 150, 0.6)',  // Warm yellow
        'rgba(200, 200, 255, 0.6)',  // Cool blue
        'rgba(0, 0, 0, 1)'           // Dark (off)
    ];

    // Initialize stars
    function initStars() {
        for (let i = 0; i < 200; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * (canvas.height * 0.7), // Keep stars in sky area
                size: Math.random() * 2,
                opacity: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.03 + 0.01
            });
        }
    }

    // Initialize buildings
    function initBuildings() {
        buildings.length = 0;
        
        const maxHeight = canvas.height * 0.65;
        const minHeight = canvas.height * 0.2;
        let x = 0;
        
        // Generate buildings that span the entire width
        while (x < canvas.width) {
            const width = Math.random() * 80 + 40;
            const height = Math.random() * (maxHeight - minHeight) + minHeight;
            const colorIndex = Math.floor(Math.random() * buildingColors.length);
            
            // Windows configuration
            const windowSize = 3;
            const windowSpacing = 5;
            const windowsPerFloor = Math.floor(width / (windowSize + windowSpacing));
            const floors = Math.floor(height / (windowSize + windowSpacing));
            
            const windows = [];
            // Generate windows with most turned on, some off
            for (let floor = 0; floor < floors; floor++) {
                for (let win = 0; win < windowsPerFloor; win++) {
                    // 75% chance for a window to be lit
                    const isLit = Math.random() > 0.25;
                    const colorIndex = isLit ? (Math.random() > 0.5 ? 0 : 1) : 2;
                    
                    windows.push({
                        x: win * (windowSize + windowSpacing) + windowSpacing,
                        y: floor * (windowSize + windowSpacing) + windowSpacing,
                        size: windowSize,
                        color: windowColors[colorIndex],
                        flickerRate: Math.random() < 0.1 ? Math.random() * 0.02 + 0.01 : 0 // Some windows flicker
                    });
                }
            }
            
            buildings.push({
                x,
                y: canvas.height - height,
                width,
                height,
                color: buildingColors[colorIndex],
                windows
            });
            
            x += width;
        }
    }
    
    // Add random shooting stars
    function addShootingStar() {
        if (Math.random() < 0.01 && shootingStars.length < 3) {
            const startX = Math.random() * canvas.width;
            const startY = Math.random() * (canvas.height * 0.3);
            const length = Math.random() * 100 + 50;
            const angle = Math.PI / 4 + (Math.random() * Math.PI / 4);
            
            shootingStars.push({
                x: startX,
                y: startY,
                length,
                angle,
                progress: 0,
                speed: Math.random() * 0.02 + 0.01
            });
        }
    }
    
    // Update shooting stars
    function updateShootingStars() {
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const star = shootingStars[i];
            star.progress += star.speed;
            
            if (star.progress >= 1) {
                shootingStars.splice(i, 1);
            }
        }
    }

    // Draw the night sky gradient background
    function drawSky() {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#000000');      // Black at top
        gradient.addColorStop(0.3, '#05082b');    // Deep blue
        gradient.addColorStop(0.7, '#0c1445');    // Navy blue-purple
        gradient.addColorStop(1, '#1e293b');      // Slate blue at horizon
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Draw the stars
    function drawStars(time) {
        stars.forEach(star => {
            ctx.beginPath();
            // Twinkle effect
            const twinkle = Math.sin(time * star.twinkleSpeed) * 0.3 + 0.7;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Draw shooting stars
        shootingStars.forEach(star => {
            const endX = star.x + Math.cos(star.angle) * star.length * star.progress;
            const endY = star.y + Math.sin(star.angle) * star.length * star.progress;
            
            const gradient = ctx.createLinearGradient(
                star.x, star.y, endX, endY
            );
            
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
            gradient.addColorStop(0.1, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(0.6, 'rgba(200, 200, 255, 0.4)');
            gradient.addColorStop(1, 'rgba(200, 200, 255, 0)');
            
            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        });
    }

    // Draw city buildings
    function drawBuildings(time) {
        buildings.forEach(building => {
            // Draw building
            ctx.fillStyle = building.color;
            ctx.fillRect(building.x, building.y, building.width, building.height);
            
            // Subtle top edge highlight
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(building.x, building.y);
            ctx.lineTo(building.x + building.width, building.y);
            ctx.stroke();
            
            // Draw windows
            building.windows.forEach(window => {
                let color = window.color;
                
                // Apply flickering to some windows
                if (window.flickerRate > 0) {
                    if (Math.sin(time * window.flickerRate) > 0.7) {
                        // Switch window off briefly
                        color = windowColors[2];
                    }
                }
                
                ctx.fillStyle = color;
                ctx.fillRect(
                    building.x + window.x,
                    building.y + window.y,
                    window.size,
                    window.size
                );
            });
        });
    }
    
    // Draw moon
    function drawMoon() {
        const moonX = canvas.width * 0.8;
        const moonY = canvas.height * 0.15;
        const moonRadius = canvas.width * 0.03;
        
        // Glow effect
        const gradient = ctx.createRadialGradient(
            moonX, moonY, moonRadius * 0.8,
            moonX, moonY, moonRadius * 3
        );
        gradient.addColorStop(0, 'rgba(255, 255, 240, 0.6)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 240, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 255, 240, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(moonX, moonY, moonRadius * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Moon
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 240, 0.9)';
        ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Moon details/craters
        ctx.beginPath();
        ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
        ctx.arc(moonX - moonRadius * 0.2, moonY - moonRadius * 0.3, moonRadius * 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(moonX + moonRadius * 0.3, moonY + moonRadius * 0.1, moonRadius * 0.15, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw subtle reflection on ground
    function drawReflections() {
        const reflectionHeight = canvas.height * 0.05;
        const gradient = ctx.createLinearGradient(0, canvas.height - reflectionHeight, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(50, 100, 150, 0.1)');
        gradient.addColorStop(1, 'rgba(10, 20, 40, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, canvas.height - reflectionHeight, canvas.width, reflectionHeight);
    }
    
    // Animation loop
    function animate() {
        const time = Date.now() * 0.001;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw scene
        drawSky();
        drawStars(time);
        drawMoon();
        drawBuildings(time);
        drawReflections();
        
        // Add random shooting stars
        addShootingStar();
        updateShootingStars();
        
        requestAnimationFrame(animate);
    }
    
    // Initialize scene and start animation
    initStars();
    initBuildings();
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        initBuildings(); // Regenerate buildings for new size
    });
    
    // Intersection Observer to pause/resume animation when not visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Reinitialize when becoming visible again
                initBuildings();
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(canvas);
});