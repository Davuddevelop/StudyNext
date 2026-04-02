import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { homeworkService } from '../services/homeworkService';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoDownloadOutline, IoStatsChartOutline, IoCheckmarkDoneCircleOutline, IoAlertCircleOutline, IoCalendarOutline } from 'react-icons/io5';
import { jsPDF } from 'jspdf';
import UpgradeModal from '../components/UpgradeModal';

export default function Reports() {
    const { currentUser, isPremium } = useAuth();
    const [homeworks, setHomeworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        async function loadData() {
            try {
                const data = await homeworkService.getAll(currentUser?.uid || 'guest', isPremium);
                setHomeworks(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
        return () => window.removeEventListener('resize', handleResize);
    }, [currentUser]);

    const activeCount = homeworks.filter(h => !h.isCompleted).length;
    const completedCount = homeworks.filter(h => h.isCompleted).length;
    const highPriorityCount = homeworks.filter(h => h.priority === 'high' && !h.isCompleted).length;

    const exportPDF = () => {
        if (!isPremium) {
            setShowUpgradeModal(true);
            return;
        }
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("TaskFlow Weekly Report", 20, 20);
        doc.setFontSize(12);
        doc.text(`User: ${currentUser?.email || 'Guest'}`, 20, 30);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
        doc.line(20, 40, 190, 40);
        doc.setFontSize(16);
        doc.text("Productivity Summary", 20, 50);
        doc.setFontSize(12);
        doc.text(`• Total Assignments Added: ${homeworks.length}`, 20, 60);
        doc.text(`• Completed Assignments: ${completedCount}`, 20, 70);
        doc.text(`• Active Assignments Remaining: ${activeCount}`, 20, 80);
        doc.text(`• High Priority Tasks Standing: ${highPriorityCount}`, 20, 90);
        doc.save(`TaskFlow_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    if (loading) return <div className="container" style={{ padding: 'var(--container-padding)' }}>Loading reports...</div>;

    return (
        <div className="container" style={{ paddingBottom: '3rem' }}>
            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                message="Exporting PDF reports is a Pro feature."
            />

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem', gap: '1rem' }}>
                <button onClick={() => navigate(-1)} style={{
                    background: '#f1f5f9',
                    border: 'none',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    display: 'flex',
                    padding: '0.75rem',
                    borderRadius: '12px'
                }}>
                    <IoArrowBack size={20} />
                </button>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)', letterSpacing: '-0.5px' }}>Weekly Report</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--grid-gap)', marginBottom: '3rem' }}>
                <StatBox
                    icon={<IoStatsChartOutline size={32} color="var(--primary)" />}
                    label="Total Effort"
                    value={homeworks.length}
                    sub="assignments created"
                />
                <StatBox
                    icon={<IoCheckmarkDoneCircleOutline size={32} color="var(--success)" />}
                    label="Success"
                    value={homeworks.length ? Math.round((completedCount / homeworks.length) * 100) + '%' : '0%'}
                    sub={`${completedCount} tasks done`}
                />
                <StatBox
                    icon={<IoAlertCircleOutline size={32} color="var(--danger)" />}
                    label="Focus"
                    value={highPriorityCount}
                    sub="high priority active"
                />
            </div>

            <div style={{
                background: 'var(--surface)',
                padding: 'var(--card-padding)',
                borderRadius: '24px',
                textAlign: 'center',
                boxShadow: 'var(--shadow)',
                border: '1px solid var(--border)'
            }}>
                <IoCalendarOutline size={64} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                <h2 style={{ fontSize: 'var(--h3-size)', fontWeight: '900', marginBottom: '1rem', textTransform: 'uppercase' }}>Ready for your summary?</h2>
                <p style={{ fontSize: 'var(--body-large)', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem auto', fontWeight: '600' }}>
                    Download a full breakdown of your productivity to track your progress and stay on top of your studies.
                </p>

                <button
                    onClick={exportPDF}
                    className="btn-brand"
                    style={{
                        padding: '1.25rem 2.5rem',
                        fontSize: '1rem',
                        width: isMobile ? '100%' : 'auto',
                        margin: '0 auto',
                    }}
                >
                    <IoDownloadOutline size={22} />
                    {isPremium ? 'Export as PDF' : 'Get PDF Report'}
                </button>

                {!isPremium && <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Pro members get unlimited PDF exports.</div>}
            </div>
        </div>
    );
}

function StatBox({ icon, label, value, sub }) {
    return (
        <div className="card-soft" style={{ padding: '2rem', textAlign: 'left' }}>
            <div style={{ marginBottom: '1.25rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', width: 'fit-content', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
            <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'capitalize' }}>{label}</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)', marginBottom: '0.25rem', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '400' }}>{sub}</div>
        </div>
    );
}
