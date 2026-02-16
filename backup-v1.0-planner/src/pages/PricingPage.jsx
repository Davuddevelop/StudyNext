import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import { IoCheckmarkCircle, IoStar, IoArrowBack } from 'react-icons/io5';
import { PayPalButtons } from '@paypal/react-paypal-js';

export default function PricingPage() {
    const { currentUser, refreshProfile, isPremium } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const LIFETIME_PRICE = '19.99';

    const features = [
        "Smart Reminders (Never forget deadlines)",
        "Unlimited Tasks (No 30 limit)",
        "Cloud Sync & Backup",
        "Weekly Progress Reports",
        "Lifetime Updates"
    ];

    // PayPal order creation
    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [{
                description: 'TaskFlow Premium - Lifetime Access',
                amount: {
                    value: LIFETIME_PRICE,
                    currency_code: 'USD'
                }
            }]
        });
    };

    // PayPal payment approval
    const onApprove = async (data, actions) => {
        try {
            const details = await actions.order.capture();

            // Basic User-Side Verification
            if (details.status !== 'COMPLETED') {
                throw new Error('Payment not completed');
            }

            // Upgrade user to premium
            await userService.updatePlan(currentUser.uid, 'premium');
            await refreshProfile();

            // Redirect to success page
            navigate('/checkout-success');
        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment processing failed. Please contact support@taskflow.app');
        }
    };

    const onError = (err) => {
        console.error('PayPal error:', err);
        alert('Payment failed. Please try again or contact support@taskflow.app');
    };

    return (
        <div className="container" style={{ paddingBottom: '3rem' }}>
            <div style={{ padding: '0.5rem 0', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', display: 'flex' }}>
                    <IoArrowBack size={24} />
                </button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: 'var(--h1-size)', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-1px' }}>Get TaskFlow Premium</h1>
                <p style={{ fontSize: 'var(--body-large)', color: 'var(--text-muted)', fontWeight: '600' }}>Pay once, use forever. No subscriptions.</p>
            </div>

            {/* Pricing Card */}
            <div style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                borderRadius: '32px',
                padding: 'var(--card-padding)',
                color: 'white',
                position: 'relative',
                maxWidth: '450px',
                margin: '0 auto',
                boxShadow: '0 25px 50px -12px rgb(79 70 229 / 0.5)',
                textAlign: 'center'
            }}>
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', color: 'white', fontWeight: '900', padding: '4px 16px', borderRadius: '12px', fontSize: '0.75rem' }}>
                    LIFETIME ACCESS
                </div>

                <div style={{ marginBottom: '2.5rem', marginTop: '1rem' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', opacity: 0.9, marginBottom: '0.25rem' }}>TaskFlow Premium</div>
                    <div style={{ fontSize: 'var(--stat-value-size)', fontWeight: '900', lineHeight: 1 }}>
                        ${LIFETIME_PRICE}
                        <span style={{ fontSize: '1.2rem', fontWeight: '700', opacity: 0.8 }}> once</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem' }}>No monthly fees. No subscriptions.</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem', textAlign: 'left' }}>
                    {features.map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <IoCheckmarkCircle size={20} color="white" />
                            <span style={{ fontWeight: '700', fontSize: '1rem' }}>{f}</span>
                        </div>
                    ))}
                </div>

                {isPremium ? (
                    <div style={{
                        width: '100%',
                        padding: '1.25rem',
                        borderRadius: '16px',
                        background: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: '900',
                        fontSize: '1.2rem',
                        textAlign: 'center'
                    }}>
                        You're Premium! ✨
                    </div>
                ) : (
                    <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '1rem' }}>
                        <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                            style={{
                                layout: 'vertical',
                                color: 'gold',
                                shape: 'rect',
                                label: 'pay'
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Trust Indicators */}
            <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <p style={{ marginBottom: '0.5rem' }}>🔒 Secure payment powered by PayPal</p>
                <p>Questions? Contact <a href="mailto:support@taskflow.app" style={{ color: 'var(--primary)', fontWeight: '700' }}>support@taskflow.app</a></p>
            </div>

            {/* Plan Comparison */}
            <div style={{ marginTop: '4rem', maxWidth: '800px', margin: '4rem auto 0' }}>
                <h3 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: '800', marginBottom: '2rem' }}>Compare Plans</h3>
                <div style={{ background: 'var(--surface)', borderRadius: '24px', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem', fontWeight: '800' }}>
                        <div>Feature</div>
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Free</div>
                        <div style={{ textAlign: 'center', color: 'var(--primary)' }}>Premium</div>
                    </div>

                    {[
                        { name: "Active Tasks", free: "Unlimited", pro: "Unlimited" },
                        { name: "Task History", free: "30 Days", pro: "Lifetime" },
                        { name: "Subjects", free: "Basic", pro: "Color Coded" },
                        { name: "Reports", free: "—", pro: "PDF Export" },
                        { name: "Support", free: "Standard", pro: "Priority" },
                        { name: "Ads", free: "Yes", pro: "No Ads" } // Hypothetical
                    ].map((row, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', padding: '0.75rem 0', borderBottom: i === 5 ? 'none' : '1px solid #f1f5f9' }}>
                            <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{row.name}</div>
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{row.free}</div>
                            <div style={{ textAlign: 'center', fontWeight: '700', color: 'var(--text)', fontSize: '0.9rem' }}>{row.pro}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
