'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import AnatomyScroll from './anatomy-section/AnatomyScroll';

export default function AnatomySection() {
    const sectionRef = useRef<HTMLElement>(null);

    // Track when the top of the AnatomySection enters the bottom of the viewport
    // and ends when it reaches the top of the viewport
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "start start"]
    });

    // Animate the line drawing down from 0% to 100% height
    const drawLine = useTransform(scrollYProgress, [0.3, 0.9], ["0%", "100%"]);
    // Fade in the text at the very end of the line draw
    const textOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);

    return (
        <section ref={sectionRef} className="relative w-full bg-[#1a1412] z-20">
            {/* Cinematic Fade to Black Bridge */}
            <div className="absolute top-0 left-0 w-full h-[50vh] -translate-y-full bg-gradient-to-b from-transparent to-[#1a1412] pointer-events-none" />

            {/* Gateway Thread */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full h-[40vh] flex flex-col items-center justify-start pointer-events-none origin-top">
                <motion.div
                    style={{ height: drawLine }}
                    className="w-[1px] bg-gradient-to-b from-transparent via-gold/40 to-gold/80"
                />
                <motion.span
                    style={{ opacity: textOpacity }}
                    className="text-[9px] uppercase tracking-[0.3em] text-gold/70 mt-6 font-sans whitespace-nowrap"
                >
                    Deconstruct the Legacy
                </motion.span>
            </div>

            <AnatomyScroll frameCount={178} />
        </section>
    );
}
