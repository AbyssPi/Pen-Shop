'use client';

import React, { useRef, useEffect } from 'react';

export default function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        // Resize handler
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Particle configuration (Luxury Ambient Gold Dust)
        const particleCount = 100;
        const particles: Array<{
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            opacity: number;
            blinkSpeed: number;
        }> = [];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5 + 0.5,
                // Very slow, ambient movement
                speedX: (Math.random() - 0.5) * 0.2,
                speedY: (Math.random() - 0.5) * 0.2 - 0.1, // Slight upward bias like warm air
                opacity: Math.random() * 0.5 + 0.1,
                blinkSpeed: Math.random() * 0.02 + 0.005
            });
        }

        const render = () => {
            // Clear canvas completely each frame
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw radial glow center (subtle)
            const gradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
            );
            gradient.addColorStop(0, 'rgba(216, 194, 139, 0.03)'); // Center gold tint
            gradient.addColorStop(1, 'rgba(26, 20, 18, 0)'); // Fade to transparent (#1a1412)

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            particles.forEach((p) => {
                // Pulse opacity
                p.opacity += p.blinkSpeed;
                if (p.opacity >= 0.6 || p.opacity <= 0.1) {
                    p.blinkSpeed = -p.blinkSpeed;
                }

                // Move
                p.x += p.speedX;
                p.y += p.speedY;

                // Wrap around edges seamlessly
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                // Draw
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(216, 194, 139, ${Math.max(0, p.opacity)})`;
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            // CSS Hardware acceleration
            style={{ transform: 'translateZ(0)' }}
        />
    );
}
