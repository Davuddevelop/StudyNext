import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { IoTrophy, IoMedal, IoPerson, IoArrowUp } from 'react-icons/io5';

// Mock data generator for leaderboard since we don't have a real backend for all users
// In a real app, this would query a 'users' collection in Firestore sorted by XP
const MOCK_USERS = [
    { id: '1', name: 'Alex M.', xp: 12500, avatar: null },
    { id: '2', name: 'Sarah K.', xp: 9800, avatar: null },
    { id: '3', name: 'Jordan T.', xp: 8450, avatar: null },
    { id: '4', name: 'Casey R.', xp: 7200, avatar: null },
    { id: '5', name: 'Riley P.', xp: 6900, avatar: null },
];

export default function Leaderboard() {
    const { currentUser, userProfile } = useAuth();
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetch
        setTimeout(() => {
            // Merge current user into mock data if not present (simplified logic)
            let allUsers = [...MOCK_USERS];

            // Add current user to list for context
            const currentUserEntry = {
                id: currentUser.uid,
                name: currentUser.displayName || 'Me',
                xp: userProfile?.xp || 0,
                isCurrentUser: true
            };

            allUsers.push(currentUserEntry);

            // Sort by XP
            allUsers.sort((a, b) => b.xp - a.xp);

            // Remove duplicates if any (in case mock ID matches)
            // Just take top 10
            setLeaders(allUsers.slice(0, 10));
            setLoading(false);
        }, 800);
    }, [currentUser, userProfile]);

    function getMedalColor(rank) {
        switch (rank) {
            case 0: return '#fbbf24'; // Gold
            case 1: return '#94a3b8'; // Silver
            case 2: return '#b45309'; // Bronze
            default: return 'transparent';
        }
    }

    if (loading) return <div className="container text-center mt-5">Loading leaderboard...</div>;

    return (
        <div className="container" style={{ paddingBottom: '3rem' }}>
            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{
                    display: 'inline-flex',
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%)',
                    borderRadius: '50%',
                    marginBottom: '1.5rem',
                    boxShadow: '0 10px 25px -5px rgba(251, 191, 36, 0.4)'
                }}>
                    <IoTrophy size={48} color="#b45309" />
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text)', marginBottom: '0.5rem' }}>Leaderboard</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>See who's staying on top of their tasks!</p>
            </header>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ background: 'white', borderRadius: '32px', padding: '1rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
                    {leaders.map((user, index) => (
                        <div key={user.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '1rem 1.5rem',
                            borderBottom: index !== leaders.length - 1 ? '1px solid var(--border)' : 'none',
                            background: user.isCurrentUser ? '#f0f9ff' : 'transparent',
                            borderRadius: '16px'
                        }}>
                            <div style={{
                                width: '40px',
                                paddingRight: '1rem',
                                fontWeight: '900',
                                fontSize: '1.2rem',
                                color: index < 3 ? getMedalColor(index) : 'var(--text-muted)',
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                {index < 3 ? <IoMedal size={28} /> : index + 1}
                            </div>

                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: '#f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '1rem',
                                border: index === 0 ? '3px solid #fbbf24' : 'none'
                            }}>
                                <IoPerson size={24} color="var(--text-muted)" />
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--text)' }}>
                                    {user.name} {user.isCurrentUser && '(You)'}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Level {Math.floor(user.xp / 1000) + 1} Scholar</div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: '900', fontSize: '1.2rem', color: 'var(--primary)' }}>
                                    {user.xp.toLocaleString()} XP
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
