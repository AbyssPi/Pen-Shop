"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
export default function HeroScrollytelling() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const panelsRef = useRef<HTMLDivElement[]>([]);
    const blurOverlayRef = useRef<HTMLDivElement>(null);

    // Draw the current video frame onto the canvas
    const drawFrame = useCallback(() => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video || video.readyState < 2) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }, []);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        // Resize canvas to fill the viewport
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            drawFrame();
        };
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        const onSeeked = () => drawFrame();
        video.addEventListener("seeked", onSeeked);

        const setupScroll = () => {
            const panels = panelsRef.current;
            const duration = video.duration;

            // 1. Scrub video globally across the whole container height
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.5,
                onUpdate: (self) => {
                    const targetTime = self.progress * duration;
                    if (Math.abs(video.currentTime - targetTime) > 0.05) {
                        video.currentTime = targetTime;
                    }
                },
            });

            // 2. Setup Snap & Focus behavior for each panel
            panels.forEach((panel, i) => {
                // Find inner elements to orchestrate
                const textElements = panel.querySelectorAll(".stagger-text");
                const bgOverlay = panel.querySelector(".chapter-overlay");
                const productImage = panel.querySelector(".product-image img");

                // Initial states
                if (textElements.length > 0) gsap.set(textElements, { opacity: 0, y: 30 });
                if (productImage) gsap.set(productImage, { scale: 1.1 }); // Start slightly zoomed

                ScrollTrigger.create({
                    trigger: panel,
                    start: "top center",   // When panel hits center of screen
                    end: "bottom center",
                    toggleActions: "play reverse play reverse",
                    onEnter: () => {
                        // 1. & 3. Staggered Text Reveal
                        if (textElements.length > 0) {
                            gsap.to(textElements, {
                                opacity: 1,
                                y: 0,
                                duration: 1,
                                stagger: 0.2, // Typewriter stagger effect
                                ease: "power3.out"
                            });
                        }

                        // Local panel darkening
                        if (bgOverlay) gsap.to(bgOverlay, { opacity: 0.4, duration: 0.8 });

                        // 1. Spotlight Depth of Field Focus (Global Blur)
                        // If it's a product chapter (i > 0), blur the background video
                        if (i > 0 && blurOverlayRef.current) {
                            gsap.to(blurOverlayRef.current, { backdropFilter: "blur(12px)", backgroundColor: "rgba(10, 5, 2, 0.4)", duration: 1 });
                        }
                    },
                    onLeave: () => {
                        if (textElements.length > 0) gsap.to(textElements, { opacity: 0, y: -30, duration: 0.5 });
                    },
                    onEnterBack: () => {
                        if (textElements.length > 0) {
                            gsap.to(textElements, { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" });
                        }
                        if (bgOverlay) gsap.to(bgOverlay, { opacity: 0.4, duration: 0.8 });
                        if (i > 0 && blurOverlayRef.current) {
                            gsap.to(blurOverlayRef.current, { backdropFilter: "blur(12px)", backgroundColor: "rgba(10, 5, 2, 0.4)", duration: 1 });
                        } else if (i === 0 && blurOverlayRef.current) {
                            // Unblur for Chapter 1
                            gsap.to(blurOverlayRef.current, { backdropFilter: "blur(0px)", backgroundColor: "rgba(10, 5, 2, 0)", duration: 1 });
                        }
                    },
                    onLeaveBack: () => {
                        if (textElements.length > 0) gsap.to(textElements, { opacity: 0, y: 30, duration: 0.5 });
                        if (i > 0 && bgOverlay) gsap.to(bgOverlay, { opacity: 0, duration: 0.5 });
                        if (i === 1 && blurOverlayRef.current) {
                            // Unblur when leaving Chapter 2 back to Chapter 1
                            gsap.to(blurOverlayRef.current, { backdropFilter: "blur(0px)", backgroundColor: "rgba(10, 5, 2, 0)", duration: 1 });
                        }
                    }
                });

                // 2. Add continuous slow zoom/parallax to product images independently
                if (productImage) {
                    gsap.to(productImage, {
                        scale: 1.0, // Zoom out slowly
                        yPercent: 10, // Slight downward parallax
                        ease: "none",
                        scrollTrigger: {
                            trigger: panel,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true, // Tied directly to scroll position within this panel
                        }
                    });
                }
            });

            // Container snap configuration (snaps to closest section)
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                snap: {
                    snapTo: 1 / (panels.length - 1), // Snaps based on progress 0, 0.5, 1.0
                    duration: { min: 0.2, max: 0.8 },
                    delay: 0.1, // Wait 100ms after scrolling stops before snapping
                    ease: "power1.inOut"
                }
            });

            // Trigger first panel immediately
            const firstContent = panels[0]?.querySelectorAll(".stagger-text");
            if (firstContent && firstContent.length > 0) gsap.to(firstContent, { opacity: 1, y: 0, duration: 1, stagger: 0.2, delay: 0.5 });
        };

        const onCanPlay = () => {
            drawFrame();
            setupScroll();
        };

        if (video.readyState >= 3) {
            onCanPlay();
        } else {
            video.addEventListener("canplay", onCanPlay, { once: true });
        }

        return () => {
            ScrollTrigger.getAll().forEach((st) => st.kill());
            window.removeEventListener("resize", resizeCanvas);
            video.removeEventListener("seeked", onSeeked);
            video.removeEventListener("canplay", onCanPlay);
        };
    }, [drawFrame]);

    const addToPanels = (el: HTMLDivElement | null) => {
        if (el && !panelsRef.current.includes(el)) {
            panelsRef.current.push(el);
        }
    };

    return (
        <div ref={containerRef} className="relative w-full bg-ink">

            {/* Fixed Background Layer (Canvas & Cinematic Blur) */}
            <div className="fixed top-0 left-0 w-full h-screen z-0 pointer-events-none">
                <video
                    ref={videoRef}
                    src="/assets/hero-bg.mp4"
                    className="hidden"
                    muted
                    playsInline
                    preload="auto"
                />
                <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full object-cover opacity-60"
                />
                {/* Global Blur Overlay for Spotlight Effect */}
                <div
                    ref={blurOverlayRef}
                    className="absolute inset-0 transition-opacity"
                    style={{ backdropFilter: 'blur(0px)', backgroundColor: 'rgba(10, 5, 2, 0)' }}
                />
            </div>

            {/* Scrollable Content Layers */}
            <div className="relative z-10 w-full">

                {/* Chapter 1: The Hook */}
                <section ref={addToPanels} className="relative w-full h-screen flex flex-col items-center justify-center text-center px-4">
                    <div className="chapter-overlay absolute inset-0 bg-ink/30 transition-opacity" />

                    <div className="flex flex-col items-center z-10">
                        <h1 className="stagger-text font-serif text-5xl md:text-7xl lg:text-8xl text-gold-light mb-6 tracking-wide drop-shadow-2xl font-medium">
                            The Signature <br /> of Legacy
                        </h1>
                        <p className="stagger-text font-sans text-lg md:text-xl text-foreground/80 max-w-lg tracking-widest uppercase text-sm drop-shadow-lg">
                            Master the Art of Writing
                        </p>
                    </div>

                    <div className="absolute bottom-12 flex flex-col items-center text-gold-light/80 animate-bounce z-10">
                        <span className="text-xs uppercase tracking-widest mb-2 font-semibold">Scroll to Discover</span>
                        <ChevronDown className="w-6 h-6" />
                    </div>
                </section>

                {/* Chapter 2: The Craftsmanship */}
                <section ref={addToPanels} className="relative w-full h-screen flex items-center px-8 md:px-24">
                    <div className="chapter-overlay absolute inset-0 bg-ink/0 transition-opacity" />

                    <div className="w-full flex flex-col md:flex-row items-center justify-between z-10">
                        {/* Left: Text */}
                        <div className="backdrop-blur-lg bg-ink/70 border border-gold/20 p-8 md:p-12 rounded-sm max-w-lg mb-8 md:mb-0 shadow-2xl">
                            <h2 className="stagger-text font-serif text-3xl md:text-5xl text-gold mb-6">Precision Engineered</h2>
                            <p className="stagger-text font-sans text-base md:text-lg text-foreground/90 leading-relaxed">
                                Crafted from solid brass and accented with 18k gold. Every stroke is a testament to an era when words carried weight.
                            </p>
                            <div className="stagger-text w-12 h-[1px] bg-gold/50 my-6" />
                            <p className="stagger-text font-sans text-sm md:text-base text-foreground/70 leading-relaxed">
                                The nib glides flawlessly, transforming thought into permanence.
                            </p>
                        </div>
                        {/* Right: Image (With Parallax Zoom) */}
                        <div className="relative w-full max-w-md h-64 md:h-96 rounded-sm overflow-hidden border border-gold/10 shadow-2xl product-image">
                            <Image src="/assets/craftsmanship_nib.png" alt="Gold Pen Nib" fill className="object-cover" />
                        </div>
                    </div>
                </section>

                {/* Chapter 3: The Atmosphere */}
                <section ref={addToPanels} className="relative w-full h-screen flex items-center px-8 md:px-24">
                    <div className="chapter-overlay absolute inset-0 bg-ink/0 transition-opacity" />

                    <div className="w-full flex flex-col md:flex-row-reverse items-center justify-between z-10">
                        {/* Right: Text */}
                        <div className="backdrop-blur-lg bg-ink/70 border border-gold/20 p-8 md:p-12 rounded-sm max-w-lg mb-8 md:mb-0 text-right shadow-2xl">
                            <h2 className="stagger-text font-serif text-3xl md:text-5xl text-gold mb-6">Command the Room</h2>
                            <p className="stagger-text font-sans text-base md:text-lg text-foreground/90 leading-relaxed">
                                More than an instrument—a declaration of authority. Seal your decree amidst the quiet confidence of old leather and lingering smoke.
                            </p>
                            <div className="stagger-text w-12 h-[1px] bg-gold/50 my-6 ml-auto" />
                            <p className="stagger-text font-sans text-sm md:text-base text-foreground/70 leading-relaxed">
                                The heavy silence of legacy made manifest.
                            </p>
                        </div>
                        {/* Left: Image (With Parallax Zoom) */}
                        <div className="relative w-full max-w-md h-64 md:h-96 rounded-sm overflow-hidden border border-gold/10 shadow-2xl product-image">
                            <Image src="/visual items/chapter 3.jpeg" alt="Luxury Fountain Pen" fill className="object-cover" />
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}

