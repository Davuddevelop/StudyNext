import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { homeworkService } from '../services/homeworkService';
import { Link, useNavigate } from 'react-router-dom';
import {
    format, isSameDay, addDays, parseISO, startOfDay,
    startOfWeek, endOfWeek, isWithinInterval, isBefore, isAfter
} from 'date-fns';
import {
    IoAdd,
    IoTimeOutline,
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
import FocusTimer from '../components/FocusTimer';
import UndoToast from '../components/UndoToast';
import StatCard from '../components/StatCard';
import PastTasksSection from '../components/PastTasksSection';

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
    const [showFocusTimer, setShowFocusTimer] = useState(false);
    const [celebrationData, setCelebrationData] = useState({ show: false, xp: 0 });
    const [undoToast, setUndoToast] = useState(null);

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const loadData = useCallback(async () => {
        try {
            const data = await homeworkService.getAll(currentUser.uid, isPremium);
            setHomeworks(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [currentUser, isPremium]);

    useEffect(() => {
        if (currentUser) {
            loadData();
        }
    }, [currentUser, loadData]);

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
                    // Check for streak milestones (7, 14, 30, 60, 100 days)
                    const streakMilestones = [7, 14, 30, 60, 100];
                    if (result.streakExtended && streakMilestones.includes(result.newStreak)) {
                        // Extra celebratory confetti for milestone!
                        setTimeout(() => {
                            confetti({
                                particleCount: 200,
                                spread: 120,
                                origin: { y: 0.5 },
                                colors: ['#FFD700', '#FF6B4A', '#FFB74D', '#4ADE80', '#60A5FA']
                            });
                            confetti({
                                particleCount: 100,
                                angle: 60,
                                spread: 55,
                                origin: { x: 0 },
                                colors: ['#FFD700', '#FF6B4A', '#FFB74D']
                            });
                            confetti({
                                particleCount: 100,
                                angle: 120,
                                spread: 55,
                                origin: { x: 1 },
                                colors: ['#FFD700', '#FF6B4A', '#FFB74D']
                            });
                        }, 300);
                    }

                    setCelebrationData({
                        show: true,
                        xp: 100,
                        didLevelUp: result.didLevelUp,
                        streakExtended: result.streakExtended,
                        newStreak: result.newStreak,
                        isStreakMilestone: streakMilestones.includes(result.newStreak)
                    });
                } else {
                    setCelebrationData(prev => ({ ...prev, show: true, xp: 100 }));
                }

                // Show undo toast
                const task = homeworks.find(h => h.id === id);
                setUndoToast({
                    id,
                    message: `"${task?.subject}" completed`,
                    key: Date.now()
                });
            }
        } catch (err) {
            console.error("Failed to update status", err);
            loadData();
        }
    }

    async function handleUndo(taskId) {
        try {
            await homeworkService.update(taskId, { isCompleted: false }, isPremium);
            setHomeworks(prev => prev.map(h =>
                h.id === taskId ? { ...h, isCompleted: false } : h
            ));
            setUndoToast(null);
        } catch (err) {
            console.error("Failed to undo", err);
            loadData();
        }
    }

    async function handleMoveToTomorrow(taskId) {
        try {
            await homeworkService.moveToTomorrow(taskId, isPremium);
            // Update local state optimistically
            const tomorrowDate = new Date();
            tomorrowDate.setDate(tomorrowDate.getDate() + 1);
            tomorrowDate.setHours(9, 0, 0, 0);

            setHomeworks(prev => prev.map(h =>
                h.id === taskId ? { ...h, dueDate: tomorrowDate.toISOString() } : h
            ));
        } catch (err) {
            console.error("Failed to reschedule task", err);
            loadData();
        }
    }

    const today = new Date();
    const todayStart = startOfDay(today);
    const twoDaysAgo = startOfDay(addDays(today, -2));

    const priorityWeight = { high: 0, medium: 1, low: 2 };
    const activeTasks = homeworks.filter(h => !h.isCompleted).sort((a, b) => {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        const diff = dateA - dateB;
        if (diff !== 0) return diff;
        return (priorityWeight[a.priority] || 3) - (priorityWeight[b.priority] || 3);
    });

    const dueToday = activeTasks.filter(h => isSameDay(parseISO(h.dueDate), today));

    // Supportive categorization: "Needs Attention" instead of harsh "Overdue"
    const needsAttention = activeTasks.filter(h => {
        const due = parseISO(h.dueDate);
        return isBefore(due, todayStart) && isAfter(due, twoDaysAgo);
    });

    const pastTasks = activeTasks.filter(h => {
        const due = parseISO(h.dueDate);
        return isBefore(due, twoDaysAgo);
    });

    const upcomingTasks = activeTasks.filter(h => {
        const due = parseISO(h.dueDate);
        return isAfter(due, today) && !isSameDay(due, today);
    });

    // Combined count for stats (softer language)
    const needsAttentionCount = needsAttention.length + pastTasks.length;
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

                    {/* Focus Timer Action */}
                    <button
                        onClick={() => setShowFocusTimer(true)}
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
                        Start Focus Session
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
                        icon={<IoTimeOutline size={18} />}
                        iconColor="var(--accent)"
                        label="Needs Attention"
                        value={needsAttentionCount}
                        sublabel="When you're ready"
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

                            {/* Needs Attention Section - Supportive, not alarming */}
                            {needsAttention.length > 0 && (
                                <div className="animate-fade-up task-section">
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginBottom: '0.75rem'
                                    }}>
                                        <span style={{
                                            background: 'var(--accent)',
                                            color: '#0F0F0F',
                                            padding: '4px 10px',
                                            borderRadius: '8px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700'
                                        }}>Needs Attention</span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            Let's take care of these when you're ready
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {needsAttention.map((h, index) => (
                                            <div key={h.id} className="animate-fade-up" style={{ animationDelay: `${0.05 * index}s` }}>
                                                <SwipeableTaskItem
                                                    hw={h}
                                                    status="needsAttention"
                                                    onToggle={() => toggleComplete(h.id, h.isCompleted)}
                                                    onMoveToTomorrow={handleMoveToTomorrow}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Today's Tasks */}
                            {dueToday.length > 0 && (
                                <div className="animate-fade-up task-section">
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginBottom: '0.75rem'
                                    }}>
                                        <span style={{
                                            background: 'var(--primary)',
                                            color: '#0F0F0F',
                                            padding: '4px 10px',
                                            borderRadius: '8px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700'
                                        }}>Today</span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            Let's tackle these today
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {dueToday.map((h, index) => (
                                            <div key={h.id} className="animate-fade-up" style={{ animationDelay: `${0.05 * index}s` }}>
                                                <SwipeableTaskItem
                                                    hw={h}
                                                    status="today"
                                                    onToggle={() => toggleComplete(h.id, h.isCompleted)}
                                                    onMoveToTomorrow={handleMoveToTomorrow}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Upcoming Tasks */}
                            {upcomingTasks.length > 0 && (
                                <div className="animate-fade-up task-section">
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginBottom: '0.75rem'
                                    }}>
                                        <span style={{
                                            background: 'var(--bg-elevated)',
                                            color: 'var(--text-secondary)',
                                            padding: '4px 10px',
                                            borderRadius: '8px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            border: '1px solid var(--border)'
                                        }}>Coming Up</span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            You've got time
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {upcomingTasks
                                            .filter(h => !isTonightMode || isSameDay(parseISO(h.dueDate), tomorrow))
                                            .map((h, index) => (
                                                <div key={h.id} className="animate-fade-up" style={{ animationDelay: `${0.05 * index}s` }}>
                                                    <SwipeableTaskItem
                                                        hw={h}
                                                        status="upcoming"
                                                        onToggle={() => toggleComplete(h.id, h.isCompleted)}
                                                        onMoveToTomorrow={handleMoveToTomorrow}
                                                    />
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* Past Tasks - Collapsed by default, very subtle */}
                            {pastTasks.length > 0 && (
                                <PastTasksSection
                                    tasks={pastTasks}
                                    onToggle={toggleComplete}
                                    onMoveToTomorrow={handleMoveToTomorrow}
                                />
                            )}
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
                                icon={<IoTimeOutline size={18} />}
                                iconColor="var(--accent)"
                                label="Needs Attention"
                                value={needsAttentionCount}
                                sublabel="When you're ready"
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

                    {/* Premium Promo (Mobile Only + Non-Premium) - After Tasks */}
                    {isMobile && !isPremium && (
                        <Link to="/premium" style={{ textDecoration: 'none' }}>
                            <div className="animate-fade-up" style={{
                                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                                padding: '1.25rem',
                                borderRadius: '16px',
                                marginTop: '1.5rem',
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

            <FocusTimer
                visible={showFocusTimer}
                onClose={() => setShowFocusTimer(false)}
                tasks={homeworks}
                earnXP={earnXP}
                onComplete={(duration, linkedTaskId) => {
                    setShowFocusTimer(false);

                    // Celebration confetti
                    confetti({
                        particleCount: 150,
                        spread: 100,
                        origin: { y: 0.5 },
                        colors: ['#FF6B4A', '#FFB74D', '#F5E6D3']
                    });

                    // XP is already awarded by FocusTimer, just show celebration
                    const xpRewards = { 5: 25, 15: 75, 25: 125, 45: 225, 60: 300 };
                    setCelebrationData({
                        show: true,
                        xp: xpRewards[duration] || 100,
                        customMessage: `${duration} Min Focus Complete!`
                    });
                }}
            />

            {/* Undo Toast for Task Completion */}
            {undoToast && (
                <UndoToast
                    key={undoToast.key}
                    message={undoToast.message}
                    onUndo={() => handleUndo(undoToast.id)}
                    onExpire={() => setUndoToast(null)}
                    duration={5000}
                />
            )}
        </div>
    );
}
