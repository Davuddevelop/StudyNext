import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { IoCheckmarkCircle, IoArrowBack, IoSettingsOutline, IoLockClosed } from 'react-icons/io5';
import CardPaymentForm from '../components/CardPaymentForm';
import { iapService } from '../services/iapService';
import { userService } from '../services/userService';
import { Capacitor } from '@capacitor/core';

export default function PricingPage() {
    const { currentUser, isPremium, refreshProfile } = useAuth();
    const navigate = useNavigate();

    const LIFETIME_PRICE = '19.99';

    const features = [
        "Smart Reminders (Never forget deadlines)",
        "Unlimited Tasks (No 10 limit)",
        "Cloud Sync & Backup",
        "Weekly Progress Reports",
        "Lifetime Updates"
    ];

    const handlePaymentSuccess = async () => {
        await refreshProfile();
        navigate('/checkout-success');
    };

    const handleNativeUpgrade = async () => {
        await iapService.presentPaywall(currentUser?.uid);
        await refreshProfile();
    };

    const handleManageSubscription = async () => {
        await iapService.presentCustomerCenter();
    };

    const isNative = Capacitor.isNativePlatform();

    return (
        <div className="container" style={{ paddingBottom: '3rem' }}>
            <div style={{ padding: '0.5rem 0', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', display: 'flex' }}>
                    <IoArrowBack size={24} />
                </button>
            </div>

            <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-1px', color: 'var(--text)', fontFamily: 'var(--font-display)' }}>Academic Peace of Mind</h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Invest in your well-being. Stop worrying, start thriving.</p>
            </div>

            {/* Pricing Card */}
            <div className="animate-fade-up animate-delay-1" style={{
                background: 'linear-gradient(135deg, #FF6B4A 0%, #FFB74D 100%)',
                borderRadius: '24px',
                padding: '2.5rem',
                color: '#0A0A0A',
                position: 'relative',
                maxWidth: '450px',
                margin: '0 auto',
                boxShadow: '0 25px 50px -12px rgba(255, 107, 74, 0.4)',
                textAlign: 'center'
            }}>
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#0A0A0A', color: 'var(--text)', fontWeight: '900', padding: '6px 16px', borderRadius: '12px', fontSize: '0.75rem' }}>
                    ONE-TIME GIFT TO YOURSELF
                </div>

                <div style={{ marginBottom: '2.5rem', marginTop: '1rem' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', opacity: 0.9, marginBottom: '0.25rem' }}>StudyNext Premium</div>
                    <div style={{ fontSize: '3rem', fontWeight: '900', lineHeight: 1 }}>
                        ${LIFETIME_PRICE}
                        <span style={{ fontSize: '1.2rem', fontWeight: '700', opacity: 0.8 }}> once</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem' }}>No subscriptions. Just lifetime support.</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem', textAlign: 'left' }}>
                    {features.map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <IoCheckmarkCircle size={20} color="#0A0A0A" />
                            <span style={{ fontWeight: '700', fontSize: '1rem' }}>{f}</span>
                        </div>
                    ))}
                </div>

                {isPremium ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{
                            width: '100%',
                            padding: '1.25rem',
                            borderRadius: '16px',
                            background: 'rgba(0,0,0,0.2)',
                            color: '#0A0A0A',
                            fontWeight: '900',
                            fontSize: '1.2rem',
                            textAlign: 'center'
                        }}>
                            You're Premium!
                        </div>
                        {isNative && (
                            <button
                                onClick={handleManageSubscription}
                                style={{
                                    background: '#0A0A0A',
                                    color: 'var(--text)',
                                    border: 'none',
                                    padding: '0.75rem',
                                    borderRadius: '12px',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <IoSettingsOutline /> Manage Subscription
                            </button>
                        )}
                        {!isNative && (
                            <button
                                onClick={async () => {
                                    if (currentUser?.uid) {
                                        await userService.updatePlan(currentUser.uid, 'free');
                                        await refreshProfile();
                                    }
                                }}
                                style={{
                                    background: 'none',
                                    color: 'rgba(0,0,0,0.6)',
                                    border: '1px solid rgba(0,0,0,0.2)',
                                    padding: '0.5rem',
                                    borderRadius: '10px',
                                    fontWeight: '600',
                                    fontSize: '0.8rem',
                                    marginTop: '1rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Reset to Free (Testing)
                            </button>
                        )}
                    </div>
                ) : (
                    <div style={{
                        background: 'rgba(0,0,0,0.15)',
                        borderRadius: '16px',
                        padding: '1.5rem'
                    }}>
                        {isNative ? (
                            <button
                                onClick={handleNativeUpgrade}
                                style={{
                                    width: '100%',
                                    background: '#0A0A0A',
                                    color: 'var(--text)',
                                    padding: '1.25rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    fontSize: '1.1rem',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                                }}
                            >
                                UPGRADE NOW
                            </button>
                        ) : (
                            <CardPaymentForm
                                currentUser={currentUser}
                                onSuccess={handlePaymentSuccess}
                                amount={LIFETIME_PRICE}
                            />
                        )}
                    </div>
                )}
            </div>

            {!isPremium && !isNative && (
                <div style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.7, color: 'var(--text-muted)', textAlign: 'center' }}>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', textDecoration: 'underline', cursor: 'pointer', fontSize: 'inherit' }}
                    >
                        Not seeing the buttons? Refresh the page.
                    </button>
                </div>
            )}

            {/* Trust Indicators */}
            <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <p style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><IoLockClosed size={16} /> Secure payment processing</p>
                <p>Questions? Contact <a href="mailto:spprtstdnxt@gmail.com" style={{ color: 'var(--primary)', fontWeight: '700' }}>spprtstdnxt@gmail.com</a></p>
            </div>

            {/* Plan Comparison */}
            <div className="animate-fade-up animate-delay-2" style={{ marginTop: '4rem', maxWidth: '800px', margin: '4rem auto 0' }}>
                <h3 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: '800', marginBottom: '2rem', color: 'var(--text)', fontFamily: 'var(--font-display)' }}>Compare Plans</h3>
                <div style={{ background: 'var(--surface)', borderRadius: '20px', padding: '2rem', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem', fontWeight: '800', color: 'var(--text)' }}>
                        <div>Feature</div>
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Free</div>
                        <div style={{ textAlign: 'center', color: 'var(--primary)' }}>Premium</div>
                    </div>

                    {[
                        { name: "Active Tasks", free: "10 Slots", pro: "Unlimited" },
                        { name: "Task History", free: "30 Days", pro: "Lifetime" },
                        { name: "Subjects", free: "Basic", pro: "Color Coded" },
                        { name: "Reports", free: "—", pro: "PDF Export" },
                        { name: "Support", free: "Standard", pro: "Priority" },
                        { name: "Ads", free: "Yes", pro: "No Ads" }
                    ].map((row, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', padding: '0.75rem 0', borderBottom: i === 5 ? 'none' : '1px solid var(--border)' }}>
                            <div style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text)' }}>{row.name}</div>
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{row.free}</div>
                            <div style={{ textAlign: 'center', fontWeight: '700', color: 'var(--text)', fontSize: '0.9rem' }}>{row.pro}</div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
