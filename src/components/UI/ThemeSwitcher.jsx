import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeSwitcher.css';

const FILTERS = [
    { id: 'all',   label: 'Todos' },
    { id: 'light', label: '☀️ Claros' },
    { id: 'dark',  label: '🌙 Oscuros' },
    { id: 'warm',  label: '🔥 Cálidos' },
    { id: 'cool',  label: '❄️ Fríos' },
];

const THEME_TAGS = {
    original:      ['light', 'warm'],
    tierra:        ['light', 'warm'],
    carbon:        ['dark',  'warm'],
    arena:         ['light', 'warm'],
    noche:         ['dark',  'warm'],
    piedra:        ['light', 'cool'],
    humo:          ['light', 'cool'],
    tostado:       ['dark',  'warm'],
    marfil:        ['light', 'cool'],
    vintage:       ['light', 'warm'],
    rosa:          ['light', 'warm'],
    sage:          ['light', 'cool'],
    slate:         ['light', 'cool'],
    obsidiana:     ['dark',  'cool'],
    'crema-luxury':['light', 'warm'],
};

function MiniPreview({ theme }) {
    return (
        <div className="ts-preview" style={{ background: theme.vars['--theme-bg'] }}>
            <div className="ts-prev-nav" style={{ background: theme.vars['--theme-surface'] }}>
                <span style={{ color: theme.vars['--theme-text'], fontWeight: 800, fontSize: '0.55rem', letterSpacing: '0.1em' }}>EVERYDAY</span>
                <span style={{ color: theme.vars['--theme-primary'], fontSize: '0.45rem' }}>Tienda</span>
            </div>
            <div className="ts-prev-hero" style={{ background: theme.vars['--theme-primary'] }}>
                <div style={{ color: theme.vars['--theme-btn-text'], fontWeight: 700, fontSize: '0.7rem' }}>Everyday</div>
                <div style={{ background: theme.vars['--theme-btn-bg'], color: theme.vars['--theme-btn-text'], borderRadius: 4, padding: '1px 6px', fontSize: '0.45rem', width: 'fit-content', marginTop: 2 }}>Ver tienda</div>
            </div>
            <div className="ts-prev-cards" style={{ background: theme.vars['--theme-bg-off'] }}>
                {[0,1,2].map(i => (
                    <div key={i} className="ts-prev-card" style={{ background: theme.vars['--theme-surface'] }}>
                        <div style={{ background: theme.vars['--theme-primary'], height: 18, borderRadius: '4px 4px 0 0', opacity: 0.5 }} />
                        <div style={{ padding: '3px 4px' }}>
                            <div style={{ background: theme.vars['--theme-text'], height: 3, borderRadius: 2, opacity: 0.3, marginBottom: 2 }} />
                            <div style={{ background: theme.vars['--theme-primary'], height: 3, borderRadius: 2, width: '60%' }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ThemeSwitcher() {
    const { activeTheme, setTheme, themes } = useTheme();
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState('all');
    const [hovered, setHovered] = useState(null);
    const [copied, setCopied] = useState(null);

    const filtered = themes.filter(t =>
        filter === 'all' || (THEME_TAGS[t.id] || []).includes(filter)
    );

    const preview = hovered || activeTheme;

    const copyHex = (val) => {
        navigator.clipboard.writeText(val);
        setCopied(val);
        setTimeout(() => setCopied(null), 1400);
    };

    return (
        <>
            {/* Botón trigger */}
            <button
                className={`ts-trigger ${open ? 'ts-trigger--open' : ''}`}
                onClick={() => setOpen(o => !o)}
                title="Cambiar tema"
                style={{ background: open ? activeTheme.vars['--theme-primary'] : '#1a1a1a' }}
            >
                <span className="ts-trigger-dot" style={{ background: activeTheme.vars['--theme-primary'], border: open ? '2px solid rgba(255,255,255,0.6)' : '2px solid rgba(255,255,255,0.2)' }} />
                <span className="ts-trigger-label">{open ? '✕' : '🎨'}</span>
            </button>

            {/* Panel */}
            {open && (
                <div className="ts-panel">

                    {/* Header */}
                    <div className="ts-panel-header" style={{ background: activeTheme.vars['--theme-primary'] }}>
                        <div className="ts-header-left">
                            <span className="ts-header-title">Temas de color</span>
                            <span className="ts-header-count">{themes.length} opciones</span>
                        </div>
                        <div className="ts-header-active">
                            <span>{activeTheme.emoji}</span>
                            <span>{activeTheme.name}</span>
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="ts-filters">
                        {FILTERS.map(f => (
                            <button
                                key={f.id}
                                className={`ts-filter-btn ${filter === f.id ? 'ts-filter-btn--active' : ''}`}
                                onClick={() => setFilter(f.id)}
                                style={filter === f.id ? {
                                    background: activeTheme.vars['--theme-primary'],
                                    color: activeTheme.vars['--theme-btn-text'],
                                    borderColor: activeTheme.vars['--theme-primary'],
                                } : {}}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Grid de temas */}
                    <div className="ts-grid">
                        {filtered.map(theme => {
                            const isActive = theme.id === activeTheme.id;
                            const isHovered = hovered?.id === theme.id;
                            return (
                                <button
                                    key={theme.id}
                                    className={`ts-card ${isActive ? 'ts-card--active' : ''} ${isHovered ? 'ts-card--hovered' : ''}`}
                                    style={{
                                        background: theme.vars['--theme-bg'],
                                        borderColor: isActive
                                            ? theme.vars['--theme-primary']
                                            : isHovered
                                            ? theme.vars['--theme-primary'] + '88'
                                            : 'transparent',
                                    }}
                                    onClick={() => setTheme(theme.id)}
                                    onMouseEnter={() => setHovered(theme)}
                                    onMouseLeave={() => setHovered(null)}
                                >
                                    {/* Barra degradé de colores */}
                                    <div className="ts-color-bar">
                                        {[
                                            theme.vars['--theme-bg'],
                                            theme.vars['--theme-surface'],
                                            theme.vars['--theme-primary'],
                                            theme.vars['--theme-text'],
                                            theme.vars['--theme-btn-bg'],
                                        ].map((c, i) => (
                                            <span key={i} className="ts-bar-seg" style={{ background: c }} />
                                        ))}
                                    </div>

                                    {/* Info */}
                                    <div className="ts-card-body">
                                        <span className="ts-card-emoji">{theme.emoji}</span>
                                        <div className="ts-card-text">
                                            <strong style={{ color: theme.vars['--theme-text'] }}>{theme.name}</strong>
                                            <span style={{ color: theme.vars['--theme-primary'] }}>{theme.desc}</span>
                                        </div>
                                        {isActive && (
                                            <span className="ts-check-badge" style={{ background: theme.vars['--theme-primary'], color: theme.vars['--theme-btn-text'] }}>✓</span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Live Preview */}
                    <div className="ts-live-preview">
                        <div className="ts-live-label">
                            Preview: <strong>{preview.emoji} {preview.name}</strong>
                        </div>
                        <MiniPreview theme={preview} />
                    </div>

                    {/* Códigos HEX */}
                    <div className="ts-footer" style={{ background: activeTheme.vars['--theme-bg-off'] }}>
                        <p style={{ color: activeTheme.vars['--theme-text-soft'] }}>
                            Colores de <strong style={{ color: activeTheme.vars['--theme-primary'] }}>{activeTheme.name}</strong> — clic para copiar
                        </p>
                        <div className="ts-codes">
                            {[
                                ['Fondo',      activeTheme.vars['--theme-bg']],
                                ['Principal',  activeTheme.vars['--theme-primary']],
                                ['Texto',      activeTheme.vars['--theme-text']],
                                ['Superficie', activeTheme.vars['--theme-surface']],
                                ['Botón',      activeTheme.vars['--theme-btn-bg']],
                            ].map(([label, val]) => (
                                <div key={label} className="ts-code-row" onClick={() => copyHex(val)} title="Clic para copiar">
                                    <span className="ts-code-dot" style={{ background: val }} />
                                    <span className="ts-code-label" style={{ color: activeTheme.vars['--theme-text-soft'] }}>{label}</span>
                                    <code className="ts-code-hex" style={{ color: activeTheme.vars['--theme-primary'] }}>
                                        {copied === val ? '¡Copiado! ✓' : val}
                                    </code>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
