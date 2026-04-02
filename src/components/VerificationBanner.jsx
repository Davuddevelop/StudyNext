import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { IoMailOutline, IoRefreshOutline, IoCloseOutline } from 'react-icons/io5';

export default function VerificationBanner() {
    const { currentUser, sendVerificationEmail } = useAuth();
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    // Don't show if verified, dismissed, or no user
    if (!currentUser || currentUser.emailVerified || dismissed) {
        return null;
    }

    async function handleResend() {
        setSending(true);
        try {
            await sendVerificationEmail();
            setSent(true);
        } catch (error) {
            console.error('Error sending verification email:', error);
        } finally {
            setSending(false);
        }
    }

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(255, 183, 77, 0.15) 0%, rgba(255, 107, 74, 0.1) 100%)',
            borderRadius: '14px',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            position: 'relative',
            border: '1px solid rgba(255, 183, 77, 0.3)'
        }}>
            <IoMailOutline size={24} color="var(--accent)" />

            <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ fontWeight: '700', color: 'var(--accent)', fontSize: '0.95rem' }}>
                    {sent ? 'Verification email sent!' : 'Verify your email address'}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    {sent
                        ? 'Check your inbox and click the verification link.'
                        : 'Please verify your email to secure your account.'
                    }
                </div>
            </div>

            {!sent && (
                <button
                    onClick={handleResend}
                    disabled={sending}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 1rem',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'var(--accent)',
                        color: '#0A0A0A',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        cursor: sending ? 'wait' : 'pointer',
                        opacity: sending ? 0.7 : 1
                    }}
                >
                    <IoRefreshOutline size={16} />
                    {sending ? 'Sending...' : 'Resend Email'}
                </button>
            )}

            <button
                onClick={() => setDismissed(true)}
                style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex'
                }}
            >
                <IoCloseOutline size={18} />
            </button>
        </div>
    );
}
