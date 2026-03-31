import React, { useState } from 'react';
import { Mail, MapPin, Send, Instagram, Facebook, MessageCircle, Clock, Sparkles, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import './Contact.css';

const CANALES = [
    {
        icon: <MessageCircle size={22} />,
        label: 'WhatsApp',
        value: '+58 412-559-4826',
        href: 'https://wa.me/584125594826',
    },
    {
        icon: <Mail size={22} />,
        label: 'Correo',
        value: 'Everydayvzla@gmail.com',
        href: 'mailto:Everydayvzla@gmail.com',
    },
    {
        icon: <MapPin size={22} />,
        label: 'Ubicación',
        value: 'Caracas, Venezuela',
        href: null,
    },
    {
        icon: <Clock size={22} />,
        label: 'Horario',
        value: 'Lun – Sáb · 10am – 6pm',
        href: null,
    },
];

const Contact = () => {
    const [form, setForm]         = useState({ name: '', email: '', message: '' });
    const [focused, setFocused]   = useState({ name: false, email: false, message: false });
    const [submitted, setSubmitted] = useState(false);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const onFocus  = (f) => setFocused({ ...focused, [f]: true });
    const onBlur   = (f, v) => { if (!v) setFocused({ ...focused, [f]: false }); };

    const onSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
        setForm({ name: '', email: '', message: '' });
        setFocused({ name: false, email: false, message: false });
    };

    const isActive = (f) => focused[f] || !!form[f];

    return (
        <div className="ed-ct__page">

            {/* ════ HERO ════════════════════════════════════ */}
            <section className="ed-ct__hero">
                <div className="ed-ct__hero-img" />
                <div className="ed-ct__hero-veil" />

                <div className="ed-ct__hero-body">
                    <motion.div
                        className="ed-ct__hero-inner"
                        initial={{ opacity: 0, y: 36 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="ed-ct__hero-tag">
                            <Sparkles size={10} />
                            <span>Estamos aquí para ti</span>
                        </div>
                        <h1 className="ed-ct__hero-title">
                            Hablemos<br /><em>contigo</em>
                        </h1>
                        <p className="ed-ct__hero-desc">
                            ¿Tienes una pregunta, una idea o simplemente quieres saludar?<br />
                            Escríbenos — respondemos con mucho cariño.
                        </p>
                    </motion.div>

                    {/* Canales rápidos en el hero */}
                    <motion.div
                        className="ed-ct__hero-chips"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <a href="https://wa.me/584125594826" target="_blank" rel="noreferrer" className="ed-ct__hero-chip">
                            <MessageCircle size={14} />
                            WhatsApp
                        </a>
                        <a href="mailto:Everydayvzla@gmail.com" className="ed-ct__hero-chip">
                            <Mail size={14} />
                            Email
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="ed-ct__hero-chip">
                            <Instagram size={14} />
                            Instagram
                        </a>
                    </motion.div>
                </div>

                <div className="ed-ct__hero-deco" aria-hidden="true">✦</div>
            </section>

            {/* ════ CUERPO PRINCIPAL ═════════════════════════ */}
            <section className="ed-ct__main">
                <div className="ed-ct__main-inner">

                    {/* ── Columna izquierda — info ─────────── */}
                    <motion.div
                        className="ed-ct__info-col"
                        initial={{ opacity: 0, x: -28 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Título sección */}
                        <div className="ed-ct__info-header">
                            <p className="ed-ct__info-eyebrow">Contacto directo</p>
                            <h2 className="ed-ct__info-title">Elige tu<br /><em>canal favorito</em></h2>
                        </div>

                        {/* Canales */}
                        <div className="ed-ct__channels">
                            {CANALES.map((c, i) => (
                                <motion.div
                                    key={i}
                                    className="ed-ct__channel"
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08, duration: 0.6 }}
                                >
                                    <div className="ed-ct__channel-icon">{c.icon}</div>
                                    <div className="ed-ct__channel-text">
                                        <span className="ed-ct__channel-label">{c.label}</span>
                                        {c.href ? (
                                            <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="ed-ct__channel-value">
                                                {c.value}
                                                <ArrowUpRight size={13} />
                                            </a>
                                        ) : (
                                            <span className="ed-ct__channel-value --static">{c.value}</span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Redes sociales */}
                        <div className="ed-ct__socials">
                            <p className="ed-ct__socials-label">Síguenos</p>
                            <div className="ed-ct__socials-row">
                                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="ed-ct__social-btn" aria-label="Instagram">
                                    <Instagram size={18} />
                                </a>
                                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="ed-ct__social-btn" aria-label="Facebook">
                                    <Facebook size={18} />
                                </a>
                                <a href="https://wa.me/584125594826" target="_blank" rel="noreferrer" className="ed-ct__social-btn" aria-label="WhatsApp">
                                    <MessageCircle size={18} />
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Columna derecha — formulario ──────── */}
                    <motion.div
                        className="ed-ct__form-col"
                        initial={{ opacity: 0, x: 28 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <form onSubmit={onSubmit} className="ed-ct__form" noValidate>

                            <div className="ed-ct__form-header">
                                <h2 className="ed-ct__form-title">Envíanos<br /><em>un mensaje</em></h2>
                                <p className="ed-ct__form-sub">Te respondemos en menos de 24 horas.</p>
                            </div>

                            <div className="ed-ct__fields">

                                {/* Nombre */}
                                <div className={`ed-ct__field${isActive('name') ? ' --active' : ''}`}>
                                    <input
                                        type="text"
                                        name="name"
                                        id="ed-ct-name"
                                        value={form.name}
                                        onChange={onChange}
                                        onFocus={() => onFocus('name')}
                                        onBlur={(e) => onBlur('name', e.target.value)}
                                        required
                                        autoComplete="name"
                                    />
                                    <label htmlFor="ed-ct-name">Tu nombre completo</label>
                                    <div className="ed-ct__field-line" />
                                </div>

                                {/* Email */}
                                <div className={`ed-ct__field${isActive('email') ? ' --active' : ''}`}>
                                    <input
                                        type="email"
                                        name="email"
                                        id="ed-ct-email"
                                        value={form.email}
                                        onChange={onChange}
                                        onFocus={() => onFocus('email')}
                                        onBlur={(e) => onBlur('email', e.target.value)}
                                        required
                                        autoComplete="email"
                                    />
                                    <label htmlFor="ed-ct-email">Tu correo electrónico</label>
                                    <div className="ed-ct__field-line" />
                                </div>

                                {/* Mensaje */}
                                <div className={`ed-ct__field ed-ct__field--textarea${isActive('message') ? ' --active' : ''}`}>
                                    <textarea
                                        name="message"
                                        id="ed-ct-message"
                                        value={form.message}
                                        onChange={onChange}
                                        onFocus={() => onFocus('message')}
                                        onBlur={(e) => onBlur('message', e.target.value)}
                                        required
                                        rows={5}
                                    />
                                    <label htmlFor="ed-ct-message">¿En qué te podemos ayudar?</label>
                                    <div className="ed-ct__field-line" />
                                </div>

                            </div>

                            <button type="submit" className={`ed-ct__submit${submitted ? ' --sent' : ''}`}>
                                {submitted ? (
                                    <span className="ed-ct__submit-success">
                                        ✓ &nbsp; ¡Mensaje enviado con éxito!
                                    </span>
                                ) : (
                                    <>
                                        <span>Enviar mensaje</span>
                                        <Send size={16} />
                                    </>
                                )}
                            </button>

                        </form>
                    </motion.div>

                </div>
            </section>

            {/* ════ BANNER WA ═══════════════════════════════ */}
            <section className="ed-ct__wa">
                <div className="ed-ct__wa-bg" aria-hidden="true" />
                <div className="ed-ct__wa-inner">
                    <motion.div
                        className="ed-ct__wa-text"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <p className="ed-ct__wa-eyebrow">Respuesta inmediata</p>
                        <h2 className="ed-ct__wa-title">¿Prefieres<br /><em>chatear?</em></h2>
                        <p className="ed-ct__wa-desc">
                            Escríbenos por WhatsApp y te atendemos en minutos.
                        </p>
                        <a
                            href="https://wa.me/584125594826?text=Hola%20Everyday%2C%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20sus%20joyas"
                            target="_blank"
                            rel="noreferrer"
                            className="ed-ct__wa-btn"
                        >
                            <MessageCircle size={20} />
                            Abrir WhatsApp
                        </a>
                    </motion.div>

                    <div className="ed-ct__wa-deco" aria-hidden="true">
                        <div className="ed-ct__wa-ring ed-ct__wa-ring--1" />
                        <div className="ed-ct__wa-ring ed-ct__wa-ring--2" />
                        <span className="ed-ct__wa-star">✦</span>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Contact;
