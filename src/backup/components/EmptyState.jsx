import React from 'react';
import { IoAdd, IoSparklesOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';

export default function EmptyState({ icon, title, message, actionLabel, actionTo }) {
    return (
        <div style={{
            background: 'var(--surface)',
            padding: 'var(--hero-padding) var(--container-padding)',
            borderRadius: '32px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
            border: '2px dashed var(--border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            margin: '1.5rem 0'
        }}>
            <div style={{
                width: 'var(--avatar-size)',
                height: 'var(--avatar-size)',
                background: 'var(--border)',
                borderRadius: '30%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                position: 'relative'
            }}>
                {icon || <IoSparklesOutline size={40} />}
            </div>

            <div>
                <h2 style={{ fontSize: 'var(--h3-size)', fontWeight: '900', color: 'var(--text)', marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>{title}</h2>
                <p style={{ fontSize: 'var(--body-large)', color: 'var(--text-muted)', fontWeight: '600', maxWidth: '400px', margin: '0 auto' }}>{message}</p>
            </div>

            {actionTo && (
                <Link to={actionTo} className="btn-brand" style={{ padding: '1rem 2rem', width: 'auto', borderRadius: '16px', fontSize: '1rem' }}>
                    {actionLabel || "Get Started"}
                </Link>
            )}
        </div>
    );
}
