import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './Accordion.css';

const AccordionItem = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="accordion-item">
            <button className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
                {title}
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
                <div className="accordion-body">{children}</div>
            </div>
        </div>
    );
};

export default AccordionItem;
