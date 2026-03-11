import React, { useState } from 'react';
import { X } from 'lucide-react';
import './AnnouncementBar.css';

const AnnouncementBar = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="announcement-bar">
            <div className="container announcement-content">
                <p>✨ Envío gratis en pedidos mayores a $100</p>
                <button className="close-announcement" onClick={() => setIsVisible(false)}>
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default AnnouncementBar;
