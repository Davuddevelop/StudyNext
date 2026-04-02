import React, { useState, useEffect } from 'react';
import { IoSparklesOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const MOTIVATIONAL_QUOTES = [
    { text: "Progress, not perfection.", author: null },
    { text: "Small steps lead to big changes.", author: null },
    { text: "You're doing better than you think.", author: null },
    { text: "Rest is part of the process.", author: null },
    { text: "Every expert was once a beginner.", author: null },
    { text: "Focus on growth, not grades.", author: null },
    { text: "Your pace is perfectly fine.", author: null },
    { text: "Learning takes time. Be patient.", author: null },
    { text: "You've handled hard days before.", author: null },
    { text: "One task at a time. You've got this.", author: null },
    { text: "Celebrate the small wins.", author: null },
    { text: "Taking breaks makes you stronger.", author: null },
];

export default function EmptyState({ icon, title, message, actionLabel, actionTo, showQuote = true }) {
    const [randomQuote, setRandomQuote] = useState(null);

    useEffect(() => {
        if (showQuote) {
            setRandomQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
        }
    }, [showQuote]);

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

            {/* Motivational Quote */}
            {showQuote && randomQuote && (
                <div style={{
                    background: 'var(--bg-elevated)',
                    padding: '1rem 1.5rem',
                    borderRadius: '12px',
                    borderLeft: '3px solid var(--accent)',
                    maxWidth: '320px'
                }}>
                    <p style={{
                        fontSize: '0.9rem',
                        fontStyle: 'italic',
                        color: 'var(--text)',
                        fontWeight: '500',
                        margin: 0,
                        lineHeight: 1.5
                    }}>
                        "{randomQuote.text}"
                    </p>
                </div>
            )}

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
