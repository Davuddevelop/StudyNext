import { userService } from '../services/userService';

export default function Leaderboard() {
    const { currentUser, userProfile } = useAuth();
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                setLoading(true);
                const fetchedLeaders = await userService.getLeaderboard(10);

                // Map fields to match component expectations and identify current user
                const mappedLeaders = fetchedLeaders.map(u => ({
                    id: u.uid,
                    name: u.displayName || 'Anonymous Student',
                    xp: u.xp || 0,
                    avatar: u.photoURL || null,
                    isCurrentUser: u.uid === currentUser?.uid
                }));

                setLeaders(mappedLeaders);
            } catch (err) {
                console.error("Failed to load leaderboard:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchLeaderboard();
    }, [currentUser]);

    function getMedalColor(rank) {
        switch (rank) {
            case 0: return '#FFB74D'; // Gold
            case 1: return '#94a3b8'; // Silver
            case 2: return '#CD7F32'; // Bronze
            default: return 'transparent';
        }
    }

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>Loading leaderboard...</div>;

    return (
        <div className="container" style={{ paddingBottom: '3rem' }}>
            <header className="animate-fade-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{
                    display: 'inline-flex',
                    padding: '1rem',
                    background: 'linear-gradient(135deg, var(--accent) 0%, #FF6B4A 100%)',
                    borderRadius: '50%',
                    marginBottom: '1.5rem',
                    boxShadow: '0 10px 25px -5px rgba(255, 183, 77, 0.3)'
                }}>
                    <IoTrophy size={48} color="#0A0A0A" />
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text)', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>Leaderboard</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>See who's staying on top of their tasks!</p>
            </header>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="animate-fade-up animate-delay-1" style={{ background: 'var(--surface)', borderRadius: '24px', padding: '1rem', border: '1px solid var(--border)' }}>
                    {leaders.map((user, index) => (
                        <div key={user.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '1rem 1.5rem',
                            borderBottom: index !== leaders.length - 1 ? '1px solid var(--border)' : 'none',
                            background: user.isCurrentUser ? 'var(--primary-muted)' : 'transparent',
                            borderRadius: '16px',
                            transition: 'all 0.2s'
                        }}>
                            <div style={{
                                width: '40px',
                                paddingRight: '1rem',
                                fontWeight: '900',
                                fontSize: '1.2rem',
                                color: index < 3 ? getMedalColor(index) : 'var(--text-muted)',
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                {index < 3 ? <IoMedal size={28} /> : index + 1}
                            </div>

                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: 'var(--bg-elevated)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '1rem',
                                border: index === 0 ? '3px solid var(--accent)' : '1px solid var(--border)'
                            }}>
                                <IoPerson size={24} color="var(--text-muted)" />
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text)' }}>
                                    {user.name} {user.isCurrentUser && <span style={{ color: 'var(--primary)' }}>(You)</span>}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Level {Math.floor(user.xp / 1000) + 1} Scholar</div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: '900', fontSize: '1.2rem', color: 'var(--primary)' }}>
                                    {user.xp.toLocaleString()} XP
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
