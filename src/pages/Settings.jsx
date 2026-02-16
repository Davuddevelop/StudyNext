import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { useNavigate, Link } from 'react-router-dom';
import { IoArrowBack, IoSaveOutline, IoPersonOutline, IoSparkles, IoLogOutOutline, IoTrashOutline } from 'react-icons/io5';

export default function Settings() {
    const { currentUser, userProfile, logout, deleteAccount, refreshProfile, isPremium } = useAuth();
    const navigate = useNavigate();
    const [reminders, setReminders] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const nameRef = useRef();
    const photoRef = useRef();

    async function handleUpdateProfile(e) {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await userService.updateProfile(currentUser.uid, {
                displayName: nameRef.current.value,
                photoURL: photoRef.current.value
            });
            await refreshProfile();
            setMessage('Profile updated successfully!');
        } catch (err) {
            console.error(err);
            setMessage('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    }

    async function handleLogout() {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Header */}
            <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                <button onClick={() => navigate(-1)} style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    display: 'flex',
                    padding: '0.75rem',
                    borderRadius: '12px'
                }}>
                    <IoArrowBack size={20} />
                </button>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)' }}>Settings</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {/* Profile Card */}
                <div className="animate-fade-up animate-delay-1" style={{
                    background: 'var(--surface)',
                    borderRadius: '20px',
                    padding: '1.75rem',
                    border: '1px solid var(--border)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: 'var(--primary-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <IoPersonOutline size={20} color="var(--primary)" />
                        </div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text)' }}>Profile</h2>
                    </div>

                    {message && (
                        <div style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '10px',
                            backgroundColor: message.includes('success') ? 'var(--success-muted)' : 'var(--danger-muted)',
                            color: message.includes('success') ? 'var(--success)' : 'var(--danger)',
                            marginBottom: '1.5rem',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            border: `1px solid ${message.includes('success') ? 'rgba(74, 222, 128, 0.3)' : 'rgba(255, 107, 107, 0.3)'}`
                        }}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleUpdateProfile}>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label>Display Name</label>
                            <input
                                type="text"
                                ref={nameRef}
                                defaultValue={userProfile?.displayName || 'Student'}
                                className="input"
                            />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label>Profile Picture URL</label>
                            <input
                                type="text"
                                ref={photoRef}
                                defaultValue={userProfile?.photoURL || ''}
                                className="input"
                                placeholder="https://example.com/photo.jpg"
                            />
                        </div>

                        <button disabled={loading} className="btn-brand" type="submit" style={{ width: '100%', padding: '1rem' }}>
                            <IoSaveOutline size={18} />
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>

                {/* Account Card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="animate-fade-up animate-delay-2" style={{
                        background: 'var(--surface)',
                        borderRadius: '20px',
                        padding: '1.75rem',
                        border: '1px solid var(--border)'
                    }}>
                        {/* Email */}
                        <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: '600' }}>Account Email</div>
                            <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text)' }}>{currentUser.email}</div>
                        </div>

                        {/* Notifications Toggle */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div>
                                <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text)' }}>Notifications</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>Daily reminders</div>
                            </div>
                            <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '26px' }}>
                                <input
                                    type="checkbox"
                                    checked={reminders}
                                    onChange={() => setReminders(!reminders)}
                                    style={{ opacity: 0, width: 0, height: 0 }}
                                />
                                <span style={{
                                    position: 'absolute',
                                    cursor: 'pointer',
                                    inset: 0,
                                    backgroundColor: reminders ? 'var(--primary)' : 'var(--border-heavy)',
                                    transition: '.3s',
                                    borderRadius: '26px'
                                }} />
                                <span style={{
                                    position: 'absolute',
                                    height: '20px',
                                    width: '20px',
                                    left: '3px',
                                    bottom: '3px',
                                    backgroundColor: reminders ? '#0F0F0F' : 'var(--text-muted)',
                                    transition: '.3s',
                                    borderRadius: '50%',
                                    transform: reminders ? 'translateX(18px)' : 'translateX(0)'
                                }} />
                            </label>
                        </div>

                        {/* Premium Status */}
                        <div style={{
                            padding: '1.25rem',
                            borderRadius: '14px',
                            background: isPremium ? 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)' : 'var(--bg-elevated)',
                            border: isPremium ? 'none' : '1px solid var(--border)',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                <div style={{
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                    color: isPremium ? '#0F0F0F' : 'var(--text)'
                                }}>
                                    Subscription
                                </div>
                                <div style={{
                                    background: isPremium ? 'rgba(0,0,0,0.2)' : 'var(--accent-muted)',
                                    color: isPremium ? '#0F0F0F' : 'var(--accent)',
                                    padding: '4px 10px',
                                    borderRadius: '8px',
                                    fontSize: '0.7rem',
                                    fontWeight: '700',
                                    letterSpacing: '0.5px'
                                }}>
                                    {isPremium ? 'PREMIUM' : 'FREE'}
                                </div>
                            </div>

                            {isPremium ? (
                                <>
                                    <div style={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.7)', fontWeight: '600', marginBottom: '1rem' }}>
                                        Lifetime access to all premium features
                                    </div>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm("Cancel premium subscription? You'll lose access to premium features.")) {
                                                try {
                                                    await userService.updatePlan(currentUser.uid, 'free');
                                                    await refreshProfile();
                                                    setMessage('Subscription cancelled.');
                                                } catch (err) {
                                                    setMessage('Failed to cancel subscription.');
                                                }
                                            }
                                        }}
                                        style={{
                                            background: 'rgba(0,0,0,0.15)',
                                            color: '#0F0F0F',
                                            border: '1px solid rgba(0,0,0,0.2)',
                                            padding: '0.625rem 1rem',
                                            borderRadius: '10px',
                                            fontWeight: '600',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            width: '100%'
                                        }}
                                    >
                                        Cancel Premium
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '1rem' }}>
                                        Unlock unlimited tasks and premium features
                                    </div>
                                    <Link to="/premium" style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                                        color: '#0F0F0F',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '10px',
                                        fontWeight: '700',
                                        fontSize: '0.9rem',
                                        textDecoration: 'none'
                                    }}>
                                        <IoSparkles size={16} /> Upgrade to Premium
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Actions */}
                        <button onClick={handleLogout} className="btn-outline" style={{ width: '100%', marginBottom: '0.75rem' }}>
                            <IoLogOutOutline size={18} /> Log Out
                        </button>

                        <button
                            onClick={async () => {
                                if (window.confirm("This will permanently delete your account and all data. This cannot be undone.")) {
                                    try {
                                        await deleteAccount();
                                        navigate('/login');
                                    } catch (err) {
                                        alert("Failed to delete account. Try logging out and back in first.");
                                    }
                                }
                            }}
                            className="btn-danger"
                            style={{ width: '100%' }}
                        >
                            <IoTrashOutline size={18} /> Delete Account
                        </button>

                        {/* Footer Links */}
                        <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                            <a href="mailto:spprtstdnxt@gmail.com" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                                Need help? <span style={{ color: 'var(--primary)' }}>Contact Support</span>
                            </a>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.75rem' }}>
                                <Link to="/privacy" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Privacy</Link>
                                <Link to="/terms" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Terms</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
