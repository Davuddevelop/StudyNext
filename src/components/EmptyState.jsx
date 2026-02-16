import React from 'react';
import { IoSparklesOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';

export default function EmptyState({ icon, title, message, actionLabel, actionTo }) {
    return (
        <div style={{
            background: 'var(--surface)',
            padding: '3rem 2rem',
            borderRadius: '20px',
            textAlign: 'center',
            border: '1px dashed var(--border-heavy)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
            margin: '1rem 0'
        }}>
            <div style={{
                width: '70px',
                height: '70px',
                background: 'var(--primary-muted)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
            }}>
                {icon || <IoSparklesOutline size={32} />}
            </div>

            <div>
                <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: 'var(--text)',
                    marginBottom: '0.5rem'
                }}>
                    {title || "Time for a breather?"}
                </h2>
                <p style={{
                    fontSize: '0.95rem',
                    color: 'var(--text-muted)',
                    fontWeight: '500',
                    maxWidth: '320px',
                    margin: '0 auto',
                    lineHeight: 1.5
                }}>
                    {message || "No tasks due right now. Rest is as productive as work. Enjoy the peace!"}
                </p>
            </div>

            {actionTo && (
                <Link to={actionTo} className="btn-brand" style={{
                    padding: '0.875rem 1.75rem',
                    width: 'auto',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    marginTop: '0.5rem'
                }}>
                    {actionLabel || "Plan Ahead"}
                </Link>
            )}
        </div>
    );
}
