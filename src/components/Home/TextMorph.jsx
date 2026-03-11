import React, { useEffect, useRef, useState } from 'react';
import './TextMorph.css';

const WORDS = ['GOLD', 'ELEGANT', 'TIMELESS', 'ARTISAN', 'LUXURY'];
const INTERVAL = 2600;

export default function TextMorph({ className = '' }) {
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [phase, setPhase] = useState('visible'); // visible | exit | enter

    useEffect(() => {
        const timeout = setTimeout(cycle, INTERVAL);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line
    }, [current]);

    const cycle = () => {
        setPhase('exit');
        setTimeout(() => {
            setCurrent(prev => (prev + 1) % WORDS.length);
            setPhase('enter');
            setTimeout(() => setPhase('visible'), 400);
        }, 380);
    };

    return (
        <span
            className={`text-morph ${phase} ${className}`}
            aria-label={WORDS[current]}
        >
            {WORDS[current]}
        </span>
    );
}
