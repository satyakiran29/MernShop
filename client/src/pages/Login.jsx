import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const redirect = new URLSearchParams(location.search).get('redirect') || '/';

    useEffect(() => {
        if (user) {
            navigate(redirect);
        }
    }, [user, navigate, redirect]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate(redirect);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Welcome back</h1>
                    <p className="auth-desc">Log in to your account with your email and password.</p>
                </div>

                {error && (
                    <div className="bg-error/10 text-error p-4 rounded-sm text-sm font-medium border border-error/20 flex items-center justify-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column'}}>
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

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="form-input-wrapper">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-black"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <Link to="/forgot-password" size="sm" className="text-xs font-medium self-end hover:text-muted mt-1">Forgot password?</Link>
                    </div>

                    <button disabled={loading} className="btn btn-primary py-4 uppercase font-bold tracking-widest text-xs gap-2 mt-4" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        {loading ? <Loader className="animate-spin" size={18} /> : 'Process Login'} 
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="auth-footer">
                    <span className="text-muted">Don't have an account? </span>
                    <Link to={`/register${redirect !== '/' ? `?redirect=${redirect}` : ''}`} className="auth-link">Register now</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
