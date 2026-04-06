import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Shield, Loader, Lock, Mail, ShieldAlert, CheckCircle2, UserCircle } from 'lucide-react';

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
      <div className="container py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <ShieldAlert size={64} className="text-neutral-300" />
          <h2 className="text-2xl font-bold">Unauthorized Access</h2>
          <p className="text-muted">You must be securely logged into your account to view this profile dashboard.</p>
          <button className="btn btn-primary w-full mt-4" onClick={() => navigate('/login')}>Return to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-20 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-3xl bg-white border rounded-2xl shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md">
        
        {/* Premium Header Gradient */}
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 p-10 flex items-center gap-8 text-white relative overflow-hidden">
          {/* Subtle Watermark */}
          <div className="absolute -top-10 -right-10 p-12 opacity-5 pointer-events-none">
            <Shield size={300} />
          </div>
          
          <div className="bg-white/10 p-5 rounded-full backdrop-blur-sm border border-white/20 shadow-xl">
            <UserCircle size={80} className="text-white" />
          </div>
          
          <div className="flex flex-col gap-2 z-10">
            <h1 className="text-4xl font-extrabold tracking-tight">{user.name}</h1>
            <p className="text-white/70 flex items-center gap-2 font-medium"><Mail size={16} /> {user.email}</p>
          </div>
        </div>

        <div className="p-10 flex flex-col gap-10">
          
          {/* Overview Section */}
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-muted mb-4 border-b pb-2">Account Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 p-5 bg-surface rounded-xl border border-transparent hover:border-black/10 transition-colors">
                <span className="text-[10px] font-bold text-muted uppercase tracking-widest">System Role</span>
                <div className="flex items-center gap-3 mt-1 underline-offset-4 decoration-2 decoration-black/10 underline">
                  <ShieldAlert size={20} className={user.role === 'user' ? 'text-blue-500' : 'text-purple-600'} />
                  <span className="font-extrabold text-lg capitalize tracking-tight">{user.role.replace('_', ' ')}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-1 p-5 bg-surface rounded-xl border border-transparent hover:border-black/10 transition-colors">
                <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Account Status</span>
                <div className="flex items-center gap-3 mt-1">
                  <CheckCircle2 size={20} className="text-green-500" />
                  <span className="font-extrabold text-lg text-green-600 tracking-tight">Active & Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-muted mb-4 border-b pb-2">Security Settings</h2>
            
            <div className={`flex items-center justify-between p-6 rounded-xl border-2 transition-all ${user.is2FAEnabled ? 'bg-green-50/50 border-green-500/20 shadow-sm' : 'bg-surface border-transparent hover:border-black/10'}`}>
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-full transition-colors ${user.is2FAEnabled ? 'bg-green-100 text-green-600' : 'bg-neutral-200 text-neutral-500'}`}>
                  <Lock size={28} />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-xl tracking-tight">Two-Factor Authentication</span>
                  <span className="text-sm font-medium text-muted mt-1 max-w-md">Require an active email recovery code upon every successful login attempt.</span>
                </div>
              </div>
              
              <button 
                onClick={handleToggle2FA}
                disabled={loading2FA}
                className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none shadow-inner ${user.is2FAEnabled ? 'bg-green-500' : 'bg-neutral-300'}`}
              >
                <span className="sr-only">Toggle 2FA</span>
                <span
                  aria-hidden="true"
                  className={`pointer-events-none flex items-center justify-center h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${user.is2FAEnabled ? 'translate-x-4' : '-translate-x-4'}`}
                >
                  {loading2FA && <Loader size={12} className="animate-spin text-black" />}
                </span>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-8 border-t flex justify-end">
            <button 
              className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 hover:shadow-sm uppercase tracking-widest text-[10px] font-black py-4 px-8 rounded-lg transition-all flex items-center gap-3 border border-red-200" 
              onClick={handleLogout}
            >
              <LogOut size={16} /> Secure Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
