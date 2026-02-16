import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { homeworkService } from '../services/homeworkService';
import { isSameDay, isBefore, parseISO, startOfDay, format, startOfWeek, endOfWeek, isWithinInterval, addDays } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import {
    IoAdd,
    IoStatsChart,
    IoDocumentTextOutline,
    IoCalendarClearOutline,
    IoSquareOutline
} from 'react-icons/io5';
import EmptyState from '../components/EmptyState';
import SuccessOverlay from '../components/SuccessOverlay';
import VerificationBanner from '../components/VerificationBanner';
import { SkeletonStatCard, SkeletonTaskList } from '../components/SkeletonLoader';
import SwipeableTaskItem from '../components/SwipeableTaskItem';
import QuickAddModal from '../components/QuickAddModal';

function StatCard({ icon, label, value, period, isDanger }) {
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Check if value is text (not a number)
    const isTextValue = typeof value === 'string' && isNaN(value);

    return (
        <div className="card-soft" style={{
            padding: isMobile ? '1.25rem' : '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: isMobile ? '1rem' : '1.5rem', color: isDanger ? 'var(--danger)' : 'var(--primary)' }}>
                <div style={{ fontSize: isMobile ? '1rem' : '1.2rem', display: 'flex', alignItems: 'center' }}>{icon}</div>
                <span style={{ fontWeight: '700', fontSize: isMobile ? '0.8rem' : '0.9rem', color: 'var(--text-muted)' }}>{label}</span>
            </div>
            <div>
                <div style={{
                    fontSize: isTextValue ? (isMobile ? '1.5rem' : '2rem') : (isMobile ? '2.5rem' : 'var(--stat-value-size)'),
                    fontWeight: isTextValue ? '700' : '800',
                    color: isDanger ? 'var(--danger)' : 'var(--text)',
                    lineHeight: 1,
                    marginBottom: '0.25rem'
                }}>{value}</div>
                <div style={{ fontSize: isMobile ? '0.7rem' : '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>{period}</div>
            </div>
        </div>
    );
}

function SectionHeader({ title }) {
    return (
        <div style={{ marginBottom: '1.25rem', display: 'inline-block' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text)', letterSpacing: '-0.3px' }}>{title}</h3>
        </div>
    );
}

function TaskItem({ hw, status, onToggle }) {
    const priorityColor = hw.color || {
        high: 'var(--danger)',
        medium: 'var(--primary)',
        low: 'var(--success)'
    }[hw.priority] || '#cbd5e1';

    const statusLabel = {
        overdue: { text: 'Overdue', color: 'white', bg: 'var(--danger)' },
        today: { text: 'Today', color: 'white', bg: 'var(--primary)' },
        upcoming: { text: format(parseISO(hw.dueDate), 'MMM d'), color: 'var(--text-muted)', bg: '#f1f5f9' }
    }[status];

    return (
        <div className="card-soft" style={{
            padding: '1rem 1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem',
            borderLeft: `4px solid ${priorityColor}`
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                    onClick={onToggle}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 0 }}
                >
                    <IoSquareOutline size={20} />
                </button>
                <div>
                    <div style={{ fontWeight: '600', fontSize: '1rem', color: 'var(--text)' }}>{hw.subject}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '400' }}>{hw.title}</div>
                </div>
            </div>
            <div style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: statusLabel.color,
                backgroundColor: statusLabel.bg,
                padding: '0.25rem 0.6rem',
                borderRadius: '8px'
            }}>
                {statusLabel.text}
            </div>
        </div>
    );
}

function CalendarWidget({ homeworks = [] }) {
    const today = new Date();
    const [selectedDate, setSelectedDate] = useState(today);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);

    const dates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        dates.push(d);
    }

    const selectedTasks = homeworks.filter(h => isSameDay(parseISO(h.dueDate), selectedDate) && !h.isCompleted);

    return (
        <div>
            <div style={{ marginBottom: '1.5rem', fontWeight: '800', fontSize: '1.2rem' }}>{format(today, 'MMMM yyyy')}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', gap: '8px' }}>
                {dates.map((d, i) => {
                    const isSelected = isSameDay(d, selectedDate);
                    const isToday = isSameDay(d, today);
                    const hasHomework = homeworks.some(h => isSameDay(parseISO(h.dueDate), d) && !h.isCompleted);

                    return (
                        <div
                            key={i}
                            onClick={() => setSelectedDate(d)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                flex: 1
                            }}
                        >
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>{format(d, 'EE')}</span>
                            <div style={{
                                width: '100%',
                                aspectRatio: '1/1',
                                maxWidth: '50px',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                                color: isSelected ? 'white' : 'var(--text)',
                                fontWeight: '700',
                                border: isToday && !isSelected ? '2px solid var(--primary)' : '2px solid transparent',
                                position: 'relative'
                            }}>
                                {format(d, 'd')}
                                {hasHomework && (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '4px',
                                        width: '4px',
                                        height: '4px',
                                        borderRadius: '50%',
                                        backgroundColor: isSelected ? 'white' : '#ef4444'
                                    }}></div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div>
                {selectedTasks.length === 0 ? (
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem', background: 'var(--bg-color)', borderRadius: '16px' }}>
                        No tasks for this day
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {selectedTasks.map(h => (
                            <div key={h.id} style={{
                                padding: '1rem',
                                background: 'var(--bg-color)',
                                borderRadius: '12px',
                                borderLeft: `4px solid ${h.priority === 'high' ? '#ef4444' : 'var(--primary)'}`
                            }}>
                                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{h.subject}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{h.title}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function LevelProgress({ xp = 0, level = 1, streak = 0 }) {
    const XP_PER_LEVEL = 1000;
    const progress = (xp % XP_PER_LEVEL) / 10;

    return (
        <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '1.25rem',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            minWidth: '220px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>Lvl {level}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffbd2e' }}>{streak} 🔥</div>
            </div>

            <div style={{ height: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'var(--accent)',
                    borderRadius: '4px',
                    transition: 'width 0.5s ease-out'
                }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.7rem', fontWeight: '600', opacity: 0.8 }}>
                <span>{xp % XP_PER_LEVEL} XP</span>
                <span>{XP_PER_LEVEL} XP</span>
            </div>

            <Link to="/leaderboard" style={{
                display: 'block',
                textAlign: 'center',
                marginTop: '1rem',
                fontSize: '0.8rem',
                fontWeight: '700',
                color: 'white',
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.15)',
                padding: '0.5rem',
                borderRadius: '8px',
                transition: 'background 0.2s'
            }}>
                🏆 View Leaderboard
            </Link>
        </div>
    );
}

export default function Dashboard() {
    const { currentUser, userProfile: currentUserProfile, earnXP } = useAuth();
    const [homeworks, setHomeworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [celebrationData, setCelebrationData] = useState({ show: false, xp: 0, didLevelUp: false, streakExtended: false, newStreak: 0 });
    const [showQuickAdd, setShowQuickAdd] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        loadData();
        return () => window.removeEventListener('resize', handleResize);
    }, [currentUser]);

    async function loadData() {
        if (!currentUser && !localStorage.getItem('local_auth_user')) {
            setHomeworks([]);
            setLoading(false);
            return;
        }

        try {
            const userId = currentUser?.uid || JSON.parse(localStorage.getItem('local_auth_user'))?.uid || 'guest';
            const data = await homeworkService.getAll(userId, currentUserProfile?.plan === 'premium');
            setHomeworks(data);
        } catch (error) {
            console.error("Failed to load", error);
            setError("Could not load assignments. Please check your connection.");
        } finally {
            setLoading(false);
        }
    }

    async function toggleComplete(id, currentStatus) {
        setHomeworks(prev => prev.map(h => h.id === id ? { ...h, isCompleted: !currentStatus } : h));
        try {
            await homeworkService.update(id, { isCompleted: !currentStatus }, currentUserProfile?.plan === 'premium');
            if (!currentStatus) {
                // Task was just completed
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
                    // Fallback if earnXP didn't return (e.g. no user)
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

    // Auto-Sort by Stress Level: Due Date -> Priority
    const priorityWeight = { high: 0, medium: 1, low: 2 };
    const activeTasks = homeworks.filter(h => !h.isCompleted).sort((a, b) => {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        // Compare dates (ignoring time if we want strict day buckets, but strict time is better for stress)
        // Actually user said "Due date", usually implies day.
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
    const upcomingFiltered = activeTasks.filter(h => {
        const date = parseISO(h.dueDate);
        // If Tonight Mode, exclude anything after tomorrow
        if (isTonightMode) {
            return false;
        }
        return !isSameDay(date, today) && !isBefore(date, todayStart);
    });

    // Weekly Summary Logic
    const startWeek = startOfWeek(today);
    const endWeek = endOfWeek(today);
    const tasksThisWeek = homeworks.filter(h => {
        const date = parseISO(h.dueDate);
        return isWithinInterval(date, { start: startWeek, end: endWeek });
    });
    const completedThisWeek = tasksThisWeek.filter(h => h.isCompleted).length;
    const totalThisWeek = tasksThisWeek.length;
    const weeklyProgress = totalThisWeek > 0 ? Math.round((completedThisWeek / totalThisWeek) * 100) : 0;

    const getWeeklyMessage = () => {
        if (completedThisWeek === 0) return "Ready to start your week?";
        if (completedThisWeek < 5) return "Good start! Keep the momentum going.";
        if (completedThisWeek < 10) return "You're making great progress this week!";
        return "You're crushing it! Outstanding work this week.";
    };

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <SuccessOverlay
                show={celebrationData.show}
                xpGained={celebrationData.xp}
                didLevelUp={celebrationData.didLevelUp}
                streakExtended={celebrationData.streakExtended}
                newStreak={celebrationData.newStreak}
                onComplete={() => setCelebrationData(prev => ({ ...prev, show: false }))}
            />

            {/* Email Verification Banner */}
            <VerificationBanner />

            {/* Weekly Summary Banner (New) */}
            <div style={{
                background: 'var(--surface)',
                padding: '1.25rem',
                borderRadius: '20px',
                marginBottom: 'var(--grid-gap)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: 'var(--shadow-sm)',
                borderLeft: '5px solid var(--primary)'
            }}>
                <div style={{
                    background: 'var(--border)',
                    color: 'var(--primary)',
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                }}>
                    🗓️
                </div>
                <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Weekly Summary</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text)' }}>
                        You finished <span style={{ color: 'var(--primary)' }}>{completedThisWeek} tasks</span> this week. <span style={{ fontWeight: '500' }}>{getWeeklyMessage()}</span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                borderRadius: isMobile ? '20px' : '24px',
                padding: isMobile ? '1.5rem 1.25rem' : '2.5rem 3rem',
                color: 'white',
                marginBottom: 'var(--grid-gap)',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center',
                justifyContent: 'space-between',
                gap: isMobile ? '1.5rem' : '2.5rem',
                boxShadow: '0 10px 30px -10px rgba(139, 92, 246, 0.3)'
            }}>
                <div style={{ flex: 1 }}>
                    <p style={{ opacity: 0.8, fontWeight: '500', fontSize: isMobile ? '0.85rem' : '1rem', marginBottom: '0.5rem' }}>
                        Welcome back! You have {activeTasks.length} pending tasks.
                    </p>
                    <h1 style={{ fontSize: isMobile ? '1.75rem' : '2.5rem', fontWeight: '800', lineHeight: 1.2 }}>
                        Hello, {userName}
                    </h1>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '1rem' : '3rem', flexDirection: isMobile ? 'column' : 'row', width: isMobile ? '100%' : 'auto' }}>
                    <LevelProgress
                        xp={currentUserProfile?.xp}
                        level={currentUserProfile?.level}
                        streak={currentUserProfile?.streak}
                    />

                    <Link to="/add" className="btn-brand" style={{
                        padding: isMobile ? '1rem 1.5rem' : '1.25rem 2.5rem',
                        fontSize: isMobile ? '0.95rem' : '1rem',
                        width: isMobile ? '100%' : 'auto',
                    }}>
                        <IoAdd size={isMobile ? 20 : 24} /> New Assignment
                    </Link>
                </div>
            </div>

            {/* Quick Add Modal */}
            <QuickAddModal
                isOpen={showQuickAdd}
                onClose={() => setShowQuickAdd(false)}
                onAdded={() => {
                    loadData();
                    // Maybe show a mini success toast?
                }}
            />

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: isMobile ? '0.75rem' : 'var(--grid-gap)',
                marginBottom: 'var(--grid-gap)'
            }}>
                <StatCard icon="📅" label="Pending" value={activeTasks.length} period="Current tasks" />
                <StatCard icon="⚠️" label="Overdue" value={overdue.length} period="Deadlines passed" isDanger={overdue.length > 0} />
                <Link to="/premium" style={{ textDecoration: 'none' }}>
                    <StatCard icon="💎" label="Status" value={currentUserProfile?.plan === 'premium' ? 'PRO' : 'FREE'} period={currentUserProfile?.plan === 'premium' ? 'Unlimited' : `${activeTasks.length}/10 slots`} />
                </Link>
                <Link to="/reports" style={{ textDecoration: 'none' }}>
                    <StatCard icon={<IoStatsChart />} label="Activity" value={completedCount} period="Completed all-time" />
                </Link>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '2fr 1.2fr',
                gap: 'var(--grid-gap)',
                alignItems: 'start'
            }}>
                <section>
                    <SectionHeader title="Active Tasks" />
                    {activeTasks.length === 0 ? (
                        <EmptyState
                            icon={<IoCalendarClearOutline size={60} />}
                            title={isTonightMode ? "You're free tonight 🎉" : "You're all caught up!"}
                            message={isTonightMode ? "Good job staying ahead. Enjoy your evening!" : "No assignments due at the moment. Take a break!"}
                            actionLabel="Add Assignment"
                            actionTo="/add"
                        />
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {isTonightMode && (
                                <div style={{
                                    background: '#312e81',
                                    color: '#e0e7ff',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '12px',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    marginBottom: '0.5rem'
                                }}>
                                    <span>🌙</span> Tonight Mode Active: Hiding future clutter
                                </div>
                            )}

                            {overdue.map(h => <SwipeableTaskItem key={h.id} hw={h} status="overdue" onToggle={() => toggleComplete(h.id, h.isCompleted)} />)}
                            {dueToday.map(h => <SwipeableTaskItem key={h.id} hw={h} status="today" onToggle={() => toggleComplete(h.id, h.isCompleted)} />)}

                            {/* In Tonight Mode, also show Tomorrow's tasks */}
                            {isTonightMode && dueTomorrow.map(h => <SwipeableTaskItem key={h.id} hw={h} status="upcoming" onToggle={() => toggleComplete(h.id, h.isCompleted)} />)}

                            {/* Show remaining upcoming only if NOT Tonight Mode */}
                            {!isTonightMode && activeTasks.filter(h => !isSameDay(parseISO(h.dueDate), today) && !isBefore(parseISO(h.dueDate), todayStart)).map(h => <SwipeableTaskItem key={h.id} hw={h} status="upcoming" onToggle={() => toggleComplete(h.id, h.isCompleted)} />)}
                        </div>
                    )}
                </section>

                {!isMobile && (
                    <aside style={{
                        background: 'var(--surface)',
                        borderRadius: '32px',
                        padding: 'var(--card-padding)',
                        boxShadow: 'var(--shadow-sm)',
                        position: 'sticky',
                        top: 'calc(var(--header-height) + 1.5rem)'
                    }}>
                        <CalendarWidget homeworks={homeworks} />
                    </aside>
                )}
            </div>

            {/* Quick Add FAB (Mobile Only) */}
            {isMobile && (
                <button
                    onClick={() => setShowQuickAdd(true)}
                    style={{
                        position: 'fixed',
                        bottom: '90px', // Above bottom nav
                        right: '25px',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 100,
                        cursor: 'pointer'
                    }}
                >
                    <IoAdd size={32} />
                </button>
            )}
        </div>
    );
}
