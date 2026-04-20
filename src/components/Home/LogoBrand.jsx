import React from 'react';
import { motion } from 'framer-motion';
import logoBlack from '../../assets/logos/Everyday.png';
import logoWhite from '../../assets/logos/Logo blancoEveryday.png';
import logoSun   from '../../assets/logos/Recurso 2cajita.png';
import logoFull  from '../../assets/logos/Mesa de trabajo 1.png';
import './LogoBrand.css';

/* ── Tira marquee con el logo repitiéndose ──────────────── */
function LogoMarquee({ mode = 'light' }) {
  const items = Array(8).fill(null);
  const logoSrc = mode === 'dark' ? logoWhite : logoBlack;

  return (
    <div className={`lb-marquee lb-marquee--${mode}`}>
      <div className="lb-marquee__track">
        {[...items, ...items].map((_, i) => (
          <span key={i} className="lb-marquee__item">
            <img src={logoSrc} alt="Everyday" />
            <img src={logoSun} alt="" className="lb-marquee__sun" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Sección hero de marca con logo grande animado ───────── */
export function LogoBrandHero() {
  return (
    <section className="lb-brand-section">
      {/* Fondo: logo repetido en grid opaco */}
      <div className="lb-bg-grid" aria-hidden="true">
        {Array(12).fill(null).map((_, i) => (
          <motion.div
            key={i}
            className="lb-bg-grid__item"
            animate={{ opacity: [0.04, 0.09, 0.04], y: [0, -8, 0] }}
            transition={{ duration: 5 + (i % 3), delay: i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img src={logoBlack} alt="" />
          </motion.div>
        ))}
      </div>

      {/* Contenido central */}
      <div className="lb-brand-content">
        {/* Sol animado arriba */}
        <motion.div
          className="lb-brand-sun"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          <img src={logoSun} alt="" />
        </motion.div>

        {/* Logo principal */}
        <motion.div
          className="lb-brand-logo"
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.04 }}
        >
          <img src={logoFull} alt="Everyday" />
        </motion.div>

        <motion.p
          className="lb-brand-tagline"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Hecho con amor · Pensado para ti
        </motion.p>
      </div>
    </section>
  );
}

/* ── Marquee exportado ───────────────────────────────────── */
export { LogoMarquee };
export default LogoBrandHero;
