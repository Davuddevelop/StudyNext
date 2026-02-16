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
    IoTimeOutline,
    IoWarningOutline,
    IoStatsChart,
    IoFlame,
    IoTrophyOutline,
    IoSparkles,
    IoRocketOutline,
    IoMoonOutline
} from 'react-icons/io5';
import CalendarWidget from '../components/CalendarWidget';
import EmptyState from '../components/EmptyState';
import SwipeableTaskItem from '../components/SwipeableTaskItem';
import QuickAddModal from '../components/QuickAddModal';
import confetti from 'canvas-confetti';
// Previous logo: mascot_white.png
import mascot from '../assets/fox_logo_sharp.svg';
import useSEO from '../hooks/useSEO';
import StartMode from '../components/StartMode';

export default function Dashboard() {
    const { currentUser, userProfile, earnXP, isPremium } = useAuth();

    useSEO({
        title: 'Student Dashboard',
        description: 'Your central hub for academic excellence. Manage tasks, track grades, and sync your class schedule in Baku.',
        keywords: 'dashboard, study center, homework list, grade tracker'
    });
    const [homeworks, setHomeworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [showStartMode, setShowStartMode] = useState(false);
    const [celebrationData, setCelebrationData] = useState({ show: false, xp: 0 });
    const navigate = useNavigate();

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
            setHomeworks(prev => prev.map(h =>
                h.id === id ? { ...h, isCompleted: !currentStatus } : h
            ));

            if (!currentStatus) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#FF6B4A', '#FFB74D', '#4ADE80']
                });

                const result = await earnXP(100);
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
            loadData();
        }
    }

    const today = new Date();
    const todayStart = startOfDay(today);

    const priorityWeight = { high: 0, medium: 1, low: 2 };
    const activeTasks = homeworks.filter(h => !h.isCompleted).sort((a, b) => {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        const diff = dateA - dateB;
        if (diff !== 0) return diff;
        return (priorityWeight[a.priority] || 3) - (priorityWeight[b.priority] || 3);
    });

    const dueToday = activeTasks.filter(h => isSameDay(parseISO(h.dueDate), today));
    const overdue = activeTasks.filter(h => isBefore(parseISO(h.dueDate), todayStart));
    const completedCount = homeworks.filter(h => h.isCompleted).length;
    const userName = currentUser?.displayName ? currentUser.displayName.split(' ')[0] : 'Student';

    const currentHour = new Date().getHours();
    const isTonightMode = currentHour >= 19 || currentHour < 5;

    const tomorrow = addDays(today, 1);
    const startWeek = startOfWeek(today);
    const endWeek = endOfWeek(today);
    const tasksThisWeek = homeworks.filter(h => {
        const date = parseISO(h.dueDate);
        return isWithinInterval(date, { start: startWeek, end: endWeek });
    });
    const completedThisWeek = tasksThisWeek.filter(h => h.isCompleted).length;

    function getSupportiveGreeting() {
        if (currentHour < 12 && currentHour >= 5) return `Good morning, ${userName}. Ready for 10 minutes?`;
        if (currentHour < 17 && currentHour >= 12) return `Good afternoon, ${userName}. How's your energy?`;
        if (currentHour < 21 && currentHour >= 17) return `Good evening, ${userName}. Let's start small tonight.`;
        return `It's late, ${userName}. Rest is productive too.`;
    }

    function getTaskStatusMessage() {
        if (activeTasks.length === 0) return "Your schedule is clear. Take this time for yourself.";
        if (activeTasks.length <= 2) return "Just a couple of things to look at. You've got this.";
        return `You have ${activeTasks.length} tasks synced. Let's take them one by one.`;
    }

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                color: 'var(--text-muted)'
            }}>
                <div className="spinner" style={{ width: '32px', height: '32px' }} />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>

            {/* Header Date */}
            <header className="animate-fade-up" style={{ marginBottom: '0.75rem' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600' }}>
                    {format(today, 'EEEE, MMMM d')} · {getSupportiveGreeting()}
                </div>
            </header>

            {/* Weekly Summary Banner */}
            <div className="animate-fade-up animate-delay-1" style={{
                background: 'var(--surface)',
                padding: '0.875rem 1.25rem',
                borderRadius: '14px',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                border: '1px solid var(--border)'
            }}>
                <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'var(--primary-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <img src={mascot} alt="Mascot" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                </div>
                <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Your Personal Journey
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text)' }}>
                        You've nurtured <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{completedThisWeek} milestones</span> this week. Steady progress is the best progress.
                    </div>
                </div>
            </div>

            {/* Premium Promo (Mobile Only + Non-Premium) */}
            {isMobile && !isPremium && (
                <Link to="/premium" style={{ textDecoration: 'none' }}>
                    <div className="animate-fade-up animate-delay-2" style={{
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                        padding: '1.25rem',
                        borderRadius: '16px',
                        marginBottom: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        color: '#0F0F0F'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                            <IoSparkles size={28} />
                            <div>
                                <div style={{ fontSize: '1rem', fontWeight: '700' }}>Academic Peace of Mind</div>
                                <div style={{ fontSize: '0.8rem', fontWeight: '500', opacity: 0.8 }}>Unlock smart reminders & reduce stress</div>
                            </div>
                        </div>
                        <div style={{
                            background: '#0F0F0F',
                            color: 'var(--primary)',
                            padding: '8px 14px',
                            borderRadius: '10px',
                            fontSize: '0.8rem',
                            fontWeight: '700'
                        }}>
                            GO PRO
                        </div>
                    </div>
                </Link>
            )}

            {/* Hero Section */}
            <div className="animate-fade-up animate-delay-2" style={{
                background: 'var(--surface)',
                borderRadius: '20px',
                padding: isMobile ? '1.5rem' : '2rem',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.5rem',
                border: '1px solid var(--border)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background gradient orb */}
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-20%',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, var(--primary-muted) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }} />

                <div style={{ flex: 1, minWidth: isMobile ? '100%' : '300px', zIndex: 2 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        {getTaskStatusMessage()}
                    </div>
                    <h1 style={{
                        fontSize: isMobile ? '1.75rem' : '2.5rem',
                        fontWeight: '800',
                        margin: 0,
                        lineHeight: 1.1,
                        color: 'var(--text)'
                    }}>
                        Hey, <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--primary)' }}>{userName}</span>
                    </h1>

                    {/* Start Mode Action */}
                    <button
                        onClick={() => setShowStartMode(true)}
                        className="animate-fade-up animate-delay-3"
                        style={{
                            marginTop: '1.25rem',
                            padding: '0.875rem 1.5rem',
                            background: 'rgba(255,107,74,0.1)',
                            border: '1px solid rgba(255,107,74,0.2)',
                            borderRadius: '14px',
                            color: 'var(--primary)',
                            fontWeight: '700',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'var(--primary)';
                            e.currentTarget.style.color = '#0F0F0F';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(255,107,74,0.1)';
                            e.currentTarget.style.color = 'var(--primary)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <IoRocketOutline size={20} />
                        Start for 10 minutes
                    </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', zIndex: 2 }}>
                    {/* Personal Journey Card */}
                    <div style={{
                        background: 'var(--bg-elevated)',
                        padding: '1rem',
                        borderRadius: '14px',
                        width: isMobile ? '100%' : '180px',
                        border: '1px solid var(--border)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text)' }}>
                            <span>Stage {userProfile?.level || 1}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent)' }}>
                                {userProfile?.streak || 0}d <IoFlame />
                            </span>
                        </div>
                        <div style={{ height: '6px', background: 'var(--surface)', borderRadius: '3px', marginBottom: '0.5rem' }}>
                            <div style={{
                                width: `${(userProfile?.xp % 1000) / 10}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)',
                                borderRadius: '3px',
                                transition: 'width 0.3s ease'
                            }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                            <span>{userProfile?.xp || 0} Growth</span>
                            <span>Next Milestome</span>
                        </div>
                        <Link to="/settings" style={{
                            marginTop: '0.75rem',
                            textAlign: 'center',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: 'var(--text-muted)',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                        }}>
                            View Journey Details
                        </Link>
                    </div>

                    {/* New Assignment Button */}
                    <Link to="/add" style={{
                        background: 'linear-gradient(135deg, var(--primary) 0%, #FF8266 100%)',
                        padding: isMobile ? '0.875rem 1.5rem' : '1rem 1.75rem',
                        borderRadius: '12px',
                        color: '#0F0F0F',
                        textDecoration: 'none',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        width: isMobile ? '100%' : 'auto',
                        boxShadow: '0 8px 20px -6px rgba(255, 107, 74, 0.4)',
                        transition: 'all 0.2s'
                    }}>
                        <IoAdd size={20} /> New Assignment
                    </Link>
                </div>
            </div>

            {/* Stats Grid - Desktop Only */}
            {!isMobile && (
                <div className="animate-fade-up animate-delay-3" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1rem',
                    marginBottom: '2rem'
                }}>
                    <StatCard
                        icon={<IoTimeOutline size={18} />}
                        iconColor="var(--primary)"
                        label="Pending"
                        value={activeTasks.length}
                        sublabel="Current tasks"
                    />
                    <StatCard
                        icon={<IoWarningOutline size={18} />}
                        iconColor="var(--warning)"
                        label="Overdue"
                        value={overdue.length}
                        sublabel="Deadlines passed"
                    />
                    <StatCard
                        icon={<IoStatsChart size={18} />}
                        iconColor="var(--success)"
                        label="Completed"
                        value={completedCount}
                        sublabel="All-time total"
                    />
                </div>
            )}

            {/* Main Layout: Tasks + Calendar */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2.5fr 1fr', gap: '2rem' }}>
                {/* Left: Active Tasks */}
                <section>
                    <div className="animate-fade-up animate-delay-3" style={{ marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text)' }}>Active Tasks</h2>
                    </div>

                    {activeTasks.length === 0 ? (
                        <EmptyState
                            title={isTonightMode ? "You're free tonight" : "You're all caught up!"}
                            message={isTonightMode ? "Good job staying ahead. Enjoy your evening!" : "No assignments due at the moment. Take a break!"}
                            icon={<IoTrophyOutline size={48} />}
                            actionLabel="Add Upcoming Task"
                            actionTo="/add"
                        />
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {isTonightMode && (
                                <div className="animate-fade-up animate-delay-4" style={{
                                    background: 'var(--surface)',
                                    color: 'var(--text)',
                                    padding: '0.875rem 1rem',
                                    borderRadius: '12px',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    border: '1px solid var(--border)'
                                }}>
                                    <IoMoonOutline size={20} style={{ flexShrink: 0 }} /> Tonight Mode: Focusing on what matters now
                                </div>
                            )}

                            {activeTasks.map((h, index) => {
                                let status = 'upcoming';
                                if (isBefore(parseISO(h.dueDate), todayStart)) status = 'overdue';
                                else if (isSameDay(parseISO(h.dueDate), today)) status = 'today';

                                if (isTonightMode && status === 'upcoming' && !isSameDay(parseISO(h.dueDate), tomorrow)) return null;

                                return (
                                    <div
                                        key={h.id}
                                        className="animate-fade-up"
                                        style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                                    >
                                        <SwipeableTaskItem
                                            hw={h}
                                            status={status}
                                            onToggle={() => toggleComplete(h.id, h.isCompleted)}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Stats Grid - Mobile Only */}
                    {isMobile && (
                        <div className="animate-fade-up animate-delay-4" style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr',
                            gap: '0.75rem',
                            marginTop: '2rem'
                        }}>
                            <StatCard
                                icon={<IoTimeOutline size={18} />}
                                iconColor="var(--primary)"
                                label="Pending"
                                value={activeTasks.length}
                                sublabel="Current tasks"
                            />
                            <StatCard
                                icon={<IoWarningOutline size={18} />}
                                iconColor="var(--warning)"
                                label="Overdue"
                                value={overdue.length}
                                sublabel="Deadlines passed"
                            />
                            <StatCard
                                icon={<IoStatsChart size={18} />}
                                iconColor="var(--success)"
                                label="Completed"
                                value={completedCount}
                                sublabel="All-time total"
                            />
                        </div>
                    )}
                </section>

                {/* Right: Calendar Widget */}
                <aside className="animate-fade-up animate-delay-4">
                    <div style={{
                        background: 'var(--surface)',
                        padding: '1.5rem',
                        borderRadius: '20px',
                        border: '1px solid var(--border)'
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

            {showStartMode && (
                <StartMode
                    onCancel={() => {
                        setShowStartMode(false);
                        if (document.fullscreenElement) {
                            document.exitFullscreen().catch(() => { });
                        }
                    }}
                    onComplete={async () => {
                        setShowStartMode(false);
                        if (document.fullscreenElement) {
                            document.exitFullscreen().catch(() => { });
                        }

                        // Reward for completing focus session
                        confetti({
                            particleCount: 150,
                            spread: 100,
                            origin: { y: 0.5 },
                            colors: ['#FF6B4A', '#FFB74D', '#F5E6D3']
                        });

                        try {
                            const result = await earnXP(250); // Massive bonus for focus
                            if (result) {
                                setCelebrationData({
                                    show: true,
                                    xp: 250,
                                    didLevelUp: result.didLevelUp,
                                    streakExtended: result.streakExtended,
                                    newStreak: result.newStreak,
                                    customMessage: "Unstoppable Focus!"
                                });
                            }
                        } catch (err) {
                            console.error("Failed to earn XP after focus session:", err);
                        }
                    }}
                />
            )}
        </div>
    );
}

function StatCard({ icon, iconColor, label, value, sublabel }) {
    return (
        <div style={{
            background: 'var(--surface)',
            padding: '1.25rem',
            borderRadius: '14px',
            border: '1px solid var(--border)'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem',
                color: 'var(--text-muted)',
                fontWeight: '600',
                fontSize: '0.8rem'
            }}>
                <span style={{ color: iconColor }}>{icon}</span>
                {label}
            </div>
            <div style={{
                fontSize: '2rem',
                fontWeight: '800',
                color: 'var(--text)',
                lineHeight: 1
            }}>
                {value}
            </div>
            <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginTop: '0.4rem',
                fontWeight: '500'
            }}>
                {sublabel}
            </div>
        </div>
    );
}
