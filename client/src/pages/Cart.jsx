import { Link, useNavigate } from 'react-router-dom';
import { useCart as useCartState } from '../context/CartContext';
import { Trash2, ArrowRight, ShoppingBag, Minus, Plus } from 'lucide-react';

const Cart = () => {
  const { cartItems, addToCart, removeFromCart, itemsPrice, shippingPrice, taxPrice, totalPrice } = useCartState();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/login?redirect=/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty-container">
        <div className="cart-empty-icon-wrapper">
           <ShoppingBag size={48} className="text-muted" />
        </div>
        <h1 className="cart-empty-title">Your cart is empty</h1>
        <p className="cart-empty-desc">Looks like you haven't added anything to your cart yet. Explore our products and find something you love.</p>
        <Link to="/products" className="btn btn-primary cart-empty-btn">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <header className="cart-header">
         <h1 className="cart-title">Shopping Cart</h1>
         <span className="cart-subtitle">{cartItems.reduce((acc, item) => acc + item.qty, 0)} items in your cart</span>
      </header>

      <div className="cart-layout">
        {/* Cart Items */}
        <div className="cart-items-list">
          {cartItems.map((item) => (
            <div key={item.product} className="cart-item">
              <Link to={`/products/${item.product}`} className="cart-item-image">
                <img src={item.image} alt={item.name} />
              </Link>
              
              <div className="cart-item-details">
                <div className="cart-item-header">
                  <div className="cart-item-title-col">
                    <Link to={`/products/${item.product}`} className="cart-item-name">{item.name}</Link>
                    <span className="cart-item-price-small">₹{item.price.toFixed(2)}</span>
                  </div>
                  <button onClick={() => removeFromCart(item.product)} className="cart-item-remove-btn">
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="cart-item-footer">
                   <div className="quantity-controls cart-item-qty">
                      <button 
                        onClick={() => addToCart(item, Math.max(1, item.qty - 1))} 
                        className="qty-btn"
                      >
                         <Minus size={14} />
                      </button>
                      <span className="qty-val">{item.qty}</span>
                      <button 
                        onClick={() => addToCart(item, Math.min(item.countInStock, item.qty + 1))} 
                        className="qty-btn"
                      >
                         <Plus size={14} />
                      </button>
                   </div>
                   <span className="cart-item-total">₹{(item.price * item.qty).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="cart-sidebar">
          <div className="cart-summary">
            <h2 className="cart-summary-title">Order Summary</h2>
            
            <div className="cart-summary-rows">
              <div className="cart-summary-row">
                <span className="cart-summary-label">Subtotal</span>
                <span className="cart-summary-val">₹{itemsPrice.toFixed(2)}</span>
              </div>
              <div className="cart-summary-row">
                <span className="cart-summary-label">Estimated Shipping</span>
                <span className="cart-summary-val">₹{shippingPrice.toFixed(2)}</span>
              </div>
              <div className="cart-summary-row">
                <span className="cart-summary-label">Estimated Tax</span>
                <span className="cart-summary-val">₹{taxPrice.toFixed(2)}</span>
              </div>
              <div className="cart-summary-row cart-summary-total">
                <span className="cart-summary-label-total">Order Total</span>
                <span className="cart-summary-val-total">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={handleCheckout} className="btn btn-primary checkout-btn">
              Proceed to Checkout <ArrowRight size={18} />
            </button>
            <p className="checkout-secure-badge">Secure checkout enabled</p>
          </div>

          <Link to="/products" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
