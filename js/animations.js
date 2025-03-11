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
        // Modern construction color palette
        colors: {
            background: '#0a192f',          // Dark blue background
            gridLines: '#1e3a8a',           // Dark blue grid lines
            warningStripe: '#fcd34d',       // Yellow warning stripe
            warningStripe2: '#18181b',      // Dark warning stripe
            constructionOrange: '#f97316',  // Construction orange
            constructionYellow: '#facc15',  // Construction yellow
            highlight: '#38bdf8',           // Highlight blue
            textGlow: '#3b82f6',            // Text glow blue
            dust: '#94a3b8',                // Dust particles
        },
        // Animation settings
        animation: {
            dustCount: isMobile ? 40 : 80,          // Fewer dust particles on mobile
        },
        // Performance settings
        performance: {
            pixelSize: isMobile ? 3 : 2,            // Larger pixels on mobile for better performance
            frameSkip: isMobile ? 2 : 1             // Skip frames on mobile for better performance
        }
    };
    
    // Objects for animation
    let dust = [];           // Dust particles floating in the air
    let frameCount = 0;
    
    // Construction site configuration
    const constructionSite = {
        width: canvas.width * 0.8,
        height: canvas.height * 0.5,
        x: canvas.width * 0.5,   // Center X position
        y: canvas.height * 0.55, // Slightly below center
        gridCount: isMobile ? 10 : 20,
        messageY: canvas.height * 0.3,
        progressBar: {
            width: isMobile ? canvas.width * 0.7 : canvas.width * 0.5,
            height: 25,
            x: canvas.width * 0.5,
            y: canvas.height * 0.7,
            progress: 0,
            targetProgress: 35, // Percentage of completion
            speed: 0.3
        }
    };
    
    // Initialize dust particles
    function initDust() {
        dust = [];
        for (let i = 0; i < config.animation.dustCount; i++) {
            dust.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
    }
    
    // Draw background with grid
    function drawBackground() {
        // Create a gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#0a192f');  // Darker blue at top
        gradient.addColorStop(1, '#1e293b');  // Lighter blue at bottom
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid lines
        ctx.strokeStyle = config.colors.gridLines;
        ctx.lineWidth = 1;
        
        // Draw horizontal grid lines
        const gridSize = 40;
        const perspectiveScale = 2; // Perspective effect multiplier
        
        // Perspective grid (horizontal lines)
        for (let y = constructionSite.y; y < canvas.height; y += gridSize) {
            const distance = (y - constructionSite.y) / canvas.height;
            const lineSpacing = gridSize + distance * gridSize * perspectiveScale;
            
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.globalAlpha = 0.4 - distance * 0.3;
            ctx.stroke();
            ctx.globalAlpha = 1;
            
            if (y + lineSpacing >= canvas.height) break;
            y += lineSpacing - gridSize; // Adjust for next iteration
        }
        
        // Perspective grid (vertical lines)
        const vanishingPointX = canvas.width / 2;
        const vanishingPointY = constructionSite.y - canvas.height * 0.2;
        
        for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, canvas.height);
            
            // Calculate angle to vanishing point
            const angle = Math.atan2(vanishingPointY - canvas.height, vanishingPointX - x);
            const lineLength = Math.sqrt(
                Math.pow(canvas.height - vanishingPointY, 2) + 
                Math.pow(x - vanishingPointX, 2)
            );
            
            // End point along the angle
            const endX = x + Math.cos(angle) * lineLength * 0.7;
            const endY = canvas.height + Math.sin(angle) * lineLength * 0.7;
            
            ctx.lineTo(endX, endY);
            ctx.globalAlpha = 0.2;
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
    }
    
    // Draw dust particles
    function drawDust() {
        dust.forEach(particle => {
            ctx.fillStyle = `rgba(148, 163, 184, ${particle.opacity})`;
            ctx.fillRect(
                Math.floor(particle.x / config.performance.pixelSize) * config.performance.pixelSize,
                Math.floor(particle.y / config.performance.pixelSize) * config.performance.pixelSize,
                particle.size * config.performance.pixelSize,
                particle.size * config.performance.pixelSize
            );
        });
    }
    
    // Draw under construction text
    function drawConstructionText(time) {
        const text = "UNDER CONSTRUCTION";
        const y = constructionSite.messageY;
        const x = canvas.width / 2;
        
        // Add slight floating animation
        const floatY = Math.sin(time) * 5;
        
        // Set text style
        ctx.font = isMobile ? "bold 32px 'Cascadia Code'" : "bold 48px 'Cascadia Code'";
        ctx.textAlign = "center";
        
        // Draw glowing text
        const pulse = Math.sin(time * 2) * 0.5 + 0.5;
        
        // Outer glow (shadow)
        ctx.shadowColor = config.colors.textGlow;
        ctx.shadowBlur = 15 + pulse * 10;
        ctx.fillStyle = "#fff";
        ctx.fillText(text, x, y + floatY);
        
        // Reset shadow
        ctx.shadowBlur = 0;
        
        // Inner text
        ctx.fillStyle = "#fff";
        ctx.fillText(text, x, y + floatY);
        
        // Coming soon text
        ctx.font = isMobile ? "bold 18px 'Cascadia Code'" : "bold 24px 'Cascadia Code'";
        ctx.fillStyle = config.colors.constructionYellow;
        ctx.fillText("Coming Soon", x, y + 40 + floatY);
    }
    
    // Draw progress bar
    function drawProgressBar(time) {
        const bar = constructionSite.progressBar;
        
        // Animate progress
        if (bar.progress < bar.targetProgress) {
            bar.progress += bar.speed;
        } else if (bar.progress > bar.targetProgress) {
            bar.progress = bar.targetProgress;
        }
        
        // Adjust position for centering
        const x = bar.x - bar.width / 2;
        const y = bar.y - bar.height / 2;
        
        // Draw outline
        ctx.strokeStyle = config.colors.highlight;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, bar.width, bar.height);
        
        // Draw fill
        const fillWidth = (bar.progress / 100) * bar.width;
        const gradient = ctx.createLinearGradient(x, y, x + fillWidth, y + bar.height);
        gradient.addColorStop(0, config.colors.constructionYellow);
        gradient.addColorStop(1, config.colors.constructionOrange);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, fillWidth, bar.height);
        
        // Add animated "working" dots to show activity
        const dotCount = 3;
        const dotText = ".".repeat(1 + Math.floor((time * 2) % dotCount));
        
        // Draw percentage text
        ctx.font = "bold 14px 'Cascadia Code'";
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";
        ctx.fillText(`${Math.floor(bar.progress)}% complete ${dotText}`, bar.x, bar.y + 5);
    }
    
    // Update dust particles
    function updateDust() {
        dust.forEach(particle => {
            // Move particle
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around screen
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.y > canvas.height) particle.y = 0;
            if (particle.y < 0) particle.y = canvas.height;
        });
    }
    
    // Draw occasional spark effects
    function drawSparks(time) {
        if (Math.random() < 0.05) {
            const x = constructionSite.x + (Math.random() - 0.5) * constructionSite.width * 0.7;
            const y = constructionSite.y + (Math.random() - 0.5) * constructionSite.height * 0.4;
            
            const sparkCount = Math.floor(Math.random() * 5) + 5;
            
            for (let i = 0; i < sparkCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 10 + 2;
                const sparkX = x + Math.cos(angle) * distance;
                const sparkY = y + Math.sin(angle) * distance;
                
                ctx.beginPath();
                ctx.arc(sparkX, sparkY, Math.random() * 2 + 1, 0, Math.PI * 2);
                ctx.fillStyle = Math.random() > 0.5 ? config.colors.constructionYellow : '#fff';
                ctx.fill();
            }
        }
    }
    
    // Draw blueprint elements
    function drawBlueprint(time) {
        // Draw a circular blueprint in the center
        const x = constructionSite.x;
        const y = constructionSite.y;
        const radius = constructionSite.width * 0.25;
        
        // Draw outer circle
        ctx.strokeStyle = config.colors.highlight;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3 + Math.sin(time) * 0.1;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw inner circles
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.4, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw crossing lines
        ctx.beginPath();
        ctx.moveTo(x - radius, y);
        ctx.lineTo(x + radius, y);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(x, y - radius);
        ctx.lineTo(x, y + radius);
        ctx.stroke();
        
        // Add some measurement points that pulse
        const points = 6;
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const dotX = x + Math.cos(angle) * radius * 0.7;
            const dotY = y + Math.sin(angle) * radius * 0.7;
            const pulse = Math.sin(time * 2 + i) * 0.5 + 0.5;
            
            ctx.beginPath();
            ctx.arc(dotX, dotY, 3 + pulse * 2, 0, Math.PI * 2);
            ctx.fillStyle = config.colors.highlight;
            ctx.globalAlpha = 0.5 + pulse * 0.5;
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
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
        
        // Draw blueprint elements
        drawBlueprint(time);
        
        // Draw construction text
        drawConstructionText(time);
        
        // Draw progress bar
        drawProgressBar(time);
        
        // Draw dust particles
        updateDust();
        drawDust();
        
        // Draw occasional spark effects
        drawSparks(time);
        
        // Continue animation loop
        requestAnimationFrame(animate);
    }
    
    // Handle window resize
    function handleResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Update construction site position for new dimensions
        constructionSite.x = canvas.width * 0.5;
        constructionSite.y = canvas.height * 0.55;
        constructionSite.width = canvas.width * 0.8;
        constructionSite.height = canvas.height * 0.5;
        constructionSite.messageY = canvas.height * 0.3;
        
        // Update progress bar positioning
        constructionSite.progressBar.width = isMobile ? canvas.width * 0.7 : canvas.width * 0.5;
        constructionSite.progressBar.x = canvas.width * 0.5;
        constructionSite.progressBar.y = canvas.height * 0.7;
        
        // Reinitialize dust
        initDust();
    }
    
    // Initialize all elements
    initDust();
    
    // Start animation
    animate();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
});