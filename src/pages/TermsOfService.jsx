import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

export default function TermsOfService() {
    const navigate = useNavigate();

    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => navigate(-1)} style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                color: 'var(--text)',
                fontWeight: '600'
            }}>
                <IoArrowBack size={20} /> Back
            </button>
            <h1 style={{ fontWeight: 900, marginBottom: '2rem', color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '2.5rem' }}>Terms of Service</h1>
            <div style={{
                background: 'var(--surface)',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                lineHeight: 1.8
            }}>
                <p style={{ marginBottom: '1.5rem' }}><strong style={{ color: 'var(--text-muted)' }}>Last Updated: February 13, 2026</strong></p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <section>
                        <h2 style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>1. Introduction</h2>
                        <p>Welcome to Study Next (“App”, “Service”, “we”, “us”, “our”). By downloading, accessing, or using Study Next, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the App.</p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>2. Eligibility</h2>
                        <p>To use Study Next, you must be at least 13 years old, have permission from a parent/guardian if under 18, and provide accurate registration information. We reserve the right to suspend accounts that violate these rules.</p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>3. Account Registration</h2>
                        <p>You agree that information you provide is true and current, you are responsible for account security, and you will not share login details. You are responsible for all activity under your account.</p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>4. Use of the Service</h2>
                        <p>You agree to use Study Next only for lawful and educational purposes. You may NOT use the app for illegal activities, harass others, upload harmful software, or attempt to hack the system.</p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>5. Features and Availability</h2>
                        <p>We aim for stability but do not guarantee 100% uptime or error-free operation. Features may change or be removed without notice.</p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>6. Subscription and Payments</h2>
                        <p>Payments are processed via third-party services (e.g., PayPal). Fees are non-refundable unless required by law. Subscription fees may change with notice.</p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>7. Free Trials</h2>
                        <p>Trials may be limited in time. You may be charged after the trial ends if not cancelled. Trial conditions are subject to change.</p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>8. User Content</h2>
                        <p>You retain ownership of your tasks, notes, and images. By using the app, you grant us a license to store and process this data to provide and improve our service.</p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>9. Community and Social Features</h2>
                        <p>Respect others and avoid bullying or fake accounts. We may remove content or accounts that harm the community environment.</p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>10. Intellectual Property</h2>
                        <p>All app content, including the fox mascot, design, and code, belongs to Study Next. You may not copy or redistribute without permission.</p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>11. Privacy</h2>
                        <p>Your privacy matters. Our Privacy Policy explains what data we collect and how we protect it. By using the app, you agree to these practices.</p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>12. Data Storage and Security</h2>
                        <p>We use reasonable measures to protect data, but no system is 100% secure. You use the service at your own risk regarding unauthorized access or data loss.</p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>13. Educational Disclaimer</h2>
                        <p>Study Next provides productivity tools only. We do NOT guarantee better grades or exam results; success depends on your individual effort.</p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>14. Third-Party Services</h2>
                        <p>The app uses third-party payment and analytics tools. We are not responsible for their independent terms or service quality.</p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>15. Termination</h2>
                        <p>We may suspend or delete your account if you violate these terms. You may also delete your account at any time via settings.</p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>16. Limitation of Liability</h2>
                        <p>Study Next is not liable for data loss, missed deadlines, academic failure, or technical/financial issues arising from app use.</p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>17. Disclaimer of Warranties</h2>
                        <p>The service is provided “AS IS”. We make no warranties that it will meet all needs or be perfectly error-free at all times.</p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>18. Indemnification</h2>
                        <p>You agree to defend and hold harmless Study Next from claims or damages resulting from your misuse of the application.</p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>19. Changes to Terms</h2>
                        <p>We may update these terms. Significant changes will be notified. Continued use constitutes acceptance of the new terms.</p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>20. Governing Law</h2>
                        <p>These Terms are governed by the laws of Azerbaijan. Legal disputes will be handled in local courts in Baku.</p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>21. Contact Information</h2>
                        <p>For support: Email <a href="mailto:spprtstdnxt@gmail.com" style={{ color: 'var(--primary)', fontWeight: '600' }}>spprtstdnxt@gmail.com</a> | Web: takflow-6d0f5.web.app</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
