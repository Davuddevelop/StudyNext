import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { homeworkService } from '../services/homeworkService';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoSparkles } from 'react-icons/io5';
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
    const [subjectColor, setSubjectColor] = useState('#FF6B4A');
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

            navigate('/dashboard');
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
        const isPremiumOption = val !== '' && val !== 'sameday';

        if (!isPremium && isPremiumOption) {
            setModalReason("Smart reminders (1h, 2h, 1d) are available in the Pro version.");
            setShowUpgradeModal(true);
            setReminderType('');
        } else {
            setReminderType(val);
        }
    }

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                message={modalReason}
            />

            {/* Header */}
            <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                <button onClick={() => navigate(-1)} style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    display: 'flex',
                    padding: '0.75rem',
                    borderRadius: '12px'
                }}>
                    <IoArrowBack size={20} />
                </button>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)' }}>Add New Assignment</h1>
            </div>

            {/* Form Card */}
            <div className="animate-fade-up animate-delay-1" style={{
                background: 'var(--surface)',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid var(--border)'
            }}>
                {error && (
                    <div style={{
                        backgroundColor: 'var(--danger-muted)',
                        color: 'var(--danger)',
                        padding: '1rem',
                        borderRadius: '12px',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        border: '1px solid rgba(255, 107, 107, 0.3)'
                    }}>{error}</div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Subject */}
                    <div>
                        <label>Subject</label>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <input type="text" ref={subjectRef} className="input" required placeholder="Math, History..." style={{ flex: 1 }} />
                            {isPremium && (
                                <div style={{ width: '52px' }}>
                                    <input
                                        type="color"
                                        value={subjectColor}
                                        onChange={(e) => setSubjectColor(e.target.value)}
                                        style={{
                                            width: '100%',
                                            height: '52px',
                                            padding: '4px',
                                            borderRadius: '10px',
                                            border: '1px solid var(--border)',
                                            background: 'var(--bg-elevated)',
                                            cursor: 'pointer'
                                        }}
                                        title="Choose subject color"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Assignment Title */}
                    <div>
                        <label>Assignment</label>
                        <input type="text" ref={titleRef} className="input" required placeholder="Page 32, Read Chapter 4..." />
                    </div>

                    {/* Due Date */}
                    <div>
                        <label>Due Date</label>
                        <input type="date" ref={dateRef} className="input" required />
                    </div>

                    {/* Reminder */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label style={{ marginBottom: 0 }}>Set Reminder</label>
                            {!isPremium && (
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: 'var(--accent)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    <IoSparkles size={14} /> PRO
                                </span>
                            )}
                        </div>
                        <select value={reminderType} onChange={handleReminderChange} className="input">
                            <option value="">None</option>
                            <option value="sameday">Same Day (Free)</option>
                            <option value="2h">2 Hours Before (Pro)</option>
                            <option value="1d">1 Day Before (Pro)</option>
                            <option value="custom">Custom Time (Pro)</option>
                        </select>

                        {reminderType === 'custom' && (
                            <div style={{ marginTop: '0.75rem' }}>
                                <input type="time" ref={reminderTimeRef} className="input" />
                            </div>
                        )}
                    </div>

                    {/* Priority */}
                    <div>
                        <label>Priority</label>
                        <select ref={priorityRef} className="input" defaultValue="medium">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    {/* Notes */}
                    <div>
                        <label>Notes (Optional)</label>
                        <textarea
                            ref={notesRef}
                            className="input"
                            rows="4"
                            placeholder="Additional details..."
                            style={{ minHeight: '120px', resize: 'vertical' }}
                        />
                    </div>

                    {/* Submit */}
                    <button disabled={loading} className="btn-brand" type="submit" style={{ marginTop: '0.5rem', width: '100%', padding: '1.125rem' }}>
                        {loading ? 'Creating...' : 'Create Assignment'}
                    </button>
                </form>
            </div>
        </div>
    );
}
