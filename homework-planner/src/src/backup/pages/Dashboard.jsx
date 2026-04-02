import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { homeworkService } from '../services/homeworkService';
import { Link, useNavigate } from 'react-router-dom';
import {
    format, isSameDay, addDays, parseISO, startOfDay,
    startOfWeek, endOfWeek, isWithinInterval, isBefore
} from 'date-fns';
import {
    IoAdd,
    IoTimeOutline,      // Pending
    IoWarningOutline,   // Overdue
    IoDiamondOutline,   // Status
    IoStatsChart,       // Activity
    IoCalendarOutline,  // Weekly Icon
    IoSchoolOutline,
    IoCheckmarkCircle,
    IoFlame,
    IoTrophyOutline,
    IoStarOutline
} from 'react-icons/io5';
import CalendarWidget from '../components/CalendarWidget';
import EmptyState from '../components/EmptyState';
import SwipeableTaskItem from '../components/SwipeableTaskItem';
import QuickAddModal from '../components/QuickAddModal';
import confetti from 'canvas-confetti';
import mascot from '../assets/mascot_white.png';

export default function Dashboard() {
    const { currentUser, userProfile, earnXP, isPremium } = useAuth();
    const [homeworks, setHomeworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [celebrationData, setCelebrationData] = useState({ show: false, xp: 0 });
    const navigate = useNavigate();

    // Check if mobile for FAB
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (currentUser) {
            loadData();
        }
    }, [currentUser]);

    async function loadData() {
        try {
            const data = await homeworkService.getAll(currentUser.uid, isPremium);
            setHomeworks(data);
        } catch (error) {
            console.error("Failed to load homeworks", error);
        } finally {
            setLoading(false);
        }
    }

    async function toggleComplete(id, currentStatus) {
        try {
            await homeworkService.update(id, { isCompleted: !currentStatus }, isPremium);

            // Optimistic update
            setHomeworks(prev => prev.map(h =>
                h.id === id ? { ...h, isCompleted: !currentStatus } : h
            ));

            if (!currentStatus) {
                // Completed a task!
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });

                // Award XP
                const result = await earnXP(100); // 100XP per task
                if (result) {
                    setCelebrationData({
                        show: true,
                        xp: 100,
                        didLevelUp: result.didLevelUp,
                        streakExtended: result.streakExtended,
                        newStreak: result.newStreak
                    });
                } else {
                    setCelebrationData(prev => ({ ...prev, show: true, xp: 100 }));
                }
            }
        } catch (err) {
            console.error("Failed to update status", err);
            loadData(); // Revert on error
        }
    }

    const today = new Date();
    const todayStart = startOfDay(today);

    // Auto-Sort by Stress Level: Due Date -> Priority
    const priorityWeight = { high: 0, medium: 1, low: 2 };
    const activeTasks = homeworks.filter(h => !h.isCompleted).sort((a, b) => {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);

        const diff = dateA - dateB;
        if (diff !== 0) return diff;

        // If same exact time/date, sort by priority
        return (priorityWeight[a.priority] || 3) - (priorityWeight[b.priority] || 3);
    });

    const dueToday = activeTasks.filter(h => isSameDay(parseISO(h.dueDate), today));
    const overdue = activeTasks.filter(h => isBefore(parseISO(h.dueDate), todayStart));
    const completedCount = homeworks.filter(h => h.isCompleted).length;
    const userName = currentUser?.displayName ? currentUser.displayName.split(' ')[0] : 'Student';

    // Tonight Mode Logic (After 7PM)
    const currentHour = new Date().getHours();
    const isTonightMode = currentHour >= 19; // 7 PM

    const tomorrow = addDays(today, 1);
    const dueTomorrow = activeTasks.filter(h => isSameDay(parseISO(h.dueDate), tomorrow));

    // Weekly Summary Logic
    const startWeek = startOfWeek(today);
    const endWeek = endOfWeek(today);
    const tasksThisWeek = homeworks.filter(h => {
        const date = parseISO(h.dueDate);
        return isWithinInterval(date, { start: startWeek, end: endWeek });
    });
    const completedThisWeek = tasksThisWeek.filter(h => h.isCompleted).length;

    if (loading) {
        return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Loading your dashboard...</div>;
    }

    return (
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: isMobile ? '0 1rem 3rem 1rem' : '0 2rem 3rem 2rem' }}>

            {/* 1. Header Date */}
            <header style={{ marginBottom: '0.75rem' }}>
                <div style={{ color: 'var(--text)', fontSize: '0.95rem', fontWeight: '800' }}>
                    {format(today, 'hh:mm a')}
                </div>
            </header>

            {/* 2. Weekly Summary Banner */}
            <div style={{
                background: 'white',
                padding: '0.65rem 1rem',
                borderRadius: '12px',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border)'
            }}>
                <img src={mascot} alt="Mascot" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                <div>
                    <div style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Weekly Summary
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text)' }}>
                        You finished <strong style={{ color: 'var(--primary)' }}>{completedThisWeek} tasks</strong> this week. Good start! Keep the momentum going.
                    </div>
                </div>
            </div>

            {/* 2.5. Premium Promo (Mobile Only + Non-Premium) */}
            {isMobile && !isPremium && (
                <Link to="/premium" style={{ textDecoration: 'none' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                        padding: '1.25rem',
                        borderRadius: '16px',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 10px 20px -5px rgba(245, 158, 11, 0.3)',
                        color: 'white'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <IoStarOutline size={32} />
                            <div>
                                <div style={{ fontSize: '1rem', fontWeight: '900' }}>Upgrade to Premium</div>
                                <div style={{ fontSize: '0.8rem', fontWeight: '600', opacity: 0.9 }}>Get unlimited tasks & smart reports</div>
                            </div>
                        </div>
                        <div style={{ background: 'white', color: '#f59e0b', padding: '6px 12px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '800' }}>
                            GO PRO
                        </div>
                    </div>
                </Link>
            )}

            {/* 3. Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                borderRadius: '20px',
                padding: isMobile ? '1.25rem' : '1.75rem',
                color: 'white',
                marginBottom: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.25rem',
                boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.3)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ flex: 1, minWidth: isMobile ? '100%' : '300px', zIndex: 2 }}>
                    <div style={{ fontSize: isMobile ? '0.75rem' : '0.85rem', fontWeight: '500', opacity: 0.9, marginBottom: '0.2rem' }}>
                        Welcome back! You have {activeTasks.length} pending tasks.
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h1 style={{ fontSize: isMobile ? '1.5rem' : '2.25rem', fontWeight: '900', margin: 0, lineHeight: 1.1 }}>
                            Hello, {userName}
                        </h1>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', zIndex: 2 }}>
                    {/* Level Card */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        padding: '0.75rem',
                        borderRadius: '16px',
                        width: isMobile ? '100%' : '200px',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: '700' }}>
                            <span>Lvl {userProfile?.level || 1}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{userProfile?.streak || 0} <IoFlame color="#f59e0b" /></span>
                        </div>
                        <div style={{ height: '5px', background: 'rgba(0,0,0,0.2)', borderRadius: '3px', marginBottom: '0.75rem' }}>
                            <div style={{ width: `${(userProfile?.xp % 1000) / 10}%`, height: '100%', background: '#4ade80', borderRadius: '3px' }}></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', opacity: 0.8, fontWeight: '600' }}>
                            <span>{userProfile?.xp || 0} XP</span>
                            <span>1000 XP</span>
                        </div>
                        <Link to="/leaderboard" style={{
                            marginTop: '0.6rem',
                            textAlign: 'center',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            color: 'white',
                            textDecoration: 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                        }}>
                            <IoTrophyOutline color="#f59e0b" /> View Leaderboard
                        </Link>
                    </div>

                    {/* New Assignment Button */}
                    <Link to="/add" className="btn-glow" style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        padding: isMobile ? '0.75rem 1.25rem' : '0.875rem 1.5rem',
                        borderRadius: '14px',
                        color: 'white',
                        textDecoration: 'none',
                        fontWeight: '700',
                        fontSize: isMobile ? '0.85rem' : '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        height: 'fit-content',
                        width: isMobile ? '100%' : 'auto'
                    }}>
                        <IoAdd size={18} /> New Assignment
                    </Link>
                </div>
            </div>

            {/* 4. Stats Grid - Desktop Only */}
            {!isMobile && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1rem',
                    marginBottom: '1.5rem'
                }} className="stats-grid">
                    <style>{`
                        @media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(2, 1fr) !important; } }
                    `}</style>

                    {/* Pending */}
                    <div className="card-soft" style={{ background: 'white', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.8rem' }}>
                            <IoTimeOutline size={16} color="#8b5cf6" /> Pending
                        </div>
                        <div style={{ fontSize: '2.25rem', fontWeight: '900', color: '#1e293b', lineHeight: 1 }}>
                            {activeTasks.length}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontWeight: '500' }}>
                            Current tasks
                        </div>
                    </div>

                    {/* Overdue */}
                    <div className="card-soft" style={{ background: 'white', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.8rem' }}>
                            <IoWarningOutline size={16} color="#f59e0b" /> Overdue
                        </div>
                        <div style={{ fontSize: '2.25rem', fontWeight: '900', color: '#1e293b', lineHeight: 1 }}>
                            {overdue.length}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontWeight: '500' }}>
                            Deadlines passed
                        </div>
                    </div>

                    {/* Activity */}
                    <div className="card-soft" style={{ background: 'white', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.8rem' }}>
                            <IoStatsChart size={16} color="#8b5cf6" /> Activity
                        </div>
                        <div style={{ fontSize: '2.25rem', fontWeight: '900', color: '#1e293b', lineHeight: 1 }}>
                            {completedCount}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontWeight: '500' }}>
                            Completed all-time
                        </div>
                    </div>
                </div>
            )}

            {/* 5. Main Layout: Tasks + Calendar */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '3fr 1.2fr', gap: '2.5rem' }}>
                {/* Left: Active Tasks */}
                <section>
                    <div style={{ marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1e293b' }}>Active Tasks</h2>
                    </div>

                    {activeTasks.length === 0 ? (
                        <EmptyState
                            title={isTonightMode ? "You're free tonight 🎉" : "You're all caught up!"}
                            message={isTonightMode ? "Good job staying ahead. Enjoy your evening!" : "No assignments due at the moment. Take a break!"}
                            icon={<IoTrophyOutline size={48} />}
                            actionLabel="Add Upcoming Task"
                            actionTo="/add"
                        />
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {isTonightMode && (
                                <div style={{
                                    background: '#1e293b', color: 'white', padding: '0.75rem 1rem', borderRadius: '12px',
                                    fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem'
                                }}>
                                    <span>🌙</span> Tonight Mode: Hiding tomorrow's clutter
                                </div>
                            )}

                            {activeTasks.map(h => {
                                let status = 'upcoming';
                                if (isBefore(parseISO(h.dueDate), todayStart)) status = 'overdue';
                                else if (isSameDay(parseISO(h.dueDate), today)) status = 'today';

                                if (isTonightMode && status === 'upcoming' && !isSameDay(parseISO(h.dueDate), tomorrow)) return null;

                                return (
                                    <SwipeableTaskItem
                                        key={h.id}
                                        hw={h}
                                        status={status}
                                        onToggle={() => toggleComplete(h.id, h.isCompleted)}
                                    />
                                );
                            })}
                        </div>
                    )}

                    {/* Stats Grid - Mobile Only (After Tasks) */}
                    {isMobile && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr',
                            gap: '1rem',
                            marginTop: '2rem'
                        }}>
                            {/* Pending */}
                            <div className="card-soft" style={{ background: 'white', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.8rem' }}>
                                    <IoTimeOutline size={16} color="#8b5cf6" /> Pending
                                </div>
                                <div style={{ fontSize: '2.25rem', fontWeight: '900', color: '#1e293b', lineHeight: 1 }}>
                                    {activeTasks.length}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontWeight: '500' }}>
                                    Current tasks
                                </div>
                            </div>

                            {/* Overdue */}
                            <div className="card-soft" style={{ background: 'white', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.8rem' }}>
                                    <IoWarningOutline size={16} color="#f59e0b" /> Overdue
                                </div>
                                <div style={{ fontSize: '2.25rem', fontWeight: '900', color: '#1e293b', lineHeight: 1 }}>
                                    {overdue.length}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontWeight: '500' }}>
                                    Deadlines passed
                                </div>
                            </div>

                            {/* Activity */}
                            <div className="card-soft" style={{ background: 'white', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.8rem' }}>
                                    <IoStatsChart size={16} color="#8b5cf6" /> Activity
                                </div>
                                <div style={{ fontSize: '2.25rem', fontWeight: '900', color: '#1e293b', lineHeight: 1 }}>
                                    {completedCount}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontWeight: '500' }}>
                                    Completed all-time
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Right: Calendar Widget */}
                <aside>
                    <div style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '24px',
                        border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <CalendarWidget homeworks={homeworks} />
                    </div>
                </aside>
            </div>

            <QuickAddModal
                isOpen={showQuickAdd}
                onClose={() => setShowQuickAdd(false)}
                onAdded={loadData}
            />
        </div>
    );
}
