import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = [
    {
        id: 'original',
        name: 'Dorado Clásico',
        emoji: '✨',
        desc: 'El original Everyday',
        vars: {
            '--theme-bg':           '#ffffff',
            '--theme-bg-off':       '#FAF8F4',
            '--theme-surface':      '#f5f0ea',
            '--theme-primary':      '#C9A84C',
            '--theme-primary-dark': '#9A7A30',
            '--theme-primary-light':'#E8C97A',
            '--theme-text':         '#1A1A1A',
            '--theme-text-soft':    '#6B6B6B',
            '--theme-border':       'rgba(201,168,76,0.2)',
            '--theme-nav-bg':       'rgba(255,255,255,0.97)',
            '--theme-nav-text':     '#1A1A1A',
            '--theme-btn-bg':       '#C9A84C',
            '--theme-btn-text':     '#ffffff',
            '--theme-hero-overlay': 'rgba(0,0,0,0.45)',
        },
    },
    {
        id: 'tierra',
        name: 'Tierra Cálida',
        emoji: '🌿',
        desc: 'Caoba y crema artesanal',
        vars: {
            '--theme-bg':           '#E0E0DF',
            '--theme-bg-off':       '#C6C0BA',
            '--theme-surface':      '#ffffff',
            '--theme-primary':      '#63422B',
            '--theme-primary-dark': '#3d2818',
            '--theme-primary-light':'#A28E7E',
            '--theme-text':         '#63422B',
            '--theme-text-soft':    '#595757',
            '--theme-border':       'rgba(99,66,43,0.18)',
            '--theme-nav-bg':       'rgba(224,224,223,0.97)',
            '--theme-nav-text':     '#63422B',
            '--theme-btn-bg':       '#63422B',
            '--theme-btn-text':     '#E0E0DF',
            '--theme-hero-overlay': 'rgba(99,66,43,0.55)',
        },
    },
    {
        id: 'carbon',
        name: 'Editorial Oscuro',
        emoji: '🖤',
        desc: 'Carbón y humo minimalista',
        vars: {
            '--theme-bg':           '#595757',
            '--theme-bg-off':       '#3e3d3d',
            '--theme-surface':      '#63422B',
            '--theme-primary':      '#C6C0BA',
            '--theme-primary-dark': '#A28E7E',
            '--theme-primary-light':'#E0E0DF',
            '--theme-text':         '#E0E0DF',
            '--theme-text-soft':    '#C6C0BA',
            '--theme-border':       'rgba(224,224,223,0.15)',
            '--theme-nav-bg':       'rgba(89,87,87,0.97)',
            '--theme-nav-text':     '#E0E0DF',
            '--theme-btn-bg':       '#E0E0DF',
            '--theme-btn-text':     '#595757',
            '--theme-hero-overlay': 'rgba(30,28,28,0.6)',
        },
    },
    {
        id: 'arena',
        name: 'Minimalismo Arena',
        emoji: '🏜️',
        desc: 'Fondo claro, detalles terrosos',
        vars: {
            '--theme-bg':           '#FAF8F4',
            '--theme-bg-off':       '#E0E0DF',
            '--theme-surface':      '#ffffff',
            '--theme-primary':      '#A28E7E',
            '--theme-primary-dark': '#63422B',
            '--theme-primary-light':'#C6C0BA',
            '--theme-text':         '#595757',
            '--theme-text-soft':    '#A28E7E',
            '--theme-border':       'rgba(162,142,126,0.2)',
            '--theme-nav-bg':       'rgba(250,248,244,0.97)',
            '--theme-nav-text':     '#595757',
            '--theme-btn-bg':       '#A28E7E',
            '--theme-btn-text':     '#ffffff',
            '--theme-hero-overlay': 'rgba(89,87,87,0.5)',
        },
    },
    {
        id: 'noche',
        name: 'Noche Profunda',
        emoji: '🌙',
        desc: 'Oscuro lujoso con caoba',
        vars: {
            '--theme-bg':           '#141010',
            '--theme-bg-off':       '#1e1916',
            '--theme-surface':      '#63422B',
            '--theme-primary':      '#A28E7E',
            '--theme-primary-dark': '#63422B',
            '--theme-primary-light':'#C6C0BA',
            '--theme-text':         '#E0E0DF',
            '--theme-text-soft':    '#A28E7E',
            '--theme-border':       'rgba(162,142,126,0.2)',
            '--theme-nav-bg':       'rgba(20,16,16,0.97)',
            '--theme-nav-text':     '#E0E0DF',
            '--theme-btn-bg':       '#A28E7E',
            '--theme-btn-text':     '#141010',
            '--theme-hero-overlay': 'rgba(10,8,6,0.65)',
        },
    },
    {
        id: 'piedra',
        name: 'Piedra & Caoba',
        emoji: '🪨',
        desc: 'Neutros con acento cálido',
        vars: {
            '--theme-bg':           '#C6C0BA',
            '--theme-bg-off':       '#E0E0DF',
            '--theme-surface':      '#ffffff',
            '--theme-primary':      '#63422B',
            '--theme-primary-dark': '#3d2818',
            '--theme-primary-light':'#A28E7E',
            '--theme-text':         '#595757',
            '--theme-text-soft':    '#A28E7E',
            '--theme-border':       'rgba(99,66,43,0.15)',
            '--theme-nav-bg':       'rgba(198,192,186,0.97)',
            '--theme-nav-text':     '#595757',
            '--theme-btn-bg':       '#595757',
            '--theme-btn-text':     '#E0E0DF',
            '--theme-hero-overlay': 'rgba(89,87,87,0.5)',
        },
    },
    {
        id: 'humo',
        name: 'Humo & Oro',
        emoji: '🌫️',
        desc: 'Plateado frío con dorado',
        vars: {
            '--theme-bg':           '#E0E0DF',
            '--theme-bg-off':       '#f0f0ef',
            '--theme-surface':      '#ffffff',
            '--theme-primary':      '#C9A84C',
            '--theme-primary-dark': '#9A7A30',
            '--theme-primary-light':'#E8C97A',
            '--theme-text':         '#595757',
            '--theme-text-soft':    '#A28E7E',
            '--theme-border':       'rgba(201,168,76,0.2)',
            '--theme-nav-bg':       'rgba(224,224,223,0.97)',
            '--theme-nav-text':     '#595757',
            '--theme-btn-bg':       '#C9A84C',
            '--theme-btn-text':     '#ffffff',
            '--theme-hero-overlay': 'rgba(89,87,87,0.55)',
        },
    },
    {
        id: 'tostado',
        name: 'Tostado Premium',
        emoji: '☕',
        desc: 'Café oscuro y crema suave',
        vars: {
            '--theme-bg':           '#2C1F14',
            '--theme-bg-off':       '#3d2d1e',
            '--theme-surface':      '#4d3928',
            '--theme-primary':      '#C6C0BA',
            '--theme-primary-dark': '#A28E7E',
            '--theme-primary-light':'#E0E0DF',
            '--theme-text':         '#E0E0DF',
            '--theme-text-soft':    '#C6C0BA',
            '--theme-border':       'rgba(198,192,186,0.15)',
            '--theme-nav-bg':       'rgba(44,31,20,0.97)',
            '--theme-nav-text':     '#E0E0DF',
            '--theme-btn-bg':       '#C6C0BA',
            '--theme-btn-text':     '#2C1F14',
            '--theme-hero-overlay': 'rgba(20,12,6,0.65)',
        },
    },
    {
        id: 'marfil',
        name: 'Marfil & Sombra',
        emoji: '🕊️',
        desc: 'Blanco puro con sombras suaves',
        vars: {
            '--theme-bg':           '#FEFEFE',
            '--theme-bg-off':       '#F5F2EE',
            '--theme-surface':      '#FFFFFF',
            '--theme-primary':      '#595757',
            '--theme-primary-dark': '#3e3d3d',
            '--theme-primary-light':'#A28E7E',
            '--theme-text':         '#2C2C2C',
            '--theme-text-soft':    '#888',
            '--theme-border':       'rgba(89,87,87,0.12)',
            '--theme-nav-bg':       'rgba(254,254,254,0.97)',
            '--theme-nav-text':     '#2C2C2C',
            '--theme-btn-bg':       '#595757',
            '--theme-btn-text':     '#ffffff',
            '--theme-hero-overlay': 'rgba(40,38,38,0.5)',
        },
    },
    {
        id: 'vintage',
        name: 'Vintage Cobre',
        emoji: '🏺',
        desc: 'Cobre y pergamino antiguo',
        vars: {
            '--theme-bg':           '#F2EAD3',
            '--theme-bg-off':       '#E8DFC4',
            '--theme-surface':      '#FFF8ED',
            '--theme-primary':      '#8B5E3C',
            '--theme-primary-dark': '#5e3d26',
            '--theme-primary-light':'#C4956A',
            '--theme-text':         '#3D2B1F',
            '--theme-text-soft':    '#8B5E3C',
            '--theme-border':       'rgba(139,94,60,0.2)',
            '--theme-nav-bg':       'rgba(242,234,211,0.97)',
            '--theme-nav-text':     '#3D2B1F',
            '--theme-btn-bg':       '#8B5E3C',
            '--theme-btn-text':     '#F2EAD3',
            '--theme-hero-overlay': 'rgba(61,43,31,0.55)',
        },
    },
    {
        id: 'rosa',
        name: 'Rosa Polvo',
        emoji: '🌸',
        desc: 'Femenino, suave y elegante',
        vars: {
            '--theme-bg':           '#FDF0EC',
            '--theme-bg-off':       '#F5E0D8',
            '--theme-surface':      '#ffffff',
            '--theme-primary':      '#C4756A',
            '--theme-primary-dark': '#9A4D44',
            '--theme-primary-light':'#E0A99F',
            '--theme-text':         '#4A2E2A',
            '--theme-text-soft':    '#A28E7E',
            '--theme-border':       'rgba(196,117,106,0.2)',
            '--theme-nav-bg':       'rgba(253,240,236,0.97)',
            '--theme-nav-text':     '#4A2E2A',
            '--theme-btn-bg':       '#C4756A',
            '--theme-btn-text':     '#ffffff',
            '--theme-hero-overlay': 'rgba(74,46,42,0.5)',
        },
    },
    {
        id: 'sage',
        name: 'Sage & Oro',
        emoji: '🌱',
        desc: 'Verde salvia con detalles dorados',
        vars: {
            '--theme-bg':           '#F0F2EE',
            '--theme-bg-off':       '#E2E6DE',
            '--theme-surface':      '#ffffff',
            '--theme-primary':      '#7A8C6E',
            '--theme-primary-dark': '#556350',
            '--theme-primary-light':'#A8B89A',
            '--theme-text':         '#2E3628',
            '--theme-text-soft':    '#7A8C6E',
            '--theme-border':       'rgba(122,140,110,0.2)',
            '--theme-nav-bg':       'rgba(240,242,238,0.97)',
            '--theme-nav-text':     '#2E3628',
            '--theme-btn-bg':       '#7A8C6E',
            '--theme-btn-text':     '#ffffff',
            '--theme-hero-overlay': 'rgba(46,54,40,0.55)',
        },
    },
    {
        id: 'slate',
        name: 'Slate Moderno',
        emoji: '🩶',
        desc: 'Gris azulado ultra moderno',
        vars: {
            '--theme-bg':           '#F1F3F6',
            '--theme-bg-off':       '#E2E6EC',
            '--theme-surface':      '#ffffff',
            '--theme-primary':      '#4A5568',
            '--theme-primary-dark': '#2D3748',
            '--theme-primary-light':'#718096',
            '--theme-text':         '#1A202C',
            '--theme-text-soft':    '#718096',
            '--theme-border':       'rgba(74,85,104,0.15)',
            '--theme-nav-bg':       'rgba(241,243,246,0.97)',
            '--theme-nav-text':     '#1A202C',
            '--theme-btn-bg':       '#4A5568',
            '--theme-btn-text':     '#ffffff',
            '--theme-hero-overlay': 'rgba(26,32,44,0.55)',
        },
    },
    {
        id: 'obsidiana',
        name: 'Obsidiana',
        emoji: '🔮',
        desc: 'Negro total, ultra lujoso',
        vars: {
            '--theme-bg':           '#0A0A0A',
            '--theme-bg-off':       '#111111',
            '--theme-surface':      '#1A1A1A',
            '--theme-primary':      '#E8C97A',
            '--theme-primary-dark': '#C9A84C',
            '--theme-primary-light':'#F5E4B0',
            '--theme-text':         '#F5F5F5',
            '--theme-text-soft':    '#A0A0A0',
            '--theme-border':       'rgba(232,201,122,0.15)',
            '--theme-nav-bg':       'rgba(10,10,10,0.98)',
            '--theme-nav-text':     '#F5F5F5',
            '--theme-btn-bg':       '#E8C97A',
            '--theme-btn-text':     '#0A0A0A',
            '--theme-hero-overlay': 'rgba(0,0,0,0.7)',
        },
    },
    {
        id: 'crema-luxury',
        name: 'Crema Luxury',
        emoji: '🍦',
        desc: 'Crema pura, sofisticado y limpio',
        vars: {
            '--theme-bg':           '#FFFFF8',
            '--theme-bg-off':       '#F8F5EE',
            '--theme-surface':      '#FFFFFF',
            '--theme-primary':      '#63422B',
            '--theme-primary-dark': '#3d2818',
            '--theme-primary-light':'#C6C0BA',
            '--theme-text':         '#1A1A1A',
            '--theme-text-soft':    '#595757',
            '--theme-border':       'rgba(99,66,43,0.12)',
            '--theme-nav-bg':       'rgba(255,255,248,0.97)',
            '--theme-nav-text':     '#1A1A1A',
            '--theme-btn-bg':       '#63422B',
            '--theme-btn-text':     '#FFFFF8',
            '--theme-hero-overlay': 'rgba(26,26,26,0.5)',
        },
    },
];

