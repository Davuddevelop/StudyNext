import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { useNavigate, Link } from 'react-router-dom';
import { IoArrowBack, IoSaveOutline, IoPersonOutline, IoMoonOutline, IoSunnyOutline } from 'react-icons/io5';

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
            setMessage('Profile updated successfully! ✨');
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
        <div className="container" style={{ paddingBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', display: 'flex' }}>
                    <IoArrowBack size={24} />
                </button>
                <h1 style={{ fontSize: 'var(--h1-size)', fontWeight: '900', color: 'var(--text)' }}>Settings</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--grid-gap)' }}>

                {/* Profile Customization */}
                <div style={{ background: 'var(--surface)', borderRadius: '32px', padding: 'var(--card-padding)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <IoPersonOutline size={28} color="var(--primary)" />
                        <h2 style={{ fontSize: 'var(--h3-size)', fontWeight: '800' }}>Profile</h2>
                    </div>

                    {message && (
                        <div style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '12px',
                            backgroundColor: message.includes('success') ? '#d1fae5' : '#fee2e2',
                            color: message.includes('success') ? '#065f46' : '#991b1b',
                            marginBottom: '1.5rem',
                            fontWeight: '700',
                            fontSize: '0.9rem'
                        }}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleUpdateProfile}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800', fontSize: '1rem' }}>Display Name</label>
                            <input
                                type="text"
                                ref={nameRef}
                                defaultValue={userProfile?.displayName || 'Student'}
                                className="input"
                            />
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800', fontSize: '1rem' }}>Profile Picture URL</label>
                            <input
                                type="text"
                                ref={photoRef}
                                defaultValue={userProfile?.photoURL || ''}
                                className="input"
                                placeholder="https://example.com/photo.jpg"
                            />
                        </div>

                        <button disabled={loading} className="btn-brand" type="submit" style={{ width: '100%', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <IoSaveOutline size={20} />
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>

                {/* Account & Preferences */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--grid-gap)' }}>
                    <div style={{ background: 'var(--surface)', borderRadius: '32px', padding: 'var(--card-padding)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: '700' }}>Account Email</div>
                            <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{currentUser.email}</div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div>
                                <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>Notifications</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Daily reminders</div>
                            </div>
                            <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '24px' }}>
                                <input
                                    type="checkbox"
                                    checked={reminders}
                                    onChange={() => setReminders(!reminders)}
                                    style={{ opacity: 0, width: 0, height: 0 }}
                                />
                                <span style={{
                                    position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                                    backgroundColor: reminders ? 'var(--primary)' : '#cbd5e1',
                                    transition: '.4s', borderRadius: '24px'
                                }}></span>
                                <span style={{
                                    position: 'absolute', content: '""', height: '16px', width: '16px',
                                    left: '4px', bottom: '4px', backgroundColor: 'white',
                                    transition: '.4s', borderRadius: '50%', transform: reminders ? 'translateX(16px)' : 'translateX(0)'
                                }}></span>
                            </label>
                        </div>

                        {/* Premium Status */}
                        <div style={{
                            marginBottom: '1.5rem',
                            padding: '1.25rem',
                            borderRadius: '16px',
                            background: isPremium ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' : '#f8fafc',
                            border: isPremium ? 'none' : '1px solid var(--border)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                <div style={{
                                    fontWeight: '800',
                                    fontSize: '1.1rem',
                                    color: isPremium ? 'white' : 'var(--text)'
                                }}>
                                    Subscription Status
                                </div>
                                <div style={{
                                    background: isPremium ? 'rgba(255,255,255,0.2)' : '#fbbf24',
                                    color: isPremium ? 'white' : '#78350f',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    fontWeight: '900'
                                }}>
                                    {isPremium ? 'PREMIUM' : 'FREE'}
                                </div>
                            </div>

                            {isPremium ? (
                                <>
                                    <div style={{
                                        fontSize: '0.85rem',
                                        color: 'rgba(255,255,255,0.9)',
                                        fontWeight: '600',
                                        marginBottom: '1rem'
                                    }}>
                                        You have lifetime access to all premium features
                                    </div>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm("Are you sure you want to cancel your premium subscription? You'll lose access to all premium features.")) {
                                                try {
                                                    await userService.updatePlan(currentUser.uid, 'free');
                                                    await refreshProfile();
                                                    setMessage('Subscription cancelled successfully.');
                                                } catch (err) {
                                                    setMessage('Failed to cancel subscription.');
                                                }
                                            }
                                        }}
                                        style={{
                                            background: 'rgba(255,255,255,0.2)',
                                            color: 'white',
                                            border: '1px solid rgba(255,255,255,0.3)',
                                            padding: '0.625rem 1rem',
                                            borderRadius: '10px',
                                            fontWeight: '700',
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
                                    <div style={{
                                        fontSize: '0.85rem',
                                        color: 'var(--text-muted)',
                                        fontWeight: '600',
                                        marginBottom: '1rem'
                                    }}>
                                        Upgrade to unlock unlimited tasks and premium features
                                    </div>
                                    <Link
                                        to="/premium"
                                        style={{
                                            display: 'block',
                                            background: 'var(--primary)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.625rem 1rem',
                                            borderRadius: '10px',
                                            fontWeight: '700',
                                            fontSize: '0.85rem',
                                            textAlign: 'center',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        Upgrade to Premium
                                    </Link>
                                </>
                            )}
                        </div>

                        <button
                            onClick={handleLogout}
                            className="btn"
                            style={{
                                background: '#f8fafc',
                                color: '#1e293b',
                                fontWeight: '700',
                                marginTop: '1rem',
                                border: '1px solid var(--border)'
                            }}
                        >
                            Log Out
                        </button>

                        <button
                            onClick={async () => {
                                if (window.confirm("⚠️ ARE YOU SURE? This will permanently delete your account and all your tasks. This cannot be undone.")) {
                                    try {
                                        await deleteAccount();
                                        navigate('/login');
                                    } catch (err) {
                                        alert("Failed to delete account. You may need to logout and log back in to perform this action.");
                                    }
                                }
                            }}
                            className="btn"
                            style={{
                                background: '#fff1f2',
                                color: '#e11d48',
                                fontWeight: '900',
                                marginTop: '1.5rem',
                                border: 'none'
                            }}
                        >
                            Delete Account
                        </button>

                        <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <a href="mailto:support@studynext.app" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600', textDecoration: 'none' }}>
                                    Need help? <span style={{ color: 'var(--primary)' }}>Contact Support</span>
                                </a>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                                    <Link to="/privacy" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>Privacy Policy</Link>
                                    <Link to="/terms" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>Terms of Service</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
