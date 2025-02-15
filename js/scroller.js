// scroller.js
document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // Scroller-specific configuration
    gsap.utils.toArray(".scroll-panel").forEach((panel, i) => {
        // Panel entrance animation
        gsap.from(panel, {
            opacity: 0,
            y: 100,
            duration: 1,
            scrollTrigger: {
                trigger: panel,
                start: "top bottom-=100",
                toggleActions: "play none none reverse"
            }
        });

        // Full-screen panel control
        ScrollTrigger.create({
            trigger: panel,
            start: "top top",
            end: "bottom top",
            pin: true,
            pinSpacing: false,
            onEnter: () => panel.classList.add("active"),
            onLeaveBack: () => panel.classList.remove("active")
        });

        // Video autoplay control
        const video = panel.querySelector('video');
        if(video) {
            ScrollTrigger.create({
                trigger: panel,
                start: "top center",
                end: "bottom center",
                onEnter: () => video.play(),
                onEnterBack: () => video.play(),
                onLeave: () => video.pause(),
                onLeaveBack: () => video.pause()
            });
        }
    });

    // Cleanup other ScrollTriggers on this page
    ScrollTrigger.config({
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
    });
});