const ThemeContext = createContext(null);

function applyTheme(theme) {
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([key, val]) => {
        root.style.setProperty(key, val);
    });
    // También actualizar las variables globales que usa Home.css
    root.style.setProperty('--gold',       theme.vars['--theme-primary']);
    root.style.setProperty('--gold-light', theme.vars['--theme-primary-light']);
    root.style.setProperty('--gold-dark',  theme.vars['--theme-primary-dark']);
    root.style.setProperty('--cream',      theme.vars['--theme-bg-off']);
    root.style.setProperty('--dark',       theme.vars['--theme-text']);
    root.style.setProperty('--gray',       theme.vars['--theme-text-soft']);
    root.style.setProperty('--border',     theme.vars['--theme-border']);
    root.style.setProperty('--color-primary',    theme.vars['--theme-text']);
    root.style.setProperty('--color-accent',     theme.vars['--theme-primary']);
    root.style.setProperty('--color-background', theme.vars['--theme-bg']);
    root.style.setProperty('--color-background-off', theme.vars['--theme-bg-off']);
    root.style.setProperty('--color-text',       theme.vars['--theme-text']);
    root.style.setProperty('--color-text-light', theme.vars['--theme-text-soft']);
}

export function ThemeProvider({ children }) {
    const [activeId, setActiveId] = useState(() => {
        return localStorage.getItem('everyday-theme') || 'original';
    });

    const activeTheme = THEMES.find(t => t.id === activeId) || THEMES[0];

    useEffect(() => {
        applyTheme(activeTheme);
        localStorage.setItem('everyday-theme', activeTheme.id);
    }, [activeTheme]);

    const setTheme = (id) => setActiveId(id);

    return (
        <ThemeContext.Provider value={{ activeTheme, setTheme, themes: THEMES }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
