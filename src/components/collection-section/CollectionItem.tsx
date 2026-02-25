'use client';

import React from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import Image from 'next/image';

interface CollectionItemProps {
    modelName: string;
    material: string;
    description: string;
    imageSrc: string;
    filterClass?: string;
    index: number;
    totalItems: number;
    parentScrollProgress: MotionValue<number>;
}

// Helper for Staggered Text (reusing the elegant feel from Anatomy)
const StaggeredText = ({ text, delay = 0 }: { text: string, delay?: number }) => {
    return (
        <span className="inline-block relative">
            {text.split('').map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{
                        duration: 0.5,
                        delay: delay + i * 0.02,
                        ease: [0.215, 0.61, 0.355, 1],
                    }}
                    style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
                >
                    {char}
                </motion.span>
            ))}
        </span>
    );
};

export default function CollectionItem({
    modelName,
    material,
    description,
    imageSrc,
    filterClass,
    index,
    totalItems,
    parentScrollProgress
}: CollectionItemProps) {
    // Continuous deep levitation effect
    const floatAnimation = {
        y: ["-2%", "2%"],
        transition: {
            duration: 4,
            ease: "easeInOut" as const,
            repeat: Infinity,
            repeatType: "reverse" as const,
        }
    };

    return (
        <div className="w-screen h-full flex-shrink-0 flex items-center justify-center relative px-8 py-20">
            <div className="max-w-[1400px] w-full h-full flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">

                {/* 1. Left: Typography & Story */}
                <div className="flex-1 flex flex-col items-start justify-center z-10 w-full md:w-1/2 pl-8 md:pl-12">
                    <div className="mb-2 pl-2 -ml-2">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-xs tracking-widest uppercase text-gold/70 font-sans block italic"
                        >
                            Edition {String(index + 1).padStart(2, '0')}
                        </motion.span>
                    </div>

                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif text-gold-light mb-4 leading-none italic">
                        <StaggeredText text={modelName} />
                    </h2>

                    <h3 className="text-xl md:text-2xl text-gold/80 font-serif italic mb-8">
                        <StaggeredText text={material} delay={0.2} />
                    </h3>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-foreground/70 font-sans max-w-md text-sm md:text-base leading-relaxed mb-10 italic"
                    >
                        {description}
                    </motion.p>

                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-50px" }}
                        transition={{ duration: 0.8, delay: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
                        className="group relative px-8 py-4 bg-transparent border border-gold/30 hover:border-gold transition-colors duration-500 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
                        <span className="relative z-10 font-sans tracking-widest uppercase text-xs text-gold group-hover:text-ink transition-colors duration-500 italic">
                            Acquire {modelName}
                        </span>
                    </motion.button>
                </div>

                {/* 2. Right: Floating Product Image */}
                <div className="flex-1 w-full md:w-1/2 relative z-20 flex items-center justify-center">
                    <motion.div
                        animate={floatAnimation}
                        className="relative w-full h-[50vh] md:h-[80vh] flex items-center justify-center"
                    >
                        {/* Final transparent high-res PNG or Filtered Placeholder */}
                        <Image
                            src={imageSrc}
                            alt={`${modelName} Pen`}
                            fill
                            className={`object-contain ${filterClass || ''} drop-shadow-2xl z-20`}
                            priority={index === 0}
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />

                        {/* Interactive lighting ring behind the pen */}
                        <motion.div
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full border border-gold/10 z-10"
                            initial={{ scale: 0.8, opacity: 0, rotate: 0 }}
                            whileInView={{ scale: 1, opacity: 1, rotate: 180 }}
                            viewport={{ once: false, margin: "-100px" }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
