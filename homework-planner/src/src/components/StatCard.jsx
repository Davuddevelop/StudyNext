import React from 'react';

export default function StatCard({ icon, iconColor, label, value, sublabel }) {
    return (
        <div style={{
            background: 'var(--surface)',
            padding: '1.25rem',
            borderRadius: '14px',
            border: '1px solid var(--border)'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem',
                color: 'var(--text-muted)',
                fontWeight: '600',
                fontSize: '0.8rem'
            }}>
                <span style={{ color: iconColor }}>{icon}</span>
                {label}
            </div>
            <div style={{
                fontSize: '2rem',
                fontWeight: '800',
                color: 'var(--text)',
                lineHeight: 1
            }}>
                {value}
            </div>
            <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginTop: '0.4rem',
                fontWeight: '500'
            }}>
                {sublabel}
            </div>
        </div>
    );
}
