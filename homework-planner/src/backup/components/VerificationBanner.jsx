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
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            borderRadius: '16px',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            position: 'relative'
        }}>
            <IoMailOutline size={24} color="#b45309" />

            <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ fontWeight: '800', color: '#92400e', fontSize: '0.95rem' }}>
                    {sent ? 'Verification email sent!' : 'Verify your email address'}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#a16207', fontWeight: '600' }}>
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
                        borderRadius: '12px',
                        border: 'none',
                        background: '#fbbf24',
                        color: '#78350f',
                        fontWeight: '800',
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
                    color: '#92400e',
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
