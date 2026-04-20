import React, { useState } from 'react';
import './ColorExplorer.css';

const PALETTE = [
    { hex: '#63422B', name: 'Caoba',      role: 'Principal fuerte' },
    { hex: '#A28E7E', name: 'Arena',       role: 'Principal medio' },
    { hex: '#595757', name: 'Carbón',      role: 'Principal oscuro' },
    { hex: '#C6C0BA', name: 'Piedra',      role: 'Complementario' },
    { hex: '#E0E0DF', name: 'Humo',        role: 'Fondo claro' },
];

const COMBOS = [
    {
        id: 1,
        name: 'Tierra Cálida',
        desc: 'Elegante y cálido. Caoba como protagonista.',
        bg: '#63422B',
        surface: '#A28E7E',
        text: '#E0E0DF',
        accent: '#C6C0BA',
        btn: '#E0E0DF',
        btnText: '#63422B',
    },
    {
        id: 2,
        name: 'Minimalismo Arena',
        desc: 'Suave y sofisticado. Fondos claros con toques terrosos.',
        bg: '#E0E0DF',
        surface: '#fff',
        text: '#63422B',
        accent: '#A28E7E',
        btn: '#63422B',
        btnText: '#fff',
    },
    {
        id: 3,
        name: 'Editorial Oscuro',
        desc: 'Oscuro y editorial. Gran contraste con carbón.',
        bg: '#595757',
        surface: '#63422B',
        text: '#E0E0DF',
        accent: '#C6C0BA',
        btn: '#E0E0DF',
        btnText: '#595757',
    },
    {
        id: 4,
        name: 'Crema & Caoba',
        desc: 'Limpio y lujoso. Ideal para joyería fina.',
        bg: '#E0E0DF',
        surface: '#C6C0BA',
        text: '#595757',
        accent: '#63422B',
        btn: '#63422B',
        btnText: '#E0E0DF',
    },
    {
        id: 5,
        name: 'Neutros Puros',
        desc: 'Moderno y neutro. Todo en grises cálidos.',
        bg: '#C6C0BA',
        surface: '#E0E0DF',
        text: '#595757',
        accent: '#A28E7E',
        btn: '#595757',
        btnText: '#E0E0DF',
    },
    {
        id: 6,
        name: 'Profundo & Suave',
        desc: 'Carbón como base, arena como respiración.',
        bg: '#595757',
        surface: '#A28E7E',
        text: '#E0E0DF',
        accent: '#63422B',
        btn: '#63422B',
        btnText: '#E0E0DF',
    },
    {
        id: 7,
        name: 'Vintage Terroso',
        desc: 'Caoba claro + piedra. Cálido y artesanal.',
        bg: '#A28E7E',
        surface: '#E0E0DF',
        text: '#63422B',
        accent: '#595757',
        btn: '#63422B',
        btnText: '#fff',
    },
    {
        id: 8,
        name: 'Lúgubre Elegante',
        desc: 'Muy oscuro con acentos cálidos. Drama y lujo.',
        bg: '#1a1210',
        surface: '#63422B',
        text: '#C6C0BA',
        accent: '#A28E7E',
        btn: '#A28E7E',
        btnText: '#1a1210',
    },
    {
        id: 9,
        name: 'Polvo de Rosa',
        desc: 'Arena dominante con detalles carbón. Ultra femenino.',
        bg: '#A28E7E',
        surface: '#C6C0BA',
        text: '#595757',
        accent: '#63422B',
        btn: '#595757',
        btnText: '#E0E0DF',
    },
];

function copied(hex, setCopied) {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1500);
}

function Swatch({ color, copiedHex, setCopied }) {
    const isCopied = copiedHex === color.hex;
    return (
        <div className="ce-swatch" onClick={() => copied(color.hex, setCopied)}>
            <div className="ce-swatch-color" style={{ background: color.hex }} />
            <div className="ce-swatch-info">
                <span className="ce-swatch-name">{color.name}</span>
                <span className="ce-swatch-role">{color.role}</span>
                <span className="ce-swatch-hex">{isCopied ? '¡Copiado!' : color.hex}</span>
            </div>
        </div>
    );
}

