const Footer = () => {
    return (
        <footer className="footer-section">
            <div className="footer-container">
                <div className="footer-brand-col">
                    <span className="footer-title">MERNSHOP</span>
                    <p className="footer-desc">A minimal MERN stack e-commerce experience. Clean design, fast browsing, and secure checkout for modern shoppers.</p>
                </div>
                
                <div className="footer-grid">
                    <div className="footer-col">
                        <span className="footer-col-title">Shop</span>
                        <a href="/products" className="navbar-link">All Products</a>
                        <a href="/new-arrivals" className="navbar-link">New Arrivals</a>
                        <a href="/featured" className="navbar-link">Featured</a>
                    </div>
                    <div className="footer-col">
                        <span className="footer-col-title">Company</span>
                        <a href="/about" className="navbar-link">About Us</a>
                        <a href="/terms" className="navbar-link">Terms</a>
                        <a href="/privacy" className="navbar-link">Privacy</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="footer-bottom-container">
                    <span>
                        © 2026 Mernshop. All rights reserved. | Developed by <a href="https://satyakiran.vercel.app/" target="_blank" rel="noopener noreferrer" className="navbar-link">Satyakiran</a>
                    </span>
                    <div className="footer-socials">
                        <a href="#" className="navbar-link">Instagram</a>
                        <a href="#" className="navbar-link">Twitter</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
