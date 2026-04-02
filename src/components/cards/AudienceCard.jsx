import React, { useState } from 'react';

export default function AudienceCard({ icon, title, desc }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="animate-fade-up landing-audience-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                backgroundColor: isHovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                border: isHovered ? '1px solid rgba(255,183,77,0.2)' : '1px solid rgba(255,255,255,0.05)',
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
            }}>
            <div className="landing-audience-icon" style={{
                backgroundColor: isHovered ? 'rgba(255,183,77,0.15)' : 'rgba(255,183,77,0.1)',
            }}>
                {icon}
            </div>
            <h3 className="landing-feature-title">{title}</h3>
            <p className="landing-feature-desc">{desc}</p>
        </div>
    );
}
