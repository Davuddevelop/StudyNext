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
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '24px',
                width: '90%',
                maxWidth: '350px',
                padding: '2rem',
                textAlign: 'center',
                position: 'relative',
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
            }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                    <IoClose size={24} />
                </button>

                <div style={{
                    width: '60px', height: '60px', background: '#fffbeb', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#f59e0b', margin: '0 auto 1.5rem auto'
                }}>
                    <IoStar size={32} />
                </div>

                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem', color: '#1e293b' }}>{title || "Upgrade to Premium"}</h3>
                <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: 1.5 }}>
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
