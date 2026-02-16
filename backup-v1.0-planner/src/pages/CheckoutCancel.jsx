import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoCloseCircle, IoArrowBack, IoRefresh } from 'react-icons/io5';

export default function CheckoutCancel() {
    const navigate = useNavigate();

    return (
        <div className="container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '70vh',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <div style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                borderRadius: '50%',
                width: '120px',
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem',
                boxShadow: '0 20px 40px -10px rgba(239, 68, 68, 0.4)'
            }}>
                <IoCloseCircle size={80} color="white" />
            </div>

            <h1 style={{
                fontSize: 'var(--h1-size)',
                fontWeight: '900',
                marginBottom: '1rem',
                letterSpacing: '-1px'
            }}>
                Payment Cancelled
            </h1>

            <p style={{
                fontSize: 'var(--body-large)',
                color: 'var(--text-muted)',
                fontWeight: '600',
                marginBottom: '2rem',
                maxWidth: '500px'
            }}>
                Your payment was cancelled. No charges were made to your account.
            </p>

            <div style={{
                background: 'var(--surface)',
                borderRadius: '24px',
                padding: '2rem',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '2rem',
                maxWidth: '400px',
                width: '100%'
            }}>
                <h3 style={{ fontWeight: '800', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                    Need Help?
                </h3>
                <ul style={{
                    textAlign: 'left',
                    listStyle: 'none',
                    padding: 0,
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: 'var(--text-muted)'
                }}>
                    <li style={{ marginBottom: '1rem' }}>
                        • Payment issues? Try a different card
                    </li>
                    <li style={{ marginBottom: '1rem' }}>
                        • Questions about features? Check our FAQ
                    </li>
                    <li>
                        • Still stuck? <a href="mailto:support@taskflow.app" style={{ color: 'var(--primary)', fontWeight: '700' }}>Contact support</a>
                    </li>
                </ul>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                    onClick={() => navigate('/pricing')}
                    className="btn-brand"
                    style={{
                        padding: '1.25rem 2.5rem',
                        fontSize: '1.1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}
                >
                    <IoRefresh size={24} />
                    Try Again
                </button>

                <button
                    onClick={() => navigate('/')}
                    style={{
                        padding: '1.25rem 2.5rem',
                        fontSize: '1.1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        background: 'var(--surface)',
                        border: '2px solid var(--border)',
                        borderRadius: '16px',
                        fontWeight: '800',
                        color: 'var(--text)',
                        cursor: 'pointer'
                    }}
                >
                    <IoArrowBack size={24} />
                    Go Back
                </button>
            </div>
        </div>
    );
}
