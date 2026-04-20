import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, ShoppingBag, Star, Heart, Shield, Sun, Moon, Droplets, Wind } from 'lucide-react';
import './Home.css';
import FloatingLogos from '../components/Home/FloatingLogos';
import LogoBrandHero, { LogoMarquee } from '../components/Home/LogoBrand';
import logoBg from '../assets/logos/Everyday.png';
import logoBgSun from '../assets/logos/Recurso 2cajita.png';

/* ── Imágenes de Instagram ─────────────────────────────── */
import ig1 from '../assets/ig1.png';
import ig2 from '../assets/ig2.png';
import ig3 from '../assets/ig3.png';
import ig4 from '../assets/ig4.png';
import ig5 from '../assets/ig5.jpg';
import ig6 from '../assets/ig6.png';
import pic1 from '../assets/1.png';
import pic2 from '../assets/2.png';
import pic3 from '../assets/3.png';
import pic4 from '../assets/4.png';
import pic5 from '../assets/5.png';
import pic6 from '../assets/6.png';
import picA from '../assets/asdssss.png';
import picB from '../assets/asdasdassswe2.png';
import picC from '../assets/sdasdasd.png';
import picD from '../assets/2asdasd.png';
import picE from '../assets/kenyyddd.png';
import picF from '../assets/nuevoo-copy.png';
import picG from '../assets/there-one.png';
import picH from '../assets/wooo.png';
import picI from '../assets/Everyday mano.png';
import picJ from '../assets/Everyday posst.png';
import picK from '../assets/Everyday post.png';
import picL from '../assets/Gemini_Generated_Image_15hn1n15hn1n15hn.png';
import picM from '../assets/Gemini_Generated_Image_6xdi0l6xdi0l6xdi.png';
import picN from '../assets/IMG_5526.JPG';

/* ── Datos Galería ──────────────────────────────────────── */
const gallery = [
    { src: ig1,  label: 'Zarcillos Lazo Dorado',      tag: 'Zarcillos',  desc: 'Zarcillos tipo lazo en baño de oro. Delicados, femeninos y perfectos para el día a día.' },
    { src: ig2,  label: 'Brazalete + Anillo Fluido',   tag: 'Brazaletes', desc: 'Set de brazalete rígido y anillo de forma orgánica en baño de oro 18k. Minimalismo de lujo.' },
    { src: ig3,  label: 'Anillo + Brazalete Orgánico', tag: 'Anillos',    desc: 'Diseño asimétrico y moderno. Anillo abierto con brazalete torsionado — combinación única.' },
    { src: ig4,  label: 'Colección Completa',          tag: 'Colección',  desc: 'Anillos lazo, ear cuffs con cadena, aretes argolla y cadena lariat. Todo Everyday.' },
    { src: ig5,  label: 'Pulseras Unisex',             tag: 'Pulseras',   desc: 'Pulsera trenzada + cordón náutico con dije de luna. Estilo urbano para todos.' },
    { src: ig6,  label: 'Zarcillos Lazo + Anillo',     tag: 'Sets',       desc: 'La combinación perfecta: zarcillos lazo dorado con anillo a juego.' },
    { src: pic1, label: 'Pieza Destacada',             tag: 'Colección',  desc: 'Una de nuestras piezas más queridas por la comunidad Everyday.' },
    { src: pic2, label: 'Estilo del Día',              tag: 'Lifestyle',  desc: 'Accesorios pensados para lucirlos todos los días, en cualquier ocasión.' },
    { src: pic3, label: 'Dorado Everyday',             tag: 'Zarcillos',  desc: 'El dorado que nunca falla. Elegancia sencilla para tu look diario.' },
    { src: pic4, label: 'Brazalete Dorado',            tag: 'Brazaletes', desc: 'Brazalete minimalista que combina con todo. Baño de oro de alta duración.' },
    { src: pic5, label: 'Cadena Delicada',             tag: 'Cadenas',    desc: 'Cadena fina para usar sola o en capas. Versátil y atemporal.' },
    { src: pic6, label: 'Set Anillos',                 tag: 'Anillos',    desc: 'Anillos para apilar y combinar a tu gusto. Sin reglas, puro estilo.' },
    { src: picA, label: 'Look Completo',               tag: 'Sets',       desc: 'Así se combinan nuestras piezas. Un look dorado de pies a cabeza.' },
    { src: picB, label: 'Detalle Dorado',              tag: 'Colección',  desc: 'Los pequeños detalles hacen la diferencia. Cada pieza diseñada con cuidado.' },
    { src: picC, label: 'Argollas Everyday',           tag: 'Zarcillos',  desc: 'Argollas clásicas con acabado dorado. El básico que nunca debe faltar.' },
    { src: picD, label: 'Pulsera Tejida',              tag: 'Pulseras',   desc: 'Pulsera con diseño artesanal. Perfecta para combinar con brazaletes dorados.' },
    { src: picE, label: 'Estilo Everyday',             tag: 'Lifestyle',  desc: 'Nuestro estilo: sencillo, dorado y para todos los días.' },
    { src: picF, label: 'Nueva Colección',             tag: 'Colección',  desc: 'Piezas recién llegadas. Diseños frescos para renovar tu look.' },
    { src: picG, label: 'Ear Cuff + Cadena',           tag: 'Ear Cuffs',  desc: 'Ear cuff con colgante de cadena. Tendencia que no pasa de moda.' },
    { src: picH, label: 'Anillo Abierto',              tag: 'Anillos',    desc: 'Anillo ajustable con forma fluida. Úsalo en cualquier dedo.' },
    { src: picI, label: 'Piezas en Mano',              tag: 'Lifestyle',  desc: 'Nuestras piezas, en tus manos. Diseñadas para brillar contigo.' },
    { src: picJ, label: 'Everyday Post',               tag: 'Colección',  desc: 'Inspiración directa de nuestro feed. Piezas para el día a día.' },
    { src: picK, label: 'Look Dorado',                 tag: 'Lifestyle',  desc: 'Un look completo con toques dorados Everyday.' },
    { src: picL, label: 'Diseño Especial',             tag: 'Colección',  desc: 'Pieza de edición especial. Delicada y llena de personalidad.' },
    { src: picM, label: 'Colección Gemini',            tag: 'Colección',  desc: 'Nueva colección con diseños geométricos y orgánicos.' },
    { src: picN, label: 'Sesión Everyday',             tag: 'Lifestyle',  desc: 'Detrás de cámara de nuestras sesiones. Magia y accesorios.' },
];

