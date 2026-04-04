import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
      <div className="profile-info">
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
      </div>
      <button className="btn btn-primary profile-logout-btn" onClick={handleLogout}>
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
};

export default Profile;
