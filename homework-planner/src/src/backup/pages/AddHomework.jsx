import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { homeworkService } from '../services/homeworkService';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoStar } from 'react-icons/io5';
import UpgradeModal from '../components/UpgradeModal';

export default function AddHomework() {
    const subjectRef = useRef();
    const titleRef = useRef();
    const dateRef = useRef();
    const priorityRef = useRef();
    const notesRef = useRef();
    const reminderRef = useRef();
    const reminderTimeRef = useRef();
    const { currentUser, isPremium } = useAuth();
    const [reminderType, setReminderType] = useState('');
    const [subjectColor, setSubjectColor] = useState('#8b5cf6'); // Default violet
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [modalReason, setModalReason] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);

            await homeworkService.add(currentUser.uid || 'guest', {
                subject: subjectRef.current.value,
                title: titleRef.current.value,
                dueDate: dateRef.current.value,
                priority: priorityRef.current.value,
                notes: notesRef.current.value,
                reminder: reminderType,
                reminderCustomTime: reminderType === 'custom' ? reminderTimeRef.current.value : null,
                color: isPremium ? subjectColor : null,
                isCompleted: false,
                createdAt: new Date().toISOString()
            }, isPremium);

            navigate('/');
        } catch (err) {
            console.error(err);
            if (err.message === 'LIMIT_REACHED') {
                setModalReason("You've reached the limit of 30 active tasks.");
                setShowUpgradeModal(true);
            } else {
                setError('Failed to add homework.');
            }
        }
        setLoading(false);
    }

    function handleReminderChange(e) {
        const val = e.target.value;
        // Spec: Free users get "None" or "Same Day"
        const isPremiumOption = val !== '' && val !== 'sameday';

        if (!isPremium && isPremiumOption) {
            setModalReason("Smart reminders (1h, 2h, 1d) are available in the Pro version.");
            setShowUpgradeModal(true);
            setReminderType(''); // Reset to None
        } else {
            setReminderType(val);
        }
    }

    return (
        <div className="container" style={{ paddingBottom: '3rem' }}>
            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                message={modalReason}
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
                <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)', letterSpacing: '-0.5px' }}>Add Assignment</h1>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800', fontSize: '1rem' }}>Subject</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input type="text" ref={subjectRef} className="input" required placeholder="Math, History..." style={{ flex: 1 }} />
                        {isPremium && (
                            <div style={{ width: '60px' }}>
                                <input
                                    type="color"
                                    value={subjectColor}
                                    onChange={(e) => setSubjectColor(e.target.value)}
                                    style={{
                                        width: '100%',
                                        height: '52px',
                                        padding: '4px',
                                        borderRadius: '12px',
                                        border: '1px solid var(--border)',
                                        background: 'var(--surface)',
                                        cursor: 'pointer'
                                    }}
                                    title="Choose subject color"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800', fontSize: '1rem' }}>Assignment</label>
                    <input type="text" ref={titleRef} className="input" required placeholder="Page 32, Read Chapter 4..." />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800', fontSize: '1rem' }}>Due Date</label>
                    <input type="date" ref={dateRef} className="input" required />
                </div>

                {/* Premium Reminder Field */}
                <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <label style={{ fontWeight: '800', fontSize: '1rem' }}>Set Reminder</label>
                        {!isPremium && <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}><IoStar size={16} /> PRO</span>}
                    </div>
                    <select
                        value={reminderType}
                        onChange={handleReminderChange}
                        className="input"
                    >
                        <option value="">None</option>
                        <option value="sameday">Same Day (Free)</option>
                        <option value="2h">2 Hours Before (Pro)</option>
                        <option value="1d">1 Day Before (Pro)</option>
                        <option value="custom">Custom Time (Pro)</option>
                    </select>

                    {reminderType === 'custom' && (
                        <div style={{ marginTop: '0.5rem' }}>
                            <input type="time" ref={reminderTimeRef} className="input" />
                        </div>
                    )}
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800', fontSize: '1rem' }}>Priority</label>
                    <select ref={priorityRef} className="input" defaultValue="medium">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '600', fontSize: '0.95rem', color: 'var(--text)' }}>Notes (Optional)</label>
                    <textarea ref={notesRef} className="input" rows="4" placeholder="Additional details..." style={{ minHeight: '120px', resize: 'vertical' }}></textarea>
                </div>

                <button disabled={loading} className="btn-brand" type="submit" style={{ marginTop: '1.5rem', width: '100%' }}>
                    {loading ? 'Creating...' : 'Create Assignment'}
                </button>
            </form>
        </div>
    );
}
