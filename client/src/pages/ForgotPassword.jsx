import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Loader, ArrowRight, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password, 3: Success
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/send-otp', { email });
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Error sending recovery code');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/reset-password', { email, otp, newPassword });
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating your password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Reset Password</h1>
                    <p className="auth-desc">
                        {step === 1 && "Enter your email to receive a secure recovery code."}
                        {step === 2 && "Enter the recovery code sent to your email and a new password."}
                        {step === 3 && "Password updated securely."}
                    </p>
                </div>

                {error && (
                    <div className="bg-error/10 text-error p-4 rounded-sm text-sm font-medium border border-error/20 flex items-center justify-center">
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleSendOTP} style={{display: 'flex', flexDirection: 'column'}}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input 
                                type="email" 
                                placeholder="email@example.com" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button disabled={loading} className="btn btn-primary py-4 uppercase font-bold tracking-widest text-xs gap-2 mt-4" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            {loading ? <Loader className="animate-spin" size={18} /> : 'Send Recovery Code'} 
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleResetPassword} style={{display: 'flex', flexDirection: 'column'}}>
                        <div className="form-group">
                            <label className="form-label">Recovery Code</label>
                            <input 
                                type="text" 
                                placeholder="123456" 
                                required
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <button disabled={loading} className="btn btn-primary py-4 uppercase font-bold tracking-widest text-xs gap-2 mt-4" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            {loading ? <Loader className="animate-spin" size={18} /> : 'Update Password'} 
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem 0', textAlign: 'center'}}>
                        <CheckCircle size={48} className="text-green-500 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Success!</h3>
                        <p className="text-muted text-sm mb-6">Your password has been reset successfully.</p>
                        <button onClick={() => navigate('/login')} className="btn btn-primary w-full py-4 uppercase font-bold tracking-widest text-xs gap-2 mt-4" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            Return to Login <ArrowRight size={18} />
                        </button>
                    </div>
                )}

                {step !== 3 && (
                    <div className="auth-footer mt-6" style={{textAlign: 'center', display: 'flex', justifyContent: 'center'}}>
                        <Link to="/login" className="text-xs font-semibold text-muted hover:text-black mt-4 underline">Back to Login</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
