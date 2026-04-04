import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { ArrowRight } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data.slice(0, 4)); // Show top 4
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col gap-20">
      {/* Hero */}
      <section className="hero-section" style={{ backgroundImage: 'url(/images/hero_bg.png)' }}>
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1 className="hero-title">
            Welcome to <span className="text-primary">MERNShop</span>
          </h1>
          <p className="hero-subtitle">
            Discover our premium collection of products. Quality meets affordability in our carefully curated catalog.
          </p>
          <Link to="/products" className="btn btn-primary hero-btn">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container features-section">
        <h2 className="features-title">Why choose us?</h2>
        <div className="features-grid">
            <div className="feature-card">
                <div className="feature-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="feature-card-title">Premium Quality</h3>
                <p className="feature-card-text">We source only the best materials to craft products that last a lifetime.</p>
            </div>
            <div className="feature-card">
                <div className="feature-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="feature-card-title">Fast Setup</h3>
                <p className="feature-card-text">A modern architecture built for speed and seamless user experience.</p>
            </div>
            <div className="feature-card">
                <div className="feature-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <h3 className="feature-card-title">Free Shipping</h3>
                <p className="feature-card-text">Enjoy free shipping on all orders over ₹100 worldwide.</p>
            </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bestsellers-section">
        <div className="bestsellers-header">
          <div className="bestsellers-title-container">
             <span className="bestsellers-label">Featured</span>
             <h2 className="bestsellers-title">Best Sellers</h2>
          </div>
          <Link to="/products" className="bestsellers-link">View All Products</Link>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
      
      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="newsletter-content">
           <h2 className="newsletter-title">Stay Updated</h2>
           <p className="newsletter-desc">Join our newsletter for exclusive access to new arrivals, limited releases, and minimalist inspiration.</p>
           <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="newsletter-input"
              />
              <button className="newsletter-btn">Join</button>
           </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
