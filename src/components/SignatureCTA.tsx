'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function SignatureCTA() {
    const [initials, setInitials] = useState<string>('');

    return (
        <section className="relative min-h-screen w-full bg-ink flex flex-col items-center justify-center py-24 px-4 overflow-hidden border-t border-gold/10">

            <div className="absolute inset-0 pointer-events-none opacity-20">
                {/* Subtle glowing orb behind everything */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/10 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-6xl w-full mx-auto flex flex-col lg:flex-row items-center justify-center gap-16 relative z-10">

                {/* Left: The Story & Input */}
                <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-gold/70 tracking-[0.2em] uppercase font-sans text-xs mb-6"
                    >
                        The Final Touch
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-serif text-gold-light mb-6"
                    >
                        Leave Your <span className="italic">Mark.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-foreground/70 font-sans max-w-md leading-relaxed mb-12"
                    >
                        True luxury is deeply personal. Enter your initials below to preview the master craftsman's engraving. This complimentary service ensures your instrument is one of one.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="w-full max-w-sm flex flex-col gap-4"
                    >
                        <label className="text-xs uppercase tracking-widest text-gold/50 font-sans">
                            Monogram Engraving (Max 3 Characters)
                        </label>
                        <div className="relative group">
                            <input
                                type="text"
                                maxLength={3}
                                value={initials}
                                onChange={(e) => setInitials(e.target.value.toUpperCase())}
                                placeholder="A.B.C"
                                className="w-full bg-transparent border-b border-gold/30 text-gold-light text-2xl font-serif py-4 text-center lg:text-left placeholder:text-gold/20 focus:outline-none focus:border-gold transition-colors"
                            />
                            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gold scale-x-0 origin-left group-focus-within:scale-x-100 transition-transform duration-500" />
                        </div>

                        <button className="mt-8 px-8 py-4 bg-gold text-ink font-sans tracking-widest uppercase text-sm hover:bg-gold-light transition-colors duration-300 w-full">
                            Acquire
                        </button>
                    </motion.div>
                </div>

                {/* Right: The Simulator Canvas */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="flex-1 w-full max-w-lg aspect-[4/5] relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-gold/10"
                >
                    {/* Background high-res macro image of the blank metal pen barrel */}
                    <Image
                        src="/assets/macro_pen_barrel.png"
                        alt="Macro Pen Barrel"
                        fill
                        className="object-cover opacity-90 brightness-75"
                    />

                    {/* Simulator Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1412] via-transparent to-transparent flex items-center justify-center pointer-events-none">
                        <div className="relative -rotate-12 translate-x-4">
                            {/* Realistic Engraving Text Effect */}
                            <span
                                className="block font-serif text-5xl tracking-[0.2em] text-[#d8c28b] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] mix-blend-overlay opacity-90 transition-all duration-300"
                                style={{
                                    textShadow: "1px 1px 2px rgba(0,0,0,0.8), -1px -1px 1px rgba(255,255,255,0.2)"
                                }}
                            >
                                {initials || "---"}
                            </span>
                        </div>
                    </div>

                    {/* Simulated light flare sweeping across */}
                    <motion.div
                        initial={{ x: "-100%", opacity: 0 }}
                        animate={{ x: "200%", opacity: [0, 0.5, 0] }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatDelay: 5,
                            ease: "easeInOut"
                        }}
                        className="absolute inset-0 w-[50%] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]"
                    />
                </motion.div>

            </div>
        </section>
    );
}
