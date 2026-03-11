import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Search, X, SlidersHorizontal, ArrowRight, Sparkles } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import './Shop.css';

const CATS = ['Todas', 'Anillos', 'Collares', 'Pulseras', 'Aretes', 'Sets'];

const Shop = () => {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [catActiva, setCatActiva] = useState('Todas');
    const [orden, setOrden] = useState('default');
    const [hoveredId, setHoveredId] = useState(null);

    useEffect(() => {
        const q = query(collection(db, 'products'));
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setProductos(data.sort((a, b) => {
                const dA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dB - dA;
            }));
            setCargando(false);
        });
        return () => unsub();
    }, []);

    const handleWhatsApp = (p) => {
        const precio = p.salePrice ? p.salePrice.toFixed(2) : '0.00';
        const texto = `¡Hola! Me interesa: *${p.name}* — $${precio}. ¿Está disponible?`;
        window.open(`https://wa.me/584241539300?text=${encodeURIComponent(texto)}`, '_blank');
    };

    const filtrados = productos
        .filter(p => {
            const busq = p.name?.toLowerCase().includes(busqueda.toLowerCase());
            const cat  = catActiva === 'Todas' || p.category === catActiva;
            return busq && cat;
        })
        .sort((a, b) => {
            if (orden === 'precio-asc')  return (a.salePrice || 0) - (b.salePrice || 0);
            if (orden === 'precio-desc') return (b.salePrice || 0) - (a.salePrice || 0);
            if (orden === 'nombre')      return (a.name || '').localeCompare(b.name || '');
            return 0;
        });

    return (
        <div className="ed-sh__page">

            {/* ════ HERO ════════════════════════════════════ */}
            <section className="ed-sh__hero">
                <div className="ed-sh__hero-media">
                    <div className="ed-sh__hero-img" />
                    <div className="ed-sh__hero-veil" />
                </div>
                <div className="ed-sh__hero-body">
                    <motion.div
                        className="ed-sh__hero-inner"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="ed-sh__hero-tag">
                            <Sparkles size={10} />
                            <span>Colección 2026</span>
                        </div>
                        <h1 className="ed-sh__hero-title">
                            Cada pieza,<br /><em>una historia</em>
                        </h1>
                        <p className="ed-sh__hero-desc">
                            Joyas artesanales únicas, elaboradas con materiales de primera calidad para acompañar tus momentos.
                        </p>
                    </motion.div>
                    <div className="ed-sh__hero-deco" aria-hidden="true">✦</div>
                </div>
                <div className="ed-sh__hero-statsbar">
                    <div className="ed-sh__hero-stats-inner">
                        {[
                            { val: '500+', lbl: 'Diseños únicos' },
                            { val: '100%', lbl: 'Hecho a mano' },
                            { val: '2K+',  lbl: 'Clientas felices' },
                            { val: '15+',  lbl: 'Años de artesanía' },
                        ].map((s, i) => (
                            <div key={i} className="ed-sh__stat-item">
                                <strong>{s.val}</strong>
                                <span>{s.lbl}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════ FILTROS ══════════════════════════════════ */}
            <div className="ed-sh__filters-rail">
                <div className="ed-sh__filters-inner">
                    <div className="ed-sh__cats">
                        {CATS.map(c => (
                            <button
                                key={c}
                                className={`ed-sh__cat-btn${catActiva === c ? ' --active' : ''}`}
                                onClick={() => setCatActiva(c)}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                    <div className="ed-sh__controls">
                        <label className="ed-sh__search">
                            <Search size={14} />
                            <input
                                type="text"
                                placeholder="Buscar pieza..."
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                            />
                            {busqueda && (
                                <button className="ed-sh__search-clear" onClick={() => setBusqueda('')}>
                                    <X size={13} />
                                </button>
                            )}
                        </label>
                        <label className="ed-sh__sort">
                            <SlidersHorizontal size={13} />
                            <select value={orden} onChange={e => setOrden(e.target.value)}>
                                <option value="default">Más recientes</option>
                                <option value="precio-asc">Menor precio</option>
                                <option value="precio-desc">Mayor precio</option>
                                <option value="nombre">Nombre A–Z</option>
                            </select>
                        </label>
                    </div>
                </div>
            </div>

            {/* ════ CATÁLOGO ══════════════════════════════════ */}
            <section className="ed-sh__catalog">
                <div className="ed-sh__catalog-inner">
                    <div className="ed-sh__catalog-head">
                        <div className="ed-sh__catalog-info">
                            <h2 className="ed-sh__catalog-title">
                                {catActiva === 'Todas' ? 'Toda la colección' : catActiva}
                            </h2>
                            <p className="ed-sh__catalog-count">
                                {cargando ? '—' : `${filtrados.length} pieza${filtrados.length !== 1 ? 's' : ''}`}
                            </p>
                        </div>
                        <div className="ed-sh__catalog-line" aria-hidden="true" />
                    </div>

                    {cargando ? (
                        <div className="ed-sh__loading">
                            <div className="ed-sh__spinner" />
                            <p>Preparando la colección…</p>
                        </div>
                    ) : filtrados.length === 0 ? (
                        <motion.div className="ed-sh__empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="ed-sh__empty-icon">✦</div>
                            <p>Sin resultados para esta búsqueda.</p>
                            <button onClick={() => { setBusqueda(''); setCatActiva('Todas'); }}>
                                Limpiar filtros
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div className="ed-sh__grid" layout>
                            <AnimatePresence>
                                {filtrados.map((p, i) => (
                                    <motion.article
                                        key={p.id}
                                        className="ed-sh__card"
                                        layout
                                        initial={{ opacity: 0, y: 28 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.94 }}
                                        transition={{ delay: i * 0.06, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                                        onHoverStart={() => setHoveredId(p.id)}
                                        onHoverEnd={() => setHoveredId(null)}
                                    >
                                        <div className="ed-sh__card-media">
                                            {p.imageUrl ? (
                                                <img
                                                    src={p.imageUrl}
                                                    alt={p.name}
                                                    loading="lazy"
                                                    className={hoveredId === p.id ? '--zoomed' : ''}
                                                />
                                            ) : (
                                                <div className="ed-sh__card-placeholder">✦</div>
                                            )}
                                            {p.category && (
                                                <span className="ed-sh__card-badge">{p.category}</span>
                                            )}
                                            <div className="ed-sh__card-cta">
                                                <button
                                                    className="ed-sh__card-cta-btn"
                                                    onClick={() => handleWhatsApp(p)}
                                                >
                                                    <MessageCircle size={15} />
                                                    Consultar
                                                </button>
                                            </div>
                                        </div>
                                        <div className="ed-sh__card-info">
                                            <div className="ed-sh__card-top">
                                                {p.category && (
                                                    <span className="ed-sh__card-cat">{p.category}</span>
                                                )}
                                                <h3 className="ed-sh__card-name">{p.name}</h3>
                                                {p.description && (
                                                    <p className="ed-sh__card-desc">{p.description}</p>
                                                )}
                                            </div>
                                            <div className="ed-sh__card-bottom">
                                                <span className="ed-sh__card-price">
                                                    ${p.salePrice ? p.salePrice.toFixed(2) : '0.00'}
                                                </span>
                                                <button
                                                    className="ed-sh__card-buy"
                                                    onClick={() => handleWhatsApp(p)}
                                                    aria-label={`Comprar ${p.name}`}
                                                >
                                                    <ArrowRight size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.article>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* ════ CTA FINAL ════════════════════════════════ */}
            <section className="ed-sh__cta">
                <div className="ed-sh__cta-bg" aria-hidden="true" />
                <div className="ed-sh__cta-inner">
                    <motion.div
                        className="ed-sh__cta-text"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="ed-sh__cta-tag">
                            <Sparkles size={10} />
                            <span>Pedido personalizado</span>
                        </div>
                        <h2 className="ed-sh__cta-title">
                            ¿No encontraste<br /><em>lo que buscas?</em>
                        </h2>
                        <p className="ed-sh__cta-sub">
                            Cuéntanos tu idea y creamos la pieza perfecta, exclusivamente para ti.
                        </p>
                        <button
                            className="ed-sh__cta-btn"
                            onClick={() => window.open('https://wa.me/584241539300?text=Hola%2C%20me%20gustar%C3%ADa%20un%20dise%C3%B1o%20personalizado', '_blank')}
                        >
                            <MessageCircle size={18} />
                            Hablar por WhatsApp
                        </button>
                    </motion.div>
                    <div className="ed-sh__cta-deco" aria-hidden="true">
                        <div className="ed-sh__cta-ring ed-sh__cta-ring--1" />
                        <div className="ed-sh__cta-ring ed-sh__cta-ring--2" />
                        <div className="ed-sh__cta-ring ed-sh__cta-ring--3" />
                        <span className="ed-sh__cta-star">✦</span>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Shop;
