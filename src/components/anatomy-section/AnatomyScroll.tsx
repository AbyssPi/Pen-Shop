'use client';

import React, { useRef, useEffect } from 'react';
import { useScroll, useSpring, useTransform, useAnimationFrame, motion, AnimatePresence } from 'framer-motion';
import { useImagePreloader } from './useImagePreloader';
import AnatomyLabels from './AnatomyLabels';
import ParticleBackground from './ParticleBackground';

interface AnatomyScrollProps {
    frameCount?: number;
}

export default function AnatomyScroll({ frameCount = 178 }: AnatomyScrollProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Preload frames from Next.js public folder
    const { images, progress, isReady } = useImagePreloader(frameCount, '/anatomy-sequence/');

    // Track scroll within the 400vh container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Apply spring physics for heavy, luxurious inertia
    const springProgress = useSpring(scrollYProgress, {
        stiffness: 40,
        damping: 30,
        mass: 2.5,
        restDelta: 0.001
    });

    // Map progress to frame index (1 to 178)
    const frameIndex = useTransform(springProgress, [0, 1], [0, frameCount - 1]);

    // Batch 1: Final "Snap" Effect when fully assembled
    // We assume the pen is fully assembled at progress === 1 (frame 178)
    const snapY = useTransform(springProgress,
        [0.98, 0.99, 0.995, 1],
        [0, 2, -1, 0] // Subtle down-up lock animation
    );
    const snapShadow = useTransform(springProgress,
        [0.98, 0.99, 1],
        ["0px 0px 0px rgba(216, 194, 139, 0)", "0px 0px 40px rgba(216, 194, 139, 0.15)", "0px 0px 0px rgba(216, 194, 139, 0)"]
    );

    useAnimationFrame(() => {
        if (!isReady || images.length === 0) return;

        // Get current raw value and clamp to valid index
        let currentFrame = Math.round(frameIndex.get());
        currentFrame = Math.max(0, Math.min(frameCount - 1, currentFrame));

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = images[currentFrame];
        // If the image is loaded and valid
        if (!img.complete || img.naturalWidth === 0) return;

        // Handle high-DPI scaling
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        // Clear previous drawing
        ctx.clearRect(0, 0, rect.width, rect.height);

        // Calculate aspect ratio containment
        const canvasRatio = rect.width / rect.height;
        const imgRatio = img.width / img.height;

        let drawWidth = rect.width;
        let drawHeight = rect.height;
        let offsetX = 0;
        let offsetY = 0;

        // We'll use 'contain' so nothing is cropped
        if (canvasRatio > imgRatio) {
            drawWidth = rect.height * imgRatio;
            offsetX = (rect.width - drawWidth) / 2;
        } else {
            drawHeight = rect.width / imgRatio;
            offsetY = (rect.height - drawHeight) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    });

    return (
        <div
            ref={containerRef}
            className="relative w-full h-[400vh] bg-[#1a1412]" // Dark wood background aesthetic
        >
            <motion.div
                className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-[#1a1412]"
                style={{ y: snapY, boxShadow: snapShadow }}
            >
                {/* Batch 3: Ambient Gold Depth Layer */}
                {isReady && <ParticleBackground />}

                {/* Loading Overlay with Cinematic Split Exit */}
                <AnimatePresence>
                    {!isReady && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-[#1a1412] z-50 origin-center"
                        >
                            <motion.h2
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-[#d8c28b] font-serif tracking-widest uppercase text-sm mb-4 drop-shadow-lg"
                            >
                                Commencing Assembly
                            </motion.h2>

                            <motion.div
                                exit={{ scaleX: 0, opacity: 0 }}
                                transition={{ duration: 0.8 }}
                                className="w-64 h-[2px] bg-[#3a2f2a] overflow-hidden"
                            >
                                <div
                                    className="h-full bg-[#d8c28b] transition-all duration-300 ease-out"
                                    style={{ width: `${progress * 100}%`, boxShadow: '0 0 10px #d8c28b' }}
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Canvas Engine - Now fades in dynamically from a blur */}
                <motion.canvas
                    ref={canvasRef}
                    initial={{ opacity: 0, filter: 'blur(20px)', scale: 0.95 }}
                    animate={isReady ? { opacity: 0.9, filter: 'blur(0px)', scale: 1 } : {}}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    className="absolute inset-0 w-full h-full object-contain mix-blend-screen z-10"
                />

                {/* Cinematic Labels & Typography */}
                {isReady && <AnatomyLabels scrollProgress={springProgress} />}

            </motion.div>
        </div>
    );
}
