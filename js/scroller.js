// scroller.js
document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // Initialize panel transitions
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
            start: "top center",
            end: "bottom center",
            onEnter: () => {
                panel.classList.add("active");
                const video = panel.querySelector('video');
                if(video) video.play();
            },
            onLeave: () => {
                panel.classList.remove("active");
                const video = panel.querySelector('video');
                if(video) video.pause();
            },
            onEnterBack: () => {
                panel.classList.add("active");
                const video = panel.querySelector('video');
                if(video) video.play();
            },
            onLeaveBack: () => {
                panel.classList.remove("active");
                const video = panel.querySelector('video');
                if(video) video.pause();
            }
        });

        // Parallax effect for media
        gsap.from(panel.querySelector(".card-media"), {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: panel,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // Refresh ScrollTrigger after load
    ScrollTrigger.refresh();
});