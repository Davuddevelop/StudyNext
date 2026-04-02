import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoCheckmarkCircle, IoHome } from 'react-icons/io5';

export default function CheckoutSuccess() {
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
                background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
                borderRadius: '50%',
                width: '120px',
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem',
                boxShadow: '0 20px 40px -10px rgba(78, 205, 196, 0.4)'
            }}>
                <IoCheckmarkCircle size={80} color="#0A0A0A" />
            </div>

            <h1 className="animate-fade-up animate-delay-1" style={{
                fontSize: '2.5rem',
                fontWeight: '900',
                marginBottom: '1rem',
                letterSpacing: '-1px',
                color: 'var(--text)',
                fontFamily: 'var(--font-display)'
            }}>
                Welcome to Premium!
            </h1>

            <p className="animate-fade-up animate-delay-1" style={{
                fontSize: '1.1rem',
                color: 'var(--text-muted)',
                fontWeight: '600',
                marginBottom: '2rem',
                maxWidth: '500px'
            }}>
                Your payment was successful. You now have lifetime access to all Premium features!
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
                    What's Next?
                </h3>
                <ul style={{
                    textAlign: 'left',
                    listStyle: 'none',
                    padding: 0,
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: 'var(--text-muted)'
                }}>
                    <li style={{ marginBottom: '1rem', paddingLeft: '1.5rem', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, color: 'var(--primary)' }}>✓</span>
                        Create unlimited tasks
                    </li>
                    <li style={{ marginBottom: '1rem', paddingLeft: '1.5rem', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, color: 'var(--primary)' }}>✓</span>
                        Use subject color coding
                    </li>
                    <li style={{ marginBottom: '1rem', paddingLeft: '1.5rem', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, color: 'var(--primary)' }}>✓</span>
                        Export PDF reports
                    </li>
                    <li style={{ paddingLeft: '1.5rem', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, color: 'var(--primary)' }}>✓</span>
                        Enjoy lifetime updates
                    </li>
                </ul>
            </div>

            <button
                onClick={() => navigate('/')}
                className="btn-brand animate-fade-up animate-delay-2"
                style={{
                    padding: '1.25rem 2.5rem',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}
            >
                <IoHome size={24} />
                Go to Dashboard
            </button>

            <p className="animate-fade-up animate-delay-3" style={{
                marginTop: '2rem',
                fontSize: '0.9rem',
                color: 'var(--text-muted)'
            }}>
                Receipt sent to your email. Need help? <a href="mailto:spprtstdnxt@gmail.com" style={{ color: 'var(--primary)', fontWeight: '700' }}>Contact Support</a>
            </p>
        </div>
    );
}
