import React, { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { format, eachDayOfInterval, isSameDay, parseISO, subWeeks } from 'date-fns';
import { IoDownloadOutline, IoStatsChart, IoInformationCircle } from 'react-icons/io5';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Demo data for visualization when no real tasks exist
const DEMO_CHART_DATA = [
    { name: 'Mon', completed: 3, pending: 2 },
    { name: 'Tue', completed: 5, pending: 1 },
    { name: 'Wed', completed: 2, pending: 3 },
    { name: 'Thu', completed: 4, pending: 2 },
    { name: 'Fri', completed: 6, pending: 0 },
    { name: 'Sat', completed: 1, pending: 1 },
    { name: 'Sun', completed: 2, pending: 2 }
];

const DEMO_SUBJECT_DATA = [
    { name: 'Mathematics', value: 8 },
    { name: 'Physics', value: 6 },
    { name: 'Chemistry', value: 5 },
    { name: 'English', value: 4 },
    { name: 'History', value: 3 }
];

export default function Reports() {
    const { userProfile, currentUser, isPremium } = useAuth();

    const [homeworks, setHomeworks] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        import('../services/homeworkService').then(module => {
            if (currentUser) {
                module.homeworkService.getAll(currentUser.uid, isPremium).then(data => {
                    setHomeworks(data);
                    setLoading(false);
                });
            }
        });
    }, [currentUser, isPremium]);

    // Check if we should use demo data
    const isDemoMode = homeworks.length === 0;

    // Analytics Logic
    const stats = useMemo(() => {
        if (isDemoMode) {
            return { completionRate: 73, total: 26, completed: 19 };
        }
        const total = homeworks.length;
        const completed = homeworks.filter(h => h.isCompleted).length;
        return {
            total,
            completed,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }, [homeworks, isDemoMode]);

    const chartData = useMemo(() => {
        if (isDemoMode) return DEMO_CHART_DATA;

        const last7Days = eachDayOfInterval({
            start: subWeeks(new Date(), 1),
            end: new Date()
        });

        return last7Days.map(day => {
            const dayTasks = homeworks.filter(h => isSameDay(parseISO(h.dueDate), day));
            return {
                name: format(day, 'EEE'),
                completed: dayTasks.filter(t => t.isCompleted).length,
                pending: dayTasks.filter(t => !t.isCompleted).length
            };
        });
    }, [homeworks, isDemoMode]);

    const subjectData = useMemo(() => {
        if (isDemoMode) return DEMO_SUBJECT_DATA;

        const subjects = {};
        homeworks.forEach(h => {
            if (!subjects[h.subject]) subjects[h.subject] = 0;
            subjects[h.subject]++;
        });
        return Object.keys(subjects).map(s => ({ name: s, value: subjects[s] }));
    }, [homeworks, isDemoMode]);

    const COLORS = ['#FF6B4A', '#FFB74D', '#4ECDC4', '#A78BFA', '#F472B6'];

    const downloadPDF = () => {
        if (isDemoMode) {
            alert('Add some tasks first to export your report!');
            return;
        }

        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("StudyNext Report", 20, 20);
        doc.setFontSize(12);
        doc.text(`Generated: ${format(new Date(), 'PPpp')}`, 20, 30);
        doc.text(`Student: ${currentUser?.displayName || 'Student'}`, 20, 40);

        doc.text(`Total Tasks: ${stats.total}`, 20, 60);
        doc.text(`Completed: ${stats.completed}`, 20, 70);
        doc.text(`Completion Rate: ${stats.completionRate}%`, 20, 80);

        if (homeworks.length > 0) {
            doc.autoTable({
                startY: 90,
                head: [['Subject', 'Task', 'Due Date', 'Status']],
                body: homeworks.map(h => [
                    h.subject,
                    h.title,
                    format(parseISO(h.dueDate), 'PP'),
                    h.isCompleted ? '✓ Done' : '○ Pending'
                ])
            });
        }

        doc.save(`studynext-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto' }} />
                <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Loading your progress...</p>
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: '3rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div className="animate-fade-up" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        background: 'var(--surface)',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border)'
                    }}>
                        <IoStatsChart size={24} color="var(--primary)" />
                    </div>
                    <div>
                        <h1 style={{
                            fontSize: '2rem',
                            fontWeight: '800',
                            color: 'var(--text)',
                            margin: 0
                        }}>
                            Progress Reports
                        </h1>
                        {isDemoMode && (
                            <p style={{
                                fontSize: '0.85rem',
                                color: 'var(--text-muted)',
                                margin: '0.25rem 0 0 0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <IoInformationCircle size={16} />
                                Preview mode - Add tasks to see your real data
                            </p>
                        )}
                    </div>
                </div>
                <button
                    onClick={downloadPDF}
                    className="btn-brand"
                    style={{
                        width: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        opacity: isDemoMode ? 0.6 : 1,
                        cursor: isDemoMode ? 'not-allowed' : 'pointer'
                    }}
                    disabled={isDemoMode}
                >
                    <IoDownloadOutline size={20} /> Export PDF
                </button>
            </div>

            {/* Charts */}
            <div className="animate-fade-up animate-delay-1" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                {/* Weekly Activity Chart */}
                <div style={{
                    background: 'var(--surface)',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    border: '1px solid var(--border)',
                    position: 'relative'
                }}>
                    <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        marginBottom: '1.5rem',
                        color: 'var(--text)'
                    }}>
                        Weekly Activity
                    </h3>
                    <div style={{ height: '280px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{
                                        borderRadius: '10px',
                                        border: '1px solid var(--border)',
                                        background: 'var(--bg-elevated)',
                                        color: 'var(--text)',
                                        fontSize: '0.85rem'
                                    }}
                                />
                                <Bar dataKey="completed" name="Completed" fill="#4ECDC4" radius={[4, 4, 0, 0]} stackId="a" />
                                <Bar dataKey="pending" name="Pending" fill="#FF6B4A" radius={[4, 4, 0, 0]} stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Subject Distribution Chart */}
                <div style={{
                    background: 'var(--surface)',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    border: '1px solid var(--border)'
                }}>
                    <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        marginBottom: '1.5rem',
                        color: 'var(--text)'
                    }}>
                        Tasks by Subject
                    </h3>
                    <div style={{ height: '280px' }}>
                        {subjectData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={subjectData}
                                        cx="50%"
                                        cy="45%"
                                        innerRadius={50}
                                        outerRadius={75}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {subjectData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '10px',
                                            border: '1px solid var(--border)',
                                            background: 'var(--bg-elevated)',
                                            color: 'var(--text)',
                                            fontSize: '0.85rem'
                                        }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        wrapperStyle={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text-muted)'
                            }}>
                                No subjects yet
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="animate-fade-up animate-delay-2" style={{
                background: 'var(--surface)',
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                textAlign: 'center'
            }}>
                <h2 style={{
                    fontSize: '3rem',
                    fontWeight: '900',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '0.5rem'
                }}>
                    {stats.completionRate}%
                </h2>
                <div style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.95rem' }}>
                    Overall Completion Rate
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '3rem',
                    marginTop: '2rem',
                    flexWrap: 'wrap'
                }}>
                    <div>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: '#4ECDC4' }}>
                            {stats.completed}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            Completed
                        </div>
                    </div>
                    <div style={{
                        width: '1px',
                        background: 'var(--border)',
                        margin: '0.5rem 0'
                    }} />
                    <div>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)' }}>
                            {stats.total}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            Total Tasks
                        </div>
                    </div>
                    <div style={{
                        width: '1px',
                        background: 'var(--border)',
                        margin: '0.5rem 0'
                    }} />
                    <div>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: '#FF6B4A' }}>
                            {stats.total - stats.completed}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            Pending
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}