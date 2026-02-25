'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function HeritageSection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    // Track scroll for parallax and reveal effects
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // Subtly scale and dim the background as we scroll
    const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
    const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.8, 0.3]);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-[120vh] w-full bg-ink flex items-center justify-center overflow-hidden"
        >
            {/* 
                Parallax Background (Moody, Dark, Ink-like)
                In a production build with explicit assets, this would be a slow-motion video loop of ink or polishing.
                Here, we simulate the mood with a deep, animated radial gradient that scales.
            */}
            <motion.div
                style={{ scale: bgScale, opacity: bgOpacity }}
                className="absolute inset-0 pointer-events-none"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,194,139,0.05)_0%,rgba(26,20,18,1)_100%)]" />
                {/* Simulated texture overlay */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
            </motion.div>

            {/* Content Container */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">

                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="block text-gold/60 font-sans tracking-[0.3em] uppercase text-xs mb-8"
                >
                    The Art of Writing
                </motion.span>

                <motion.h2
                    initial={{ opacity: 0, filter: 'blur(10px)', y: 30 }}
                    whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="text-5xl md:text-7xl lg:text-8xl font-serif text-gold-light leading-tight mb-12"
                >
                    A Legacy Forged <br />
                    <span className="italic text-gold/80">in Time.</span>
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    className="flex flex-col items-center gap-6"
                >
                    <p className="text-lg md:text-2xl text-foreground/70 font-sans font-light leading-relaxed max-w-2xl">
                        "Every stroke is a declaration. We don't just engineer writing instruments; we preserve the physical weight of human thought."
                    </p>
                    <div className="w-12 h-[1px] bg-gold/50 mt-4" />
                    <span className="text-sm text-gold/80 font-serif italic">The Master Craftsman</span>
                </motion.div>

            </div>
        </section>
    );
}
