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
            <div className="animate-fade-up" style={{
                background: 'linear-gradient(135deg, var(--danger) 0%, #dc2626 100%)',
                borderRadius: '50%',
                width: '120px',
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem',
                boxShadow: '0 20px 40px -10px rgba(255, 107, 107, 0.4)'
            }}>
                <IoCloseCircle size={80} color="#0A0A0A" />
            </div>

            <h1 className="animate-fade-up animate-delay-1" style={{
                fontSize: '2.5rem',
                fontWeight: '900',
                marginBottom: '1rem',
                letterSpacing: '-1px',
                color: 'var(--text)',
                fontFamily: 'var(--font-display)'
            }}>
                Payment Cancelled
            </h1>

            <p className="animate-fade-up animate-delay-1" style={{
                fontSize: '1.1rem',
                color: 'var(--text-muted)',
                fontWeight: '600',
                marginBottom: '2rem',
                maxWidth: '500px'
            }}>
                Your payment was cancelled. No charges were made to your account.
            </p>

            <div className="animate-fade-up animate-delay-2" style={{
                background: 'var(--surface)',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid var(--border)',
                marginBottom: '2rem',
                maxWidth: '400px',
                width: '100%'
            }}>
                <h3 style={{ fontWeight: '700', marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text)' }}>
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
                        <span style={{ color: 'var(--primary)' }}>•</span> Payment issues? Try a different card
                    </li>
                    <li style={{ marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--primary)' }}>•</span> Questions about features? Check our FAQ
                    </li>
                    <li>
                        <span style={{ color: 'var(--primary)' }}>•</span> Still stuck? <a href="mailto:spprtstdnxt@gmail.com" style={{ color: 'var(--primary)', fontWeight: '700' }}>Contact support</a>
                    </li>
                </ul>
            </div>

            <div className="animate-fade-up animate-delay-2" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
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
                        border: '1px solid var(--border)',
                        borderRadius: '14px',
                        fontWeight: '700',
                        color: 'var(--text)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    <IoArrowBack size={24} />
                    Go Back
                </button>
            </div>
        </div>
    );
}
