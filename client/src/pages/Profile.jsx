import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Shield, CheckCircle, Lock } from 'lucide-react';

const Profile = () => {
    const { user, logout, toggle2FA } = useAuth();
    const [loading2FA, setLoading2FA] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleToggle2FA = async () => {
        setLoading2FA(true);
        try {
            await toggle2FA();
        } catch (err) {
            console.error('Failed to toggle 2FA', err);
        } finally {
            setLoading2FA(false);
        }
    };

    if (!user) {
        return (
            <div className="container section flex flex-col items-center gap-4">
                <Shield size={64} className="text-muted" />
                <h2 className="font-bold" style={{ fontSize: '1.5rem' }}>Unauthorized Access</h2>
                <button className="btn btn-primary" onClick={() => navigate('/login')}>Return to Login</button>
            </div>
        );
    }

    return (
        <div className="container section">
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem 2rem' }}>
                <header className="flex flex-col items-center gap-4 border-b" style={{ paddingBottom: '2.5rem', marginBottom: '2.5rem' }}>
                    <div style={{ padding: '1.5rem', backgroundColor: 'var(--surface)', borderRadius: '50%' }}>
                        <User size={64} className="text-primary" />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h1 className="font-bold" style={{ fontSize: '2.5rem', letterSpacing: '-0.025em' }}>{user.name}</h1>
                        <p className="text-muted font-medium">{user.email}</p>
                    </div>
                </header>

                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center border-b" style={{ paddingBottom: '1.5rem' }}>
                        <div className="flex items-center gap-4">
                            <Shield size={24} className="text-muted" />
                            <span className="font-semibold text-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Role</span>
                        </div>
                        <span className="badge" style={{ backgroundColor: 'var(--surface)' }}>{user.role.replace('_', ' ')}</span>
                    </div>

                    <div className="flex justify-between items-center border-b" style={{ paddingBottom: '1.5rem' }}>
                        <div className="flex items-center gap-4">
                            <CheckCircle size={24} className="text-muted" />
                            <span className="font-semibold text-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account Status</span>
                        </div>
                        <span className="badge text-primary" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}>Active</span>
                    </div>

                    <div className="flex flex-col gap-6 border-b" style={{ paddingBottom: '2.5rem' }}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Lock size={24} className="text-muted" />
                                <div className="flex flex-col">
                                    <span className="font-semibold">Two-Factor Authentication</span>
                                    <span className="text-sm text-muted">Extra security for login.</span>
                                </div>
                            </div>
                            <span className="badge" style={{ backgroundColor: user.is2FAEnabled ? 'rgba(16, 185, 129, 0.1)' : 'var(--surface)', color: user.is2FAEnabled ? 'var(--success)' : 'var(--muted)' }}>
                                {user.is2FAEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                        </div>
                        <button 
                            onClick={handleToggle2FA}
                            disabled={loading2FA}
                            className={user.is2FAEnabled ? "btn btn-outline" : "btn btn-primary"}
                            style={{ width: '100%', justifyContent: 'center' }}
                        >
                            {loading2FA ? 'Processing...' : user.is2FAEnabled ? 'Turn Off 2FA' : 'Turn On 2FA'}
                        </button>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <button className="btn btn-outline" onClick={handleLogout} style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--error)', color: 'var(--error)', gap: '0.5rem' }}>
                            <LogOut size={18} /> Secure Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
