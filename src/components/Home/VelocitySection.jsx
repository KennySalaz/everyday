import React, { useRef } from 'react';
import { motion, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import TextMorph from './TextMorph';
import './VelocitySection.css';

const TAGLINE = 'Hecho a mano. Diseñado para durar.';

export default function VelocitySection() {
    const ref = useRef(null);
    const { scrollY } = useScroll();
    const velocity = useVelocity(scrollY);

    // Blur proporcional a la velocidad (max ~10px)
    const rawBlur = useTransform(velocity, [-3000, 0, 3000], [10, 0, 10]);
    const blur = useSpring(rawBlur, { stiffness: 60, damping: 20 });
    const blurStr = useTransform(blur, v => `blur(${v.toFixed(2)}px)`);

    // Ligera inclinación (skew) según dirección del scroll
    const rawSkew = useTransform(velocity, [-2000, 0, 2000], ['-4deg', '0deg', '4deg']);
    const skew = useSpring(rawSkew, { stiffness: 80, damping: 30 });

    return (
        <section ref={ref} className="velocity-section">
            {/* Fondo con gradiente animado */}
            <div className="velocity-bg" />

            <div className="velocity-inner container">
                {/* Eyebrow */}
                <p className="velocity-eyebrow">nuestro estilo</p>

                {/* Headline grande con TextMorph */}
                <motion.h2
                    className="velocity-headline"
                    style={{ filter: blurStr, skewX: skew }}
                >
                    Jewelry that is{' '}
                    <TextMorph />
                </motion.h2>

                {/* Tagline estática con efecto scramble a través de caracteres decorativos */}
                <motion.p
                    className="velocity-tagline"
                    style={{ filter: blurStr }}
                >
                    {TAGLINE}
                </motion.p>

                {/* Strip de palabras clave */}
                <div className="velocity-keywords">
                    {['Handcrafted', '·', '14K Gold', '·', 'Artisan', '·', 'Waterproof', '·', 'Limited'].map((w, i) => (
                        <span key={i} className={w === '·' ? 'velocity-dot' : 'velocity-kw'}>{w}</span>
                    ))}
                </div>

                <Link to="/shop" className="velocity-cta">
                    Explorar colección
                </Link>
            </div>

            {/* Líneas decorativas animadas */}
            <div className="velocity-lines" aria-hidden="true">
                <motion.div className="vl vl1" style={{ skewX: skew }} />
                <motion.div className="vl vl2" style={{ skewX: skew }} />
            </div>
        </section>
    );
}
