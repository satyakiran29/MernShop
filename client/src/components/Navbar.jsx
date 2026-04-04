import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Shield, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout, isAdmin, isSuperAdmin } = useAuth();
    const { cartItems } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <span className="text-primary">MERN</span>Shop
                </Link>

                {/* Mobile Menu Toggle */}
                <button className="navbar-menu-toggle" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop Menu */}
                <div className={`navbar-menu ${isOpen ? 'open' : ''}`}>
                    <Link to="/products" className="navbar-link">Shop</Link>
                    
                    {isSuperAdmin() && (
                        <Link to="/superadmin" className="navbar-link flex" style={{alignItems: 'center', gap: '0.25rem'}}>
                            <Shield size={14} /> SuperAdmin
                        </Link>
                    )}
                    
                    {isAdmin() && (
                        <Link to="/admin" className="navbar-link">
                             Admin
                        </Link>
                    )}

                    <div className="navbar-actions">
                        <Link to="/cart" className="navbar-cart">
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span className="navbar-cart-badge">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="navbar-actions" style={{gap: '1rem'}}>
                                <Link to="/profile" className="navbar-link flex" style={{alignItems: 'center', gap: '0.5rem'}}>
                                    <User size={18} />
                                    <span>{user.name}</span>
                                </Link>
                                <button onClick={handleLogout} className="navbar-link">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="navbar-actions" style={{gap: '1rem'}}>
                                <Link to="/login" className="navbar-link">Login</Link>
                                <Link to="/register" className="btn btn-primary">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