/* ── Datos Cuidado ──────────────────────────────────────── */
const careSteps = [
    {
        icon: <Shield size={22} />,
        title: 'Guárdalos en su cajita',
        desc: 'Nuestras cajitas Everyday protegen del polvo, la humedad y los rayones. Úsalas cada vez que no los tengas puestos.',
    },
    {
        icon: <Droplets size={22} />,
        title: 'Evita el contacto con agua',
        desc: 'Quítatelos antes de bañarte, nadar o hacer ejercicio. El agua y la humedad pueden afectar su brillo y acabado.',
    },
    {
        icon: <Wind size={22} />,
        title: 'Perfumes y cremas, primero tú',
        desc: 'Aplica perfumes, cremas o maquillaje antes de colocarte tus accesorios para evitar manchas o desgaste.',
    },
    {
        icon: <Sun size={22} />,
        title: 'Límpialos con suavidad',
        desc: 'Usa un pañito seco y suave para mantener su brillo natural. No uses productos abrasivos.',
    },
    {
        icon: <Moon size={22} />,
        title: 'Dales su descanso',
        desc: 'No duermas con ellos puestos. Así evitas que se deformen o se rayen con el tiempo.',
    },
];

/* ── Helpers ─────────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = '' }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay, ease: [0.165, 0.84, 0.44, 1] }}
        >
            {children}
        </motion.div>
    );
}

/* ── Galería interactiva ─────────────────────────────────── */
function Gallery() {
    const [active, setActive] = useState(null);

    return (
        <section className="ed-gallery">
            <div className="ed-container">
                <FadeUp className="ed-section-header">
                    <span className="ed-label">📸 Nuestro estilo</span>
                    <h2 className="ed-section-title">Everyday en acción</h2>
                    <p className="ed-section-sub">
                        Cada pieza cuenta una historia. Haz clic en las fotos para explorarlas.
                    </p>
                </FadeUp>

                <div className="ed-gallery-grid">
                    {gallery.map((item, i) => (
                        <motion.div
                            key={i}
                            className="ed-gallery-item"
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: (i % 6) * 0.07 }}
                            onClick={() => setActive(item)}
                        >
                            <div className="ed-gallery-img-wrap">
                                <img src={item.src} alt={item.label} loading="lazy" />
                                <div className="ed-gallery-overlay">
                                    <span className="ed-gallery-tag">{item.tag}</span>
                                    <span className="ed-gallery-label">{item.label}</span>
                                    <span className="ed-gallery-hint">Ver ↗</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <FadeUp delay={0.2} className="ed-gallery-footer">
                    <Link to="/shop" className="ed-btn ed-btn--outline">
                        Ver toda la colección <ArrowRight size={15} />
                    </Link>
                </FadeUp>
            </div>

            {/* Lightbox mejorado */}
            <AnimatePresence>
                {active !== null && (
                    <motion.div
                        className="ed-lightbox"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActive(null)}
                    >
                        <motion.div
                            className="ed-lightbox-card"
                            initial={{ scale: 0.88, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.88, opacity: 0, y: 30 }}
                            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="ed-lightbox-img-side">
                                <img src={active.src} alt={active.label} />
                            </div>
                            <div className="ed-lightbox-info">
                                <span className="ed-lightbox-tag">{active.tag}</span>
                                <h3 className="ed-lightbox-label">{active.label}</h3>
                                <p className="ed-lightbox-desc">{active.desc}</p>
                                <Link to="/shop" className="ed-lightbox-cta" onClick={() => setActive(null)}>
                                    Ver en tienda <ArrowRight size={14} />
                                </Link>
                            </div>
                            <button className="ed-lightbox-close" onClick={() => setActive(null)}>✕</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

/* ── Guía de Cuidado ─────────────────────────────────────── */
function CareGuide() {
    const [openIdx, setOpenIdx] = useState(null);

    return (
        <section className="ed-care ed-has-logo-bg">
            <div className="ed-logo-bg-grid ed-logo-bg-grid--light" aria-hidden="true">
                {[0,1,2,3,4,5].map(i => <img key={i} src={i%4===1 ? logoBgSun : logoBg} alt="" />)}
            </div>
            <div className="ed-container">
                <div className="ed-care-inner">
                    <FadeUp className="ed-care-header">
                        <span className="ed-label">🤍 Cuida tu brillo</span>
                        <h2 className="ed-section-title">Cómo cuidar tus accesorios</h2>
                        <p className="ed-care-intro">
                            Cada accesorio Everyday está hecho para acompañarte en tu día a día.
                            Cuidarlo es parte de la magia ✨ Aquí te contamos cómo:
                        </p>
                    </FadeUp>

                    <div className="ed-care-list">
                        {careSteps.map((step, i) => (
                            <FadeUp key={i} delay={i * 0.06}>
                                <div
                                    className={`ed-care-item ${openIdx === i ? 'open' : ''}`}
                                    onClick={() => setOpenIdx(openIdx === i ? null : i)}
                                >
                                    <div className="ed-care-row">
                                        <div className="ed-care-icon">{step.icon}</div>
                                        <span className="ed-care-title">{step.title}</span>
                                        <span className="ed-care-arrow">{openIdx === i ? '−' : '+'}</span>
                                    </div>
                                    <AnimatePresence>
                                        {openIdx === i && (
                                            <motion.p
                                                className="ed-care-desc"
                                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                animate={{ opacity: 1, height: 'auto', marginTop: '0.75rem' }}
                                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                transition={{ duration: 0.35 }}
                                            >
                                                {step.desc}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </FadeUp>
                        ))}
                    </div>

                    <FadeUp delay={0.3} className="ed-care-note">
                        <Star size={14} fill="currentColor" />
                        <span>
                            Gracias por elegirnos y por hacer de lo simple, algo especial 💫
                        </span>
                    </FadeUp>
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════════════════════
   PÁGINA PRINCIPAL
══════════════════════════════════════════════════════════ */
const Home = () => {
    return (
        <div className="ed-home">

            {/* ── HERO ──────────────────────────────────────── */}
            <section className="ed-hero">
                <div className="ed-hero-bg">
                    <img src={ig2} alt="hero" className="ed-hero-bg-img" />
                    <div className="ed-hero-tint" />
                </div>
                {/* Logos flotantes sobre el hero */}
                <FloatingLogos mode="dark" />
                <div className="ed-container ed-hero-content">
                    <motion.span
                        className="ed-hero-eyebrow"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <Sparkles size={14} /> Zarcillos · Cadenas · Pulseras · Anillos
                    </motion.span>
                    <motion.h1
                        className="ed-hero-title"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                    >
                        Hola, somos<br />
                        <span className="ed-hero-brand">Everyday</span>
                    </motion.h1>
                    <motion.p
                        className="ed-hero-desc"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.6 }}
                    >
                        Accesorios dorados para lucir todos los días —<br />
                        zarcillos, brazaletes, cadenas, anillos y más.
                    </motion.p>
                    <motion.div
                        className="ed-hero-actions"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        <Link to="/shop" className="ed-btn ed-btn--primary">
                            <ShoppingBag size={16} /> Explorar tienda
                        </Link>
                        <a href="#galeria" className="ed-btn ed-btn--ghost">
                            Ver galería <ArrowRight size={15} />
                        </a>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    className="ed-hero-scroll"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                >
                    <motion.div
                        className="ed-hero-scroll-dot"
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                </motion.div>
            </section>

            {/* ── LOGO MARQUEE ──────────────────────────────── */}
            <LogoMarquee mode="light" />

            {/* ── STRIP ─────────────────────────────────────── */}
            <div className="ed-strip">
                <div className="ed-strip-track">
                    {['ZARCILLOS', '✦', 'BRAZALETES', '✦', 'CADENAS', '✦', 'ANILLOS', '✦', 'PULSERAS', '✦', 'EAR CUFFS', '✦', 'ARGOLLAS', '✦', 'EVERYDAY', '✦',
                      'ZARCILLOS', '✦', 'BRAZALETES', '✦', 'CADENAS', '✦', 'ANILLOS', '✦', 'PULSERAS', '✦', 'EAR CUFFS', '✦', 'ARGOLLAS', '✦', 'EVERYDAY', '✦'].map((w, i) => (
                        <span key={i}>{w}</span>
                    ))}
                </div>
            </div>

            {/* ── SOBRE NOSOTROS ────────────────────────────── */}
            <section className="ed-about ed-has-logo-bg">
                <div className="ed-logo-bg-grid" aria-hidden="true">
                    {[0,1,2,3,4,5].map(i => <img key={i} src={i%3===2 ? logoBgSun : logoBg} alt="" />)}
                </div>
                <div className="ed-container ed-about-grid">
                    <FadeUp className="ed-about-imgs">
                        <div className="ed-about-img-main">
                            <img src={ig6} alt="Everyday accesorios" />
                        </div>
                        <div className="ed-about-img-float">
                            <img src={ig1} alt="Aretes Everyday" />
                        </div>
                    </FadeUp>

                    <FadeUp delay={0.15} className="ed-about-text">
                        <span className="ed-label">✨ Nuestra historia</span>
                        <h2 className="ed-about-title">
                            Accesorios hechos con amor, para ti
                        </h2>
                        <p>
                            En Everyday encontrarás zarcillos, cadenas, brazaletes, anillos, ear cuffs
                            y pulseras — diseñado para brillar en tu día a día.
                            Desde lo más sutil hasta lo que roba miradas.
                        </p>
                        <p>
                            Creemos que no necesitas una ocasión especial para lucir bonita.
                            Cada pieza está pensada para combinarse, apilarse y hacerse tuya —
                            porque el lujo más bonito es el que usas todos los días.
                        </p>
                        
                        <Link to="/shop" className="ed-btn ed-btn--primary">
                            Ver colección <ArrowRight size={15} />
                        </Link>
                    </FadeUp>
                </div>
            </section>

            {/* ── GALERÍA INSTAGRAM ─────────────────────────── */}
            <div id="galeria">
                <Gallery />
            </div>

            {/* ── GUÍA DE CUIDADO ───────────────────────────── */}
            <CareGuide />

            {/* ── CTA FINAL ─────────────────────────────────── */}
            <section className="ed-cta">
                <div className="ed-cta-bg">
                    <img src={ig4} alt="cta" />
                    <div className="ed-cta-tint" />
                </div>
                {/* Logos flotantes sobre el CTA */}
                <div className="ed-logo-bg-grid ed-logo-bg-grid--cta" aria-hidden="true">
                    {[0,1,2,3,4,5].map(i => <img key={i} src={i%3===1 ? logoBgSun : logoBg} alt="" />)}
                </div>
                <div className="ed-container ed-cta-content">
                    <FadeUp>
                        <Heart size={32} className="ed-cta-icon" fill="currentColor" />
                        <h2 className="ed-cta-title">
                            Un toque diferente,<br />
                            <em>para todos los días</em>
                        </h2>
                        <p className="ed-cta-sub">
                            Zarcillos, cadenas, brazaletes, anillos y pulseras —
                            encuentra la pieza que se hará parte de tu historia.
                        </p>
                        <Link to="/shop" className="ed-btn ed-btn--white">
                            <ShoppingBag size={16} /> Ir a la tienda
                        </Link>
                    </FadeUp>
                </div>
            </section>

        </div>
    );
};

export default Home;
