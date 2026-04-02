import React, { useState } from 'react';

export default function DifferentiatorCard({ number, title, desc }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="animate-fade-up landing-diff-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                backgroundColor: isHovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                border: isHovered ? '1px solid rgba(255,107,74,0.15)' : '1px solid rgba(255,255,255,0.08)',
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
            }}>
            <div className="landing-diff-number" style={{
                color: isHovered ? 'rgba(255,107,74,0.5)' : 'rgba(255,107,74,0.35)',
            }}>{number}</div>
            <div>
                <h3 className="landing-feature-title">{title}</h3>
                <p className="landing-feature-desc">{desc}</p>
            </div>
        </div>
    );
}
