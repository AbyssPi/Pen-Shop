"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";

export default function HeroScrollytelling() {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const text1Ref = useRef<HTMLDivElement>(null);
    const text2Ref = useRef<HTMLDivElement>(null);
    const text3Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const video = videoRef.current;

        // Make sure video is loaded before calculating duration
        if (!video) return;

        // We'll set up the video scrubbing once metadata is loaded
        const setupScroll = () => {
            // 1. Scrub the video based on scroll
            // A typical mp4 frame is ~0.033s. We map total scroll distance to total video duration.
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: "+=4000", // 4000px of scrolling
                pin: true, // pin the container
                scrub: 0.5, // smooth scrubbing
                animation: gsap.to(video, {
                    currentTime: video.duration || 5, // fallback to 5s if duration fails
                    ease: "none",
                }),
            });

            // 2. Animate the text overlays appearing/disappearing as we scroll down
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=4000",
                    scrub: 1,
                }
            });

            // Show Text 1 (Hook) initially, then fade out
            tl.to(text1Ref.current, { opacity: 0, y: -50, duration: 1 }, 0.5);

            // Fade in Text 2 (Craftsmanship)
            tl.fromTo(text2Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, 1);
            tl.to(text2Ref.current, { opacity: 0, y: -50, duration: 1 }, 2);

            // Fade in Text 3 (Atmosphere)
            tl.fromTo(text3Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, 2.5);
        };

        if (video.readyState >= 1) {
            setupScroll();
        } else {
            video.addEventListener('loadedmetadata', setupScroll);
        }

        return () => {
            ScrollTrigger.getAll().forEach((st) => st.kill());
            video.removeEventListener('loadedmetadata', setupScroll);
        };
    }, []);

    return (
        <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-ink">
            {/* Background Video (Pinned) */}
            <video
                ref={videoRef}
                src="/assets/hero-bg.mp4"
                className="absolute top-0 left-0 w-full h-full object-cover opacity-60"
                muted
                playsInline
                preload="metadata"
            />

            {/* Dark overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink/90" />

            {/* Chapter 1: The Hook */}
            <div
                ref={text1Ref}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
            >
                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-gold-light mb-6 tracking-wide drop-shadow-2xl font-medium">
                    The Signature <br /> of Legacy
                </h1>
                <p className="font-sans text-lg md:text-xl text-foreground/80 max-w-lg tracking-widest uppercase text-sm">
                    Master the Art of Writing
                </p>

                <div className="absolute bottom-12 flex flex-col items-center text-gold-light/60 animate-bounce">
                    <span className="text-xs uppercase tracking-widest mb-2">Scroll to Discover</span>
                    <ChevronDown className="w-6 h-6" />
                </div>
            </div>

            {/* Chapter 2: The Craftsmanship */}
            <div
                ref={text2Ref}
                className="absolute inset-0 flex flex-col items-start justify-center px-8 md:px-24 opacity-0 pointer-events-none"
            >
                <div className="backdrop-blur-md bg-ink/40 border border-gold/20 p-8 md:p-12 rounded-sm max-w-xl">
                    <h2 className="font-serif text-3xl md:text-5xl text-gold mb-4">Precision Engineered</h2>
                    <p className="font-sans text-base md:text-lg text-foreground/90 leading-relaxed">
                        Crafted from solid brass and accented with 18k gold. Every stroke is a testament to an era when words carried weight. The nib glides flawlessly, transforming thought into permanence.
                    </p>
                </div>
            </div>

            {/* Chapter 3: The Atmosphere */}
            <div
                ref={text3Ref}
                className="absolute inset-0 flex flex-col items-end justify-center px-8 md:px-24 opacity-0 pointer-events-none text-right"
            >
                <div className="backdrop-blur-md bg-ink/40 border border-gold/20 p-8 md:p-12 rounded-sm max-w-xl">
                    <h2 className="font-serif text-3xl md:text-5xl text-gold mb-4">Command the Room</h2>
                    <p className="font-sans text-base md:text-lg text-foreground/90 leading-relaxed">
                        More than an instrument—a declaration of authority. Seal your decree amidst the quiet confidence of old leather, lingering smoke, and the heavy silence of legacy made manifest.
                    </p>
                </div>
            </div>
        </div>
    );
}
