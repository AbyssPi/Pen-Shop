'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import CollectionItem from './CollectionItem';

// Final Pen Data with high-end transparent PNGs or filtered placeholder
const PEN_COLLECTION = [
    {
        id: "classic-obsidian",
        modelName: "The Obsidian & Gold",
        material: "Deep polished black obsidian resin with gleaming 18k yellow gold",
        description: "Forged in the interplay of shadow and light, the Obsidian edition features a mirror-polished deep resin barrel contrasted by sharp golden architectural accents.",
        imageSrc: "/assets/pen_nobg.png",
        filterClass: "brightness-75 contrast-125 grayscale-[0.2]",
        ambientColor: "#0a0a0c", // Deep subtle dark
    },
    {
        id: "rose-gold",
        modelName: "The Rose Gold",
        material: "Brushed matte black metal with striking, highly polished Rose Gold accents",
        description: "A testament to warmth and metallurgical mastery. The Aura Rose edition utilizes an exclusive 18-karat rose gold blend, designed to gracefully patina alongside the writer's journey.",
        imageSrc: "/assets/pen_nobg.png",
        filterClass: "sepia-[0.8] hue-rotate-[-30deg] saturate-[1.5] brightness-110",
        ambientColor: "#2a1510", // Warm rose glow
    },
    {
        id: "sterling-silver",
        modelName: "The Sterling Silver",
        material: "Shimmering Sterling Silver with intricate platinum accents",
        description: "Precision meets tradition. The Sterling Apex is machined from solid 925 silver featuring a micro-guilloché pattern that catches ambient light at microscopic angles.",
        imageSrc: "/assets/pen_nobg.png",
        filterClass: "grayscale saturate-0 brightness-150 contrast-125 hue-rotate-[180deg]",
        ambientColor: "#15181a", // Cool silver/blue glow
    }
];

export default function CollectionScroll() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Track vertical scroll across 3 viewport heights
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Smooth the progress for a luxurious, heavy feel
    const springScroll = useSpring(scrollYProgress, {
        stiffness: 40,
        damping: 30,
        mass: 1.5,
    });

    // We have 3 items. Total width is 300vw.
    // To see the last item, we need to translate left by exactly 200vw.
    // `translate-x-[0%]` to `translate-x-[-66.666%]` handles this seamlessly.
    const x = useTransform(springScroll, [0, 1], ["0%", "-66.6666%"]);

    // Dynamic Ambient Background
    // Mapping the 3 stops: 0 -> 0.5 -> 1.0 to the corresponding colors
    const backgroundColor = useTransform(
        springScroll,
        [0, 0.5, 1],
        PEN_COLLECTION.map(pen => pen.ambientColor)
    );

    return (
        <section
            ref={containerRef}
            // 300vh allows the user to scroll vertically 3 full screens
            // while the sticky child translates horizontally.
            className="relative w-full h-[300vh] bg-ink z-10"
        >
            {/* 
                Sticky wrapper: stays pinned to viewport 
                Using `framer-motion` to animate the background color based on vertical scroll
            */}
            <motion.div
                style={{ backgroundColor }}
                className="sticky top-0 w-full h-screen overflow-hidden flex items-center shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] transition-colors duration-[1000ms]"
            >
                {/* Cinematic Fade into the Carousel */}
                <div className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-[#1a1412] to-transparent pointer-events-none z-50" />

                {/* Connecting Thread dropping from Anatomy */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[20vh] w-[1px] bg-gradient-to-b from-gold/40 to-transparent pointer-events-none z-50 origin-top" />

                {/* 
                    Horizontal Track: 300vw wide to hold the 3 100vw items.
                    Translates left based on the physics spring.
                */}
                <motion.div
                    style={{ x }}
                    className="flex h-full w-[300vw]"
                >
                    {PEN_COLLECTION.map((pen, i) => (
                        <CollectionItem
                            key={pen.id}
                            index={i}
                            totalItems={PEN_COLLECTION.length}
                            modelName={pen.modelName}
                            material={pen.material}
                            description={pen.description}
                            imageSrc={pen.imageSrc}
                            filterClass={pen.filterClass}
                            parentScrollProgress={springScroll}
                        />
                    ))}
                </motion.div>

                {/* Optional: Minimalist Carousel Indicator */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-50">
                    {PEN_COLLECTION.map((_, i) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const width = useTransform(
                            springScroll,
                            // e.g. For item 0, it's active around 0
                            // For item 1, active around 0.5
                            // For item 2, active around 1.0
                            [Math.max(0, (i - 1) * 0.5), i * 0.5, Math.min(1, (i + 1) * 0.5)],
                            ["8px", "32px", "8px"]
                        );
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const opacity = useTransform(
                            springScroll,
                            [Math.max(0, (i - 1) * 0.5), i * 0.5, Math.min(1, (i + 1) * 0.5)],
                            [0.3, 1, 0.3]
                        );

                        return (
                            <motion.div
                                key={i}
                                style={{ width, opacity }}
                                className="h-[2px] bg-gold rounded-full"
                            />
                        );
                    })}
                </div>

            </motion.div>
        </section>
    );
}
