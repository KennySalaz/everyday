import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './MaskReveal.css';

/**
 * MaskReveal — envuelve cualquier contenido con un reveal de clip-path
 * cuando entra en el viewport.
 *
 * shape: 'wipe' | 'circle' | 'blinds'
 */
export default function MaskReveal({
    children,
    shape = 'wipe',
    delay = 0,
    duration = 1.0,
    className = '',
    once = true,
}) {
    const ref = useRef(null);
    const inView = useInView(ref, { once, margin: '-80px' });

    const variants = {
        wipe: {
            hidden: { clipPath: 'inset(0 100% 0 0)' },
            visible: { clipPath: 'inset(0 0% 0 0)' },
        },
        circle: {
            hidden: { clipPath: 'circle(0% at 50% 50%)' },
            visible: { clipPath: 'circle(150% at 50% 50%)' },
        },
        blinds: {
            hidden:  { opacity: 0, scaleY: 0, transformOrigin: 'top' },
            visible: { opacity: 1, scaleY: 1, transformOrigin: 'top' },
        },
    };

    const chosen = variants[shape] || variants.wipe;

    return (
        <motion.div
            ref={ref}
            className={`mask-reveal ${className}`}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={chosen}
            transition={{
                duration,
                delay,
                ease: [0.76, 0, 0.24, 1],
            }}
        >
            {children}
        </motion.div>
    );
}
