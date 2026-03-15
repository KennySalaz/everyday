import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, UploadCloud } from 'lucide-react';
import Swal from 'sweetalert2';
import { uploadToBunny } from '../../utils/bunny';
import { ICONS } from '../Pricing';

export default function InventoryModal({ isOpen, onClose, onAdd }) {
    const [invName, setInvName] = useState('');
    const [invType, setInvType] = useState('materia');
    const [invQty, setInvQty] = useState(1);
    const [invTotal, setInvTotal] = useState('');
    const [invIcon, setInvIcon] = useState('Gem');
    const [invImage, setInvImage] = useState(null);
    const [invImagePreview, setInvImagePreview] = useState('');
    const [isInvUploading, setIsInvUploading] = useState(false);
    const [invSku, setInvSku] = useState('');
    const [invLink, setInvLink] = useState('');

    // Reset when closed
    React.useEffect(() => {
        if (!isOpen) {
            setInvName('');
            setInvType('materia');
            setInvQty(1);
            setInvTotal('');
            setInvIcon('Gem');
            setInvImage(null);
            setInvImagePreview('');
            setIsInvUploading(false);
            setInvSku('');
            setInvLink('');
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!invName || !invTotal) return;

        setIsInvUploading(true);
        let finalImageUrl = '';

        if (invImage) {
            try {
                finalImageUrl = await uploadToBunny(invImage, 'inventory');
            } catch (error) {
                Swal.fire('Error', 'No se pudo subir la imagen. ' + error.message, 'error');
                setIsInvUploading(false);
                return;
            }
        }

        const qty = parseInt(invQty) || 1;
        const total = parseFloat(invTotal.replace(/,/g, ''));

        const newItem = {
            id: Date.now().toString(),
            name: invName,
            type: invType,
            totalQty: qty,
            totalPrice: total,
            unitCost: total / qty,
            icon: invIcon,
            imageUrl: finalImageUrl,
            sku: invSku || null,
            link: invLink || null
        };

        await onAdd(newItem);
        setIsInvUploading(false);
        onClose();
    };

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 1000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '1rem'
                        }}
                    >
                        <motion.div
                            className="modal-content admin-card"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            style={{
                                width: '100%',
                                maxWidth: '700px',
                                maxHeight: '90vh',
                                overflowY: 'auto',
                                position: 'relative',
                                padding: '2rem',
                                paddingBottom: '3rem'
                            }}
                        >
                            <button
                                onClick={onClose}
                                style={{
                                    position: 'absolute',
                                    top: '1.5rem',
                                    right: '1.5rem',
                                    background: 'var(--color-background-off)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: 'var(--color-primary)'
                                }}
                            >
                                <X size={20} />
                            </button>

                            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Añadir Insumo</h2>

                            <form onSubmit={handleSubmit}>
                                <div className="form-grid">
                                    <div className="input-group">
                                        <label>Nombre del Material/Empaque</label>
                                        <input
                                            type="text"
                                            className="styled-input"
                                            value={invName}
                                            onChange={e => setInvName(e.target.value)}
                                            placeholder="Ej: Hilo Chino Rojo"
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Tipo</label>
                                        <select className="styled-select" value={invType} onChange={e => setInvType(e.target.value)}>
                                            <option value="materia">Materia Prima</option>
                                            <option value="empaque">Material POP / Empaque</option>
                                            <option value="encamino">En camino</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Precio Total / Paquete ($)</label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{
                                                position: 'absolute',
                                                left: '0.85rem',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                color: 'var(--color-text-light)',
                                                fontWeight: 600,
                                                pointerEvents: 'none',
                                                fontSize: '1rem'
                                            }}>$</span>
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                className="styled-input"
                                                value={invTotal}
                                                onChange={e => {
                                                    // Permitir solo dígitos, comas y punto decimal
                                                    let raw = e.target.value.replace(/[^0-9.,]/g, '');
                                                    // Reemplazar coma por punto si se usa como separador decimal
                                                    // Solo convertir coma a punto si va seguida de dígitos o está al final (no es separador de miles)
                                                    // Regla: si hay coma y la parte después tiene 1-2 dígitos y no hay punto, tratar como decimal
                                                    const commaIndex = raw.indexOf(',');
                                                    const dotIndex = raw.indexOf('.');
                                                    if (commaIndex !== -1 && dotIndex === -1) {
                                                        const afterComma = raw.slice(commaIndex + 1);
                                                        // Si después de la coma hay 0-2 dígitos (decimal) → convertir a punto
                                                        if (afterComma.length <= 2 && !afterComma.includes(',')) {
                                                            raw = raw.slice(0, commaIndex) + '.' + afterComma;
                                                        } else {
                                                            // Es separador de miles → quitarla para re-formatear
                                                            raw = raw.replace(/,/g, '');
                                                        }
                                                    }
                                                    // Evitar múltiples puntos
                                                    const parts = raw.split('.');
                                                    if (parts.length > 2) raw = parts[0] + '.' + parts.slice(1).join('');
                                                    // Formatear parte entera con comas de miles
                                                    const [intPart, decPart] = raw.split('.');
                                                    const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (decPart !== undefined ? '.' + decPart.slice(0, 2) : '');
                                                    setInvTotal(formatted);
                                                }}
                                                placeholder="0.00"
                                                style={{ paddingLeft: '1.8rem' }}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label>Unidades que trae</label>
                                        <input
                                            type="number"
                                            min="1"
                                            className="styled-input"
                                            value={invQty}
                                            onChange={e => setInvQty(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>SKU <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', fontWeight: 400 }}>(Opcional)</span></label>
                                        <input
                                            type="text"
                                            className="styled-input"
                                            value={invSku}
                                            onChange={e => setInvSku(e.target.value)}
                                            placeholder="Ej: MAT-001"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Link del Proveedor <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', fontWeight: 400 }}>(Opcional)</span></label>
                                        <input
                                            type="url"
                                            className="styled-input"
                                            value={invLink}
                                            onChange={e => setInvLink(e.target.value)}
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                <div className="form-grid" style={{ marginBottom: '2rem' }}>
                                    <div className="input-group">
                                        <label>Ícono Representativo</label>
                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                            {Object.keys(ICONS).map(iconKey => (
                                                <button
                                                    type="button"
                                                    key={iconKey}
                                                    onClick={() => {
                                                        setInvIcon(iconKey);
                                                        setInvImage(null);
                                                        setInvImagePreview('');
                                                    }}
                                                    style={{
                                                        padding: '0.5rem',
                                                        borderRadius: '8px',
                                                        border: (invIcon === iconKey && !invImagePreview) ? '2px solid var(--color-accent)' : '2px solid transparent',
                                                        background: (invIcon === iconKey && !invImagePreview) ? 'rgba(212, 175, 55, 0.1)' : 'var(--color-background-off)',
                                                        color: (invIcon === iconKey && !invImagePreview) ? 'var(--color-accent)' : 'var(--color-text-light)',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {ICONS[iconKey]}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label>Ó sube una Foto (Opcional)</label>
                                        <div style={{
                                            border: '2px dashed #cbd5e1',
                                            borderRadius: '16px',
                                            padding: '1.5rem',
                                            textAlign: 'center',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            background: 'var(--color-background-off)',
                                            height: '140px'
                                        }} onClick={() => document.getElementById('inv-image-upload').click()}>
                                            {(invImagePreview || invImage) ? (
                                                <>
                                                    <img
                                                        src={invImagePreview}
                                                        alt="Preview"
                                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setInvImage(null);
                                                            setInvImagePreview('');
                                                        }}
                                                        style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer', zIndex: 10 }}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <UploadCloud size={28} color="var(--color-accent)" style={{ marginBottom: '0.5rem' }} />
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', fontWeight: 500 }}>
                                                        Haz clic para subir foto
                                                    </span>
                                                </>
                                            )}
                                            <input
                                                id="inv-image-upload"
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setInvImage(file);
                                                        setInvImagePreview(URL.createObjectURL(file));
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary"
                                    style={{ width: '100%', opacity: isInvUploading ? 0.7 : 1, pointerEvents: isInvUploading ? 'none' : 'auto' }}
                                    disabled={isInvUploading}
                                >
                                    {isInvUploading ? 'Subiendo...' : <><Plus size={20} /> Guardar Insumo</>}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
