import React from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pencil, Tag, Hash, Link as LinkIcon, Package, TrendingUp, Clock, Box, Gem, Scissors } from 'lucide-react';
import { ICONS } from '../Pricing';
import './InventoryDetailModal.css';

const TYPE_LABEL = { materia: 'Materia Prima', empaque: 'Material POP / Empaque', encamino: 'En camino' };

const formatUnitCost = (value) => {
    if (!value && value !== 0) return '0.00';
    const fixed3 = value.toFixed(3);
    const trimmed = parseFloat(fixed3).toString();
    const parts = trimmed.split('.');
    if (!parts[1] || parts[1].length < 2) return parseFloat(fixed3).toFixed(2);
    return trimmed;
};

export default function InventoryDetailModal({ isOpen, onClose, item, onEdit }) {
    if (!item) return null;

    const history = item.priceHistory || [];
    const hasLink = item.link && item.link.trim() !== '';
    const hasSku = item.sku && item.sku.trim() !== '';

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="idd-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="idd-panel"
                        initial={{ opacity: 0, x: 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 60 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header con imagen de fondo */}
                        <div className="idd-hero">
                            {item.imageUrl ? (
                                <>
                                    <div className="idd-hero-bg" style={{ backgroundImage: `url(${item.imageUrl})` }} />
                                    <div className="idd-hero-overlay" />
                                    <img src={item.imageUrl} alt={item.name} className="idd-hero-img" />
                                </>
                            ) : (
                                <div className="idd-hero-icon">
                                    {ICONS[item.icon] || <Box size={56} />}
                                </div>
                            )}

                            {/* Acciones top */}
                            <div className="idd-hero-actions">
                                <button className="idd-action-btn" onClick={onClose}>
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Badge tipo */}
                            <div className="idd-hero-footer">
                                <span className="idd-type-badge">{TYPE_LABEL[item.type] || item.type}</span>
                            </div>
                        </div>

                        {/* Contenido scroll */}
                        <div className="idd-body">

                            {/* Nombre + botón editar */}
                            <div className="idd-name-row">
                                <h2 className="idd-name">{item.name}</h2>
                                <button className="idd-edit-btn" onClick={() => { onClose(); onEdit(item); }}>
                                    <Pencil size={15} /> Editar
                                </button>
                            </div>

                            {/* Chips SKU y Link */}
                            {(hasSku || hasLink) && (
                                <div className="idd-chips">
                                    {hasSku && (
                                        <span className="idd-chip">
                                            <Hash size={13} /> {item.sku}
                                        </span>
                                    )}
                                    {hasLink && (
                                        <a className="idd-chip link" href={item.link} target="_blank" rel="noopener noreferrer">
                                            <LinkIcon size={13} /> Ver proveedor
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* Stats principales */}
                            <div className="idd-stats-grid">
                                <div className="idd-stat-card accent">
                                    <p className="idd-stat-label">Costo c/u</p>
                                    <p className="idd-stat-val">${formatUnitCost(item.unitCost)}</p>
                                </div>
                                <div className="idd-stat-card">
                                    <p className="idd-stat-label">Precio paquete</p>
                                    <p className="idd-stat-val">${item.totalPrice?.toFixed(2)}</p>
                                </div>
                                <div className="idd-stat-card">
                                    <p className="idd-stat-label">Unidades</p>
                                    <p className="idd-stat-val">x{item.totalQty}</p>
                                </div>
                                <div className="idd-stat-card">
                                    <p className="idd-stat-label">Actualizaciones</p>
                                    <p className="idd-stat-val">{history.length}</p>
                                </div>
                            </div>

                            {/* Historial de precios */}
                            <div className="idd-section">
                                <div className="idd-section-header">
                                    <TrendingUp size={16} />
                                    <h3>Historial de precios</h3>
                                </div>

                                {history.length === 0 ? (
                                    <div className="idd-empty-history">
                                        <Clock size={24} style={{ opacity: 0.35 }} />
                                        <p>Sin cambios registrados aún</p>
                                    </div>
                                ) : (
                                    <div className="idd-history-list">
                                        {/* Precio actual primero */}
                                        <div className="idd-history-row current">
                                            <div className="idd-history-dot current" />
                                            <div className="idd-history-info">
                                                <span className="idd-history-price">${item.totalPrice?.toFixed(2)}</span>
                                                <span className="idd-history-qty">x{item.totalQty} uds · ${formatUnitCost(item.unitCost)} c/u</span>
                                            </div>
                                            <span className="idd-history-badge">Actual</span>
                                        </div>
                                        {/* Historial anterior (más reciente primero) */}
                                        {[...history].reverse().map((h, i) => (
                                            <div key={i} className="idd-history-row">
                                                <div className="idd-history-dot" />
                                                <div className="idd-history-info">
                                                    <span className="idd-history-price">${h.price?.toFixed(2)}</span>
                                                    <span className="idd-history-qty">x{h.qty} uds · ${formatUnitCost(h.price / h.qty)} c/u</span>
                                                </div>
                                                <span className="idd-history-date">{h.date}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
