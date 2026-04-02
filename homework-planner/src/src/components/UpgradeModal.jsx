import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoStar, IoClose } from 'react-icons/io5';

export default function UpgradeModal({ isOpen, onClose, title, message }) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'var(--surface)',
                borderRadius: '20px',
                width: '90%',
                maxWidth: '350px',
                padding: '2rem',
                textAlign: 'center',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '1px solid var(--border)'
            }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                    <IoClose size={24} />
                </button>

                <div style={{
                    width: '60px', height: '60px', background: 'linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#0A0A0A', margin: '0 auto 1.5rem auto',
                    boxShadow: '0 8px 20px -4px rgba(255, 183, 77, 0.4)'
                }}>
                    <IoStar size={32} />
                </div>

                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{title || "Upgrade to Premium"}</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    {message || "Never forget homework again with smart reminders and unlimited tasks."}
                </p>

                <button
                    onClick={() => navigate('/premium')}
                    className="btn-brand"
                    style={{ width: '100%', padding: '1rem' }}
                >
                    View Plans & Upgrade
                </button>
            </div>
        </div>
    );
}
