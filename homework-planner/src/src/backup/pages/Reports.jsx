import React, { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO, subWeeks } from 'date-fns';
import { IoDownloadOutline, IoStatsChart } from 'react-icons/io5';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Reports() {
    const { userProfile, currentUser } = useAuth();
    // In a real app, we'd fetch all homework history here. 
    // For now, let's assume we have access to some history or mock it.
    // The previous implementation likely fetched from homeworkService or used a passed prop.
    // I'll re-implement a basic fetch or use local mock data if fetch isn't handy without context.
    // But since this is a restore, I should try to be close to original.
    // I'll assume we can pass homeworks or fetch them.
    // For simplicity in this restore, I'll fetch them.

    const [homeworks, setHomeworks] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        // Mock fetch or real fetch
        // Importing service to fetch
        import('../services/homeworkService').then(module => {
            if (currentUser) {
                module.homeworkService.getAll(currentUser.uid).then(data => {
                    setHomeworks(data);
                    setLoading(false);
                });
            }
        });
    }, [currentUser]);

    // Analytics Logic
    const stats = useMemo(() => {
        if (!homeworks.length) return { completionRate: 0, total: 0, completed: 0 };
        const total = homeworks.length;
        const completed = homeworks.filter(h => h.isCompleted).length;
        return {
            total,
            completed,
            completionRate: Math.round((completed / total) * 100)
        };
    }, [homeworks]);

    const chartData = useMemo(() => {
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
    }, [homeworks]);

    const subjectData = useMemo(() => {
        const subjects = {};
        homeworks.forEach(h => {
            if (!subjects[h.subject]) subjects[h.subject] = 0;
            subjects[h.subject]++;
        });
        return Object.keys(subjects).map(s => ({ name: s, value: subjects[s] }));
    }, [homeworks]);

    const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Homework Report", 20, 20);
        doc.setFontSize(12);
        doc.text(`Generated on: ${format(new Date(), 'PPpp')}`, 20, 30);
        doc.text(`Student: ${currentUser?.displayName || 'Student'}`, 20, 40);

        doc.text(`Total Tasks: ${stats.total}`, 20, 60);
        doc.text(`Completion Rate: ${stats.completionRate}%`, 20, 70);

        doc.autoTable({
            startY: 80,
            head: [['Subject', 'Task', 'Due Date', 'Status', 'Priority']],
            body: homeworks.map(h => [
                h.subject,
                h.title,
                format(parseISO(h.dueDate), 'PP'),
                h.isCompleted ? 'Completed' : 'Pending',
                h.priority
            ])
        });

        doc.save('studynext-report.pdf');
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Loading reports...</div>;

    return (
        <div className="container" style={{ paddingBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'white', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                        <IoStatsChart size={24} color="var(--primary)" />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)' }}>Progress Reports</h1>
                </div>
                <button onClick={downloadPDF} className="btn-brand" style={{ width: 'auto' }}>
                    <IoDownloadOutline size={20} /> Export PDF
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem' }}>Weekly Activity</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
                                <Bar dataKey="pending" name="Pending" fill="#e2e8f0" radius={[4, 4, 0, 0]} stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem' }}>Tasks per Subject</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={subjectData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {subjectData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                    {stats.completionRate}%
                </h2>
                <div style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Overall Completion Rate</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '2rem' }}>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{stats.completed}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Completed</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{stats.total}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Assigned</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
