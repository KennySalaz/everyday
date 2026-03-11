import React, { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 28;
const COLORS = ['rgba(212,175,55,0.5)', 'rgba(212,175,55,0.25)', 'rgba(232,200,74,0.35)', 'rgba(255,255,255,0.15)'];

function rand(min, max) { return Math.random() * (max - min) + min; }

export default function GoldParticles({ className = '' }) {
    const canvasRef = useRef(null);
    const rafRef    = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        /* Crear partículas */
        const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
            x: rand(0, canvas.width),
            y: rand(0, canvas.height),
            r: rand(1, 3.5),
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            vx: rand(-0.25, 0.25),
            vy: rand(-0.4, -0.1),
            alpha: rand(0.3, 1),
            dAlpha: rand(0.003, 0.008) * (Math.random() > 0.5 ? 1 : -1),
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                /* Mover */
                p.x += p.vx;
                p.y += p.vy;
                p.alpha += p.dAlpha;

                /* Rebotar alpha */
                if (p.alpha <= 0.1 || p.alpha >= 1) p.dAlpha *= -1;

                /* Wrap vertical */
                if (p.y < -10) {
                    p.y = canvas.height + 10;
                    p.x = rand(0, canvas.width);
                }

                /* Dibujar */
                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();

                /* Brillo */
                if (p.r > 2.5) {
                    const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
                    grd.addColorStop(0, 'rgba(212,175,55,0.3)');
                    grd.addColorStop(1, 'transparent');
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
                    ctx.fillStyle = grd;
                    ctx.fill();
                }

                ctx.restore();
            });

            rafRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={`gold-particles ${className}`}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
            }}
            aria-hidden="true"
        />
    );
}
