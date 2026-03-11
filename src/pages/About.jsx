import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, Gem, Clock } from 'lucide-react';
import './About.css';

const valores = [
    {
        icon: <Leaf size={28} />,
        title: "Origen Responsable",
        desc: "Cada material es seleccionado con responsabilidad. Solo trabajamos con proveedores que comparten nuestro compromiso con las personas y el planeta."
    },
    {
        icon: <Gem size={28} />,
        title: "Hecho a Mano",
        desc: "Cada pieza es terminada artesanalmente, garantizando la más alta atención al detalle y un cuidado único en cada creación."
    },
    {
        icon: <Clock size={28} />,
        title: "Diseñado para Durar",
        desc: "Creamos con vocación de permanencia — estilos atemporales en materiales que resisten el paso del tiempo y el uso diario."
    }
];

const estadisticas = [
    { value: "15+", label: "Años de artesanía" },
    { value: "2K+", label: "Clientas felices" },
    { value: "500+", label: "Diseños únicos" },
    { value: "100%", label: "Hecho a mano" },
];

const About = () => {
    return (
        <div className="about-page-editorial">

            {/* ── Hero Editorial ─────────────────────── */}
            <div className="about-hero">
                <div className="about-hero-bg" />
                <div className="about-hero-overlay" />
                <div className="about-wrap about-hero-content">
                    <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.165, 0.84, 0.44, 1] }}
                    >
                        <span className="about-eyebrow">Nuestra Historia</span>
                        <h1 className="about-hero-title">
                            La <i>Esencia</i> de la<br />Elegancia Cotidiana
                        </h1>
                        <p className="about-hero-sub">
                            Nacimos de la pasión por la artesanía fina y la belleza de los pequeños momentos del día a día.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* ── Estadísticas ───────────────────────── */}
            <div className="about-stats-bar">
                <div className="about-wrap about-stats-inner">
                    {estadisticas.map((s, i) => (
                        <motion.div
                            key={i}
                            className="about-stat-item"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                        >
                            <span className="about-stat-value">{s.value}</span>
                            <span className="about-stat-label">{s.label}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ── Historia Asimétrica ────────────────── */}
            <section className="about-story">
                <div className="about-wrap">
                <div className="about-story-grid">
                    <motion.div
                        className="about-story-left"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="about-story-heading">Creando momentos desde 2010.</h2>
                        <div className="about-story-img-portrait">
                            <img src="https://images.unsplash.com/photo-1573408301185-9146fe635dc0?q=80&w=1000&auto=format&fit=crop" alt="Elaboración de joyas" />
                        </div>
                    </motion.div>

                    <motion.div
                        className="about-story-right"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="about-story-img-landscape">
                            <img src="https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?q=80&w=1200&auto=format&fit=crop" alt="Colección de joyas" />
                        </div>
                        <div className="about-story-copy">
                            <span className="about-eyebrow">Nuestra Filosofía</span>
                            <p className="about-dropcap">
                                Creemos que las joyas no deben reservarse para las ocasiones especiales. Deben ser parte de tu narrativa diaria — un destello sutil que te acompaña en los pequeños momentos de la vida.
                            </p>
                            <p>
                                Nuestras piezas están diseñadas para ser atemporales, versátiles y duraderas. Trabajamos con materiales de alta calidad para que tus favoritas puedan usarse día a día, sin perder su brillo. El origen ético y la maestría artesanal son el corazón de todo lo que creamos.
                            </p>
                            <Link to="/tienda" className="about-cta-btn">Descubrir la Colección</Link>
                        </div>
                        </motion.div>
                </div>
                </div>
            </section>

            {/* ── Valores ───────────────────────────── */}
            <section className="about-values">
                <div className="about-wrap">
                    <div className="about-values-header">
                        <span className="about-eyebrow" style={{ display: 'block', textAlign: 'center', marginBottom: '0.75rem' }}>Lo que nos mueve</span>
                        <h2 className="about-values-title">Nuestra Promesa</h2>
                    </div>
                    <div className="about-values-grid">
                        {valores.map((v, i) => (
                            <motion.div
                                key={i}
                                className="about-value-card"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15, duration: 0.8 }}
                            >
                                <div className="about-value-icon">{v.icon}</div>
                                <h3 className="about-value-title">{v.title}</h3>
                                <p className="about-value-desc">{v.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Final ─────────────────────────── */}
            <section className="about-cta-section">
                <div className="about-wrap about-cta-inner">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="about-eyebrow" style={{ color: 'var(--color-accent, #D4AF37)' }}>¿Lista para comenzar?</span>
                        <h2 className="about-cta-title">Encuentra tu pieza perfecta</h2>
                        <p className="about-cta-sub">Cada joya cuenta una historia. ¿Cuál será la tuya?</p>
                        <div className="about-cta-btns">
                            <Link to="/tienda" className="about-btn-primary">Ver Colección</Link>
                            <Link to="/contacto" className="about-btn-ghost">Contáctanos</Link>
                        </div>
                    </motion.div>
                </div>
            </section>

        </div>
    );
};

export default About;
