import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Shield, Loader } from 'lucide-react';

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
      <div className="profile-page">
        <div className="profile-empty">
          <p className="profile-empty-msg">You are not logged in.</p>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <User size={48} className="profile-icon" />
        <h1 className="profile-title">Your Profile</h1>
      </header>
      <div className="profile-info space-y-4">
        <div className="profile-info-item">
          <span className="profile-label">Name</span>
          <span className="profile-value">{user.name}</span>
        </div>
        <div className="profile-info-item">
          <span className="profile-label">Email</span>
          <span className="profile-value">{user.email}</span>
        </div>
        <div className="profile-info-item">
          <span className="profile-label">Role</span>
          <span className="profile-value">{user.role}</span>
        </div>
        
        <div className="profile-info-item">
          <span className="profile-label">Two-Factor Security</span>
          <span className="profile-value" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: '500', color: user.is2FAEnabled ? '#2e7d32' : '#888' }}>
              {user.is2FAEnabled ? 'Active' : 'Disabled'}
            </span>
            <button 
              onClick={handleToggle2FA}
              disabled={loading2FA}
              className="btn btn-primary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              {loading2FA && <Loader size={12} className="animate-spin" />}
              {user.is2FAEnabled ? 'Turn Off' : 'Turn On'}
            </button>
          </span>
        </div>
      </div>
      <button className="btn btn-primary profile-logout-btn" onClick={handleLogout}>
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
};

export default Profile;
