import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

export default function TermsOfService() {
    const navigate = useNavigate();

    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IoArrowBack size={24} /> Back
            </button>
            <h1 style={{ fontWeight: 900, marginBottom: '2rem' }}>Terms of Service</h1>
            <p><strong>Last Updated: February 4, 2026</strong></p>
            <p>By using StudyNext, you agree to the following terms.</p>

            <h2 style={{ marginTop: '2rem' }}>1. Use of Service</h2>
            <p>StudyNext is a personal productivity tool. You are responsible for maintaining the confidentiality of your account.</p>

            <h2 style={{ marginTop: '2rem' }}>2. Premium Features</h2>
            <p>Premium features are provided as a one-time lifetime purchase. All sales are final, processed through Apple, Google, or PayPal.</p>

            <h2 style={{ marginTop: '2rem' }}>3. Limitation of Liability</h2>
            <p>StudyNext is provided "as is" without warranties of any kind.</p>

            <h2 style={{ marginTop: '2rem' }}>4. Changes to Terms</h2>
            <p>We may update these terms from time to time. Continued use of the app constitutes acceptance of new terms.</p>
        </div>
    );
}
