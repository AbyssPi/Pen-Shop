'use client';

import React from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';

const StaggeredChar = ({ char, progress, start, end }: { char: string, progress: MotionValue<number>, start: number, end: number }) => {
    const opacity = useTransform(progress, [start, end], [0, 1]);
    const y = useTransform(progress, [start, end], [10, 0]);

    return (
        <motion.span style={{ opacity, y, display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}>
            {char}
        </motion.span>
    );
};

// Helper component to stagger text characters based on a scroll range
const StaggeredText = ({
    text,
    progress,
    start,
    end,
    className
}: {
    text: string;
    progress: MotionValue<number>;
    start: number;
    end: number;
    className?: string;
}) => {
    const characters = text.split('');
    const step = (end - start) / characters.length;

    return (
        <span className={className}>
            {characters.map((char, i) => {
                const charStart = start + step * i;
                const charEnd = charStart + step * 2; // slight overlap for smoothness

                return (
                    <StaggeredChar
                        key={i}
                        char={char}
                        progress={progress}
                        start={charStart}
                        end={charEnd}
                    />
                );
            })}
        </span>
    );
};

interface AnatomyLabelsProps {
    scrollProgress: MotionValue<number>;
}

export default function AnatomyLabels({ scrollProgress }: AnatomyLabelsProps) {
    // Main title (fade out)
    const titleOpacity = useTransform(scrollProgress, [0, 0.1, 0.2], [1, 1, 0]);
    const titleY = useTransform(scrollProgress, [0, 0.2], [0, -50]);

    // Cap label visibility ranges
    const capInStart = 0.15;
    const capInEnd = 0.25;
    const capOutStart = 0.8;
    const capOutEnd = 0.9;

    const capLabelOpacity = useTransform(scrollProgress, [capInStart, capInEnd, capOutStart, capOutEnd], [0, 1, 1, 0]);
    const capPathLength = useTransform(scrollProgress, [capInStart, capInEnd + 0.05], [0, 1]); // line draws slightly after text

    // Barrel label visibility ranges
    const barrelInStart = 0.35;
    const barrelInEnd = 0.45;
    const barrelOutStart = 0.8;
    const barrelOutEnd = 0.9;

    const barrelLabelOpacity = useTransform(scrollProgress, [barrelInStart, barrelInEnd, barrelOutStart, barrelOutEnd], [0, 1, 1, 0]);
    const barrelPathLength = useTransform(scrollProgress, [barrelInStart, barrelInEnd + 0.05], [0, 1]);

    // Nib label visibility ranges
    const nibInStart = 0.55;
    const nibInEnd = 0.65;
    const nibOutStart = 0.8;
    const nibOutEnd = 0.9;

    const nibLabelOpacity = useTransform(scrollProgress, [nibInStart, nibInEnd, nibOutStart, nibOutEnd], [0, 1, 1, 0]);
    const nibPathLength = useTransform(scrollProgress, [nibInStart, nibInEnd + 0.05], [0, 1]);

    return (
        <div className="absolute inset-0 pointer-events-none z-10 w-full h-full">
            {/* Main Headline */}
            <motion.div
                style={{ opacity: titleOpacity, y: titleY }}
                className="absolute top-1/4 left-0 w-full text-center px-4"
            >
                <h2 className="text-4xl md:text-5xl font-serif text-[#d8c28b] tracking-wider mb-2">
                    Engineered Perfection
                </h2>
                <p className="text-sm md:text-base text-gray-400 font-sans tracking-widest uppercase">
                    The Anatomy
                </p>
            </motion.div>

            {/* Hand-Polished Cap Label */}
            <motion.div
                style={{ opacity: capLabelOpacity }}
                className="absolute top-[20%] right-8 md:top-[18%] md:right-[15%] text-right flex flex-col items-end"
            >
                {/* SVG Connecting Line */}
                <svg className="absolute top-[10px] right-full mr-4 w-[100px] md:w-[200px] h-[100px] overflow-visible" style={{ transform: 'scaleX(-1)' }}>
                    <motion.path
                        d="M 0 0 L 40 0 L 100 80"
                        stroke="#d8c28b"
                        strokeWidth="1"
                        fill="none"
                        style={{ pathLength: capPathLength }}
                    />
                    <motion.circle cx="100" cy="80" r="3" fill="#d8c28b" style={{ opacity: capPathLength }} />
                </svg>

                <h3 className="text-[#d8c28b] font-serif text-xl md:text-2xl overflow-hidden">
                    <StaggeredText text="Hand-Polished Cap" progress={scrollProgress} start={capInStart} end={capInEnd} />
                </h3>
                <p className="text-xs text-gray-400 font-sans uppercase tracking-widest max-w-[150px] mt-2 overflow-hidden">
                    <StaggeredText text="Precision threading mechanism" progress={scrollProgress} start={capInStart + 0.05} end={capInEnd + 0.05} />
                </p>
            </motion.div>

            {/* Precision Barrel Label */}
            <motion.div
                style={{ opacity: barrelLabelOpacity }}
                className="absolute top-[50%] left-8 md:top-[45%] md:left-[15%] text-left flex flex-col items-start"
            >
                {/* SVG Connecting Line */}
                <svg className="absolute top-[10px] left-full ml-4 w-[100px] md:w-[150px] h-[50px] overflow-visible">
                    <motion.path
                        d="M 0 0 L 40 0 L 120 30"
                        stroke="#d8c28b"
                        strokeWidth="1"
                        fill="none"
                        style={{ pathLength: barrelPathLength }}
                    />
                    <motion.circle cx="120" cy="30" r="3" fill="#d8c28b" style={{ opacity: barrelPathLength }} />
                </svg>

                <h3 className="text-[#d8c28b] font-serif text-xl md:text-2xl overflow-hidden">
                    <StaggeredText text="Precision Barrel" progress={scrollProgress} start={barrelInStart} end={barrelInEnd} />
                </h3>
                <p className="text-xs text-gray-400 font-sans uppercase tracking-widest max-w-[150px] mt-2 overflow-hidden">
                    <StaggeredText text="High-density aerograde alloy" progress={scrollProgress} start={barrelInStart + 0.05} end={barrelInEnd + 0.05} />
                </p>
            </motion.div>

            {/* 18k Gold Nib Label */}
            <motion.div
                style={{ opacity: nibLabelOpacity }}
                className="absolute bottom-[20%] right-8 md:bottom-[25%] md:right-[15%] text-right flex flex-col items-end"
            >
                {/* SVG Connecting Line */}
                <svg className="absolute top-[10px] right-full mr-4 w-[100px] md:w-[180px] h-[100px] overflow-visible" style={{ transform: 'scaleX(-1)' }}>
                    <motion.path
                        d="M 0 0 L 40 0 L 140 -60"
                        stroke="#d8c28b"
                        strokeWidth="1"
                        fill="none"
                        style={{ pathLength: nibPathLength }}
                    />
                    <motion.circle cx="140" cy="-60" r="3" fill="#d8c28b" style={{ opacity: nibPathLength }} />
                </svg>

                <h3 className="text-[#d8c28b] font-serif text-xl md:text-2xl overflow-hidden">
                    <StaggeredText text="18k Gold Nib" progress={scrollProgress} start={nibInStart} end={nibInEnd} />
                </h3>
                <p className="text-xs text-gray-400 font-sans uppercase tracking-widest max-w-[150px] mt-2 overflow-hidden">
                    <StaggeredText text="Hand-crafted for fluid motion" progress={scrollProgress} start={nibInStart + 0.05} end={nibInEnd + 0.05} />
                </p>
            </motion.div>
        </div>
    );
}
