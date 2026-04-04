import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import { ChevronLeft, ShoppingCart, Star, Check, Truck, RotateCcw } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <Loader />;
  if (!product) return <div className="container py-20">Product not found.</div>;

  return (
    <div className="product-detail-page">
      <Link to="/products" className="back-link">
        <ChevronLeft size={16} /> Back to Products
      </Link>

      <div className="product-layout">
        {/* Image */}
        <div className="product-image-large">
           <img src={product.image} alt={product.name} />
        </div>

        {/* Info */}
        <div className="product-details">
           <div className="product-meta">
              <span className="meta-brand">{product.brand}</span>
              <h1 className="meta-title">{product.name}</h1>
              <div className="meta-price-row">
                 <span className="meta-price">₹{product.price.toFixed(2)}</span>
                 <div className="meta-rating">
                    <Star size={14} className="fill-black" />
                    <span>{product.rating}</span>
                    <span style={{color: 'var(--muted)'}}>({product.numReviews} reviews)</span>
                 </div>
              </div>
           </div>

           <p className="product-desc">{product.description}</p>

           <div className="product-actions">
              <div className="quantity-selector">
                 <span className="quantity-label">Quantity</span>
                 <div className="quantity-controls">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="qty-btn">-</button>
                    <span className="qty-val">{qty}</span>
                    <button onClick={() => setQty(Math.min(product.countInStock, qty + 1))} className="qty-btn">+</button>
                 </div>
              </div>

              <div className="action-buttons">
                 <button 
                  disabled={product.countInStock === 0}
                  onClick={handleAddToCart}
                  className={`btn add-to-cart-btn ${added ? 'btn-success' : 'btn-primary'}`}
                 >
                    {added ? (
                      <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}><Check size={16} /> Added</span>
                    ) : (
                      product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'
                    )}
                 </button>
                 <button onClick={() => {handleAddToCart(); navigate('/cart');}} className="btn btn-outline" style={{padding: '0 1.5rem', borderColor: 'var(--fg)'}}>
                    <ShoppingCart size={20} />
                 </button>
              </div>
           </div>

           <div className="features-grid-small">
               <div className="feature-item">
                  <Truck size={20} style={{color: 'var(--muted)'}} />
                  <div className="feature-item-text">
                     <span className="feature-item-title">Free Shipping</span>
                     <span className="feature-item-desc">On all orders over ₹100</span>
                  </div>
               </div>
               <div className="feature-item">
                  <RotateCcw size={20} style={{color: 'var(--muted)'}} />
                  <div className="feature-item-text">
                     <span className="feature-item-title">30-Day Returns</span>
                     <span className="feature-item-desc">Easy and free returns</span>
                  </div>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
