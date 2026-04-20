import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import logoBlack  from '../../assets/logos/Everyday.png';
import logoWhite  from '../../assets/logos/Logo blancoEveryday.png';
import logoSun    from '../../assets/logos/Recurso 2cajita.png';
import logoFull   from '../../assets/logos/Mesa de trabajo 1.png';
import './FloatingLogos.css';

/* ── Configuración de cada pieza flotante ────────────────
   x/y  = posición inicial en %
   size = ancho en px
   rot  = rotación base en grados
   dur  = duración del loop float
   delay= retardo inicial
   src  = qué logo usar
   variant = 'black' | 'white' | 'sun' | 'full'
──────────────────────────────────────────────────────── */
const PIECES = [
  { id: 0, x: 8,  y: 18, size: 160, rot: -8,  dur: 7,  delay: 0,   src: 'white',  opacity: 0.12 },
  { id: 1, x: 72, y: 10, size: 80,  rot: 12,  dur: 9,  delay: 1.5, src: 'sun',    opacity: 0.20 },
  { id: 2, x: 85, y: 55, size: 130, rot: -4,  dur: 8,  delay: 0.8, src: 'white',  opacity: 0.10 },
  { id: 3, x: 20, y: 70, size: 60,  rot: 20,  dur: 6,  delay: 2,   src: 'sun',    opacity: 0.18 },
  { id: 4, x: 50, y: 80, size: 100, rot: -14, dur: 10, delay: 0.3, src: 'white',  opacity: 0.08 },
  { id: 5, x: 92, y: 82, size: 50,  rot: 8,   dur: 7,  delay: 3,   src: 'sun',    opacity: 0.22 },
];

const SRCS = {
  black: logoBlack,
  white: logoWhite,
  sun:   logoSun,
  full:  logoFull,
};

/* Pieza individual con magnético suave al cursor */
function FloatPiece({ piece, mouseX, mouseY, containerRef }) {
  const strength = piece.size / 6;

  const dx = useMotionValue(0);
  const dy = useMotionValue(0);
  const sx = useSpring(dx, { stiffness: 60, damping: 18 });
  const sy = useSpring(dy, { stiffness: 60, damping: 18 });

  useEffect(() => {
    const move = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width  * (piece.x / 100);
      const cy = rect.top  + rect.height * (piece.y / 100);
      const distX = e.clientX - cx;
      const distY = e.clientY - cy;
      const dist  = Math.sqrt(distX * distX + distY * distY);
      const maxDist = 300;
      if (dist < maxDist) {
        const factor = (1 - dist / maxDist) * strength;
        dx.set((distX / dist) * factor);
        dy.set((distY / dist) * factor);
      } else {
        dx.set(0);
        dy.set(0);
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <motion.div
      className="fl-piece"
      style={{
        left:    `${piece.x}%`,
        top:     `${piece.y}%`,
        width:   piece.size,
        opacity: piece.opacity,
        x: sx,
        y: sy,
      }}
      animate={{
        y: [0, -18, 0, 10, 0],
        rotate: [piece.rot, piece.rot + 4, piece.rot - 3, piece.rot + 2, piece.rot],
      }}
      transition={{
        duration: piece.dur,
        delay: piece.delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      whileHover={{ opacity: piece.opacity * 3.5, scale: 1.08, transition: { duration: 0.3 } }}
    >
      <img src={SRCS[piece.src]} alt="" draggable={false} />
    </motion.div>
  );
}

/* ── Componente principal ────────────────────────────────
   mode: 'dark' | 'light'
──────────────────────────────────────────────────────── */
export default function FloatingLogos({ mode = 'dark' }) {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  return (
    <div
      ref={containerRef}
      className={`fl-container fl-container--${mode}`}
      aria-hidden="true"
    >
      {PIECES.map((p) => (
        <FloatPiece
          key={p.id}
          piece={p}
          mouseX={mouseX}
          mouseY={mouseY}
          containerRef={containerRef}
        />
      ))}
    </div>
  );
}
