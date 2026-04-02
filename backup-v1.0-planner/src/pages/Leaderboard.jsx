import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { IoArrowBack, IoTrophy, IoMedal } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { SkeletonTaskList } from '../components/SkeletonLoader';

export default function Leaderboard() {
    const { currentUser } = useAuth();
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadLeaderboard();
    }, []);

    async function loadLeaderboard() {
        try {
            const data = await userService.getLeaderboard(20);
            setLeaders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const topThree = leaders.slice(0, 3);
    const rest = leaders.slice(3);

    const getRankColor = (index) => {
        if (index === 0) return '#fbbf24'; // Gold
        if (index === 1) return '#94a3b8'; // Silver
        if (index === 2) return '#b45309'; // Bronze
        return 'var(--text-muted)';
    };

    const getRankIcon = (index) => {
        if (index === 0) return <IoTrophy size={24} color="#fbbf24" />;
        if (index === 1) return <IoMedal size={24} color="#94a3b8" />;
        if (index === 2) return <IoMedal size={24} color="#b45309" />;
        return <span style={{ fontWeight: '800', width: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>{index + 1}</span>;
    };

    return (
        <div className="container" style={{ paddingBottom: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                <button onClick={() => navigate(-1)} style={{
                    background: '#f1f5f9',
                    border: 'none',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    display: 'flex',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    transition: 'all 0.2s'
                }}>
                    <IoArrowBack size={20} />
                </button>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)', lineHeight: 1 }}>Leaderboard</h1>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>Top students worldwide 🌍</p>
                </div>
            </div>

            {loading ? <SkeletonTaskList count={8} /> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Podium (Top 3) */}
                    {topThree.length > 0 && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            gap: '1rem',
                            marginTop: '1rem',
                            marginBottom: '1rem',
                            height: '240px'
                        }}>
                            {/* 2nd Place */}
                            {topThree[1] && (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30%' }}>
                                    <div style={{ marginBottom: '0.5rem', textAlign: 'center' }}>
                                        <div style={{ fontWeight: '700', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100px' }}>{topThree[1].displayName.split(' ')[0]}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>{topThree[1].xp} XP</div>
                                    </div>
                                    <div style={{
                                        width: '100%',
                                        height: '140px',
                                        background: 'linear-gradient(to top, #e2e8f0 0%, #f8fafc 100%)',
                                        borderRadius: '16px 16px 0 0',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        paddingTop: '1rem',
                                        position: 'relative',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}>
                                        <div style={{
                                            position: 'absolute', top: '-20px',
                                            width: '40px', height: '40px', borderRadius: '50%',
                                            background: '#94a3b8', color: 'white', fontWeight: '800',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            border: '3px solid white',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}>2</div>
                                    </div>
                                </div>
                            )}

                            {/* 1st Place */}
                            {topThree[0] && (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '35%', zIndex: 1 }}>
                                    <div style={{ marginBottom: '0.5rem', textAlign: 'center' }}>
                                        <IoTrophy size={24} color="#fbbf24" style={{ marginBottom: '4px' }} />
                                        <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--primary)' }}>{topThree[0].displayName.split(' ')[0]}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700' }}>({topThree[0].xp} XP)</div>
                                    </div>
                                    <div style={{
                                        width: '100%',
                                        height: '180px',
                                        background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                                        borderRadius: '20px 20px 0 0',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        paddingTop: '1rem',
                                        position: 'relative',
                                        boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.4)'
                                    }}>
                                        <div style={{
                                            position: 'absolute', top: '-24px',
                                            width: '48px', height: '48px', borderRadius: '50%',
                                            background: '#fff', color: '#d97706', fontWeight: '900', fontSize: '1.25rem',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            border: '4px solid #fcd34d',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}>1</div>
                                    </div>
                                </div>
                            )}

                            {/* 3rd Place */}
                            {topThree[2] && (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30%' }}>
                                    <div style={{ marginBottom: '0.5rem', textAlign: 'center' }}>
                                        <div style={{ fontWeight: '700', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100px' }}>{topThree[2].displayName.split(' ')[0]}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>{topThree[2].xp} XP</div>
                                    </div>
                                    <div style={{
                                        width: '100%',
                                        height: '110px',
                                        background: 'linear-gradient(to top, #fed7aa 0%, #fff7ed 100%)',
                                        borderRadius: '16px 16px 0 0',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        paddingTop: '1rem',
                                        position: 'relative',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}>
                                        <div style={{
                                            position: 'absolute', top: '-20px',
                                            width: '40px', height: '40px', borderRadius: '50%',
                                            background: '#b45309', color: 'white', fontWeight: '800',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            border: '3px solid white',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}>3</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Rest of the List (4-50) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {rest.map((user, i) => {
                            const rank = i + 4;
                            const isMe = user.uid === currentUser?.uid;

                            return (
                                <div key={user.uid} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0.75rem 1rem',
                                    background: isMe ? '#f0f9ff' : 'white',
                                    border: isMe ? '2px solid #38bdf8' : '1px solid var(--border)',
                                    borderRadius: '16px',
                                    gap: '1rem',
                                    boxShadow: isMe ? '0 4px 12px -2px rgba(56, 189, 248, 0.3)' : 'none'
                                }}>
                                    <div style={{
                                        width: '32px', height: '32px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: '800', color: 'var(--text-muted)',
                                        background: '#f8fafc', borderRadius: '8px'
                                    }}>
                                        {rank}
                                    </div>

                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', overflow: 'hidden' }}>
                                        {user.photoURL ?
                                            <img src={user.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>👤</div>
                                        }
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '700', color: 'var(--text)' }}>
                                            {user.displayName} {isMe && <span style={{ fontSize: '0.7rem', background: 'var(--primary)', color: 'white', padding: '2px 6px', borderRadius: '6px', marginLeft: '6px' }}>YOU</span>}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Level {user.level || 1} • {user.streak || 0} day streak 🔥</div>
                                    </div>

                                    <div style={{ fontWeight: '800', color: 'var(--primary)' }}>
                                        {user.xp.toLocaleString()} XP
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