function ComboCard({ combo, onSelect, selected }) {
    return (
        <div
            className={`ce-card ${selected ? 'ce-card--active' : ''}`}
            style={{ background: combo.bg, borderColor: selected ? combo.accent : 'transparent' }}
            onClick={() => onSelect(combo)}
        >
            {selected && <div className="ce-badge" style={{ background: combo.accent, color: combo.bg }}>✓ Seleccionada</div>}

            {/* Navbar simulada */}
            <div className="ce-mock-nav" style={{ background: combo.surface }}>
                <span style={{ color: combo.text, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.08em' }}>EVERYDAY</span>
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                    {['Inicio','Tienda'].map(n => (
                        <span key={n} style={{ color: combo.accent, fontSize: '0.6rem', fontWeight: 600 }}>{n}</span>
                    ))}
                </div>
            </div>

            {/* Hero simulado */}
            <div className="ce-mock-hero" style={{ background: combo.bg }}>
                <div className="ce-mock-tag" style={{ background: combo.accent, color: combo.bg }}>Colección</div>
                <div className="ce-mock-title" style={{ color: combo.text }}>Everyday</div>
                <div className="ce-mock-sub" style={{ color: combo.accent }}>Zarcillos · Cadenas · Anillos</div>
                <div className="ce-mock-btn" style={{ background: combo.btn, color: combo.btnText }}>
                    Ver Tienda →
                </div>
            </div>

            {/* Cards de producto */}
            <div className="ce-mock-cards">
                {[1,2,3].map(i => (
                    <div key={i} className="ce-mock-product" style={{ background: combo.surface }}>
                        <div className="ce-mock-img" style={{ background: combo.accent }} />
                        <div className="ce-mock-prod-title" style={{ color: combo.text }} />
                        <div className="ce-mock-prod-price" style={{ background: combo.btn, borderRadius: 4 }} />
                    </div>
                ))}
            </div>

            {/* Info */}
            <div className="ce-card-footer">
                <strong style={{ color: combo.text }}>{combo.name}</strong>
                <p style={{ color: combo.accent }}>{combo.desc}</p>
                <div className="ce-card-dots">
                    {[combo.bg, combo.surface, combo.text, combo.accent, combo.btn].map((c, i) => (
                        <span key={i} className="ce-dot" style={{ background: c, border: `2px solid ${combo.accent}` }} title={c} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function ColorExplorer() {
    const [selected, setSelected] = useState(null);
    const [copiedHex, setCopied] = useState(null);

    return (
        <div className="ce-root">
            <div className="ce-header">
                <h1>🎨 Explorador de Paleta</h1>
                <p>Haz clic en cualquier combinación para seleccionarla. Haz clic en un color para copiar el HEX.</p>
            </div>

            {/* Paleta base */}
            <section className="ce-section">
                <h2>Paleta base</h2>
                <div className="ce-swatches">
                    {PALETTE.map(c => (
                        <Swatch key={c.hex} color={c} copiedHex={copiedHex} setCopied={setCopied} />
                    ))}
                </div>
            </section>

            {/* Combinaciones */}
            <section className="ce-section">
                <h2>Combinaciones de estilo <span>({COMBOS.length} opciones)</span></h2>
                <div className="ce-grid">
                    {COMBOS.map(combo => (
                        <ComboCard
                            key={combo.id}
                            combo={combo}
                            selected={selected?.id === combo.id}
                            onSelect={setSelected}
                        />
                    ))}
                </div>
            </section>

            {/* Panel de selección */}
            {selected && (
                <section className="ce-selected-panel">
                    <h2>✅ Combinación elegida: <em>{selected.name}</em></h2>
                    <p>{selected.desc}</p>
                    <div className="ce-selected-colors">
                        {[
                            { label: 'Fondo',       val: selected.bg },
                            { label: 'Superficie',  val: selected.surface },
                            { label: 'Texto',       val: selected.text },
                            { label: 'Acento',      val: selected.accent },
                            { label: 'Botón',       val: selected.btn },
                            { label: 'Texto Botón', val: selected.btnText },
                        ].map(item => (
                            <div key={item.label} className="ce-selected-row" onClick={() => copied(item.val, setCopied)}>
                                <div className="ce-selected-dot" style={{ background: item.val }} />
                                <span className="ce-selected-label">{item.label}</span>
                                <code className="ce-selected-code">
                                    {copiedHex === item.val ? '¡Copiado!' : item.val}
                                </code>
                            </div>
                        ))}
                    </div>
                    <div className="ce-css-block">
                        <p>📋 Variables CSS listas para copiar:</p>
                        <pre>{`--color-bg:       ${selected.bg};
--color-surface:  ${selected.surface};
--color-text:     ${selected.text};
--color-accent:   ${selected.accent};
--color-btn:      ${selected.btn};
--color-btn-text: ${selected.btnText};`}</pre>
                        <button onClick={() => {
                            navigator.clipboard.writeText(
`--color-bg:       ${selected.bg};
--color-surface:  ${selected.surface};
--color-text:     ${selected.text};
--color-accent:   ${selected.accent};
--color-btn:      ${selected.btn};
--color-btn-text: ${selected.btnText};`
                            );
                            setCopied('block');
                        }}>
                            {copiedHex === 'block' ? '¡Copiado!' : '📋 Copiar todo'}
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
}
