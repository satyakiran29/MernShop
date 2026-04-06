import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { CreditCard, Truck, CheckCircle, ArrowRight, Loader } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const CheckoutForm = ({ shippingData, user, onSuccess, onBack }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        setError(null);

        const { error: submitError, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                payment_method_data: {
                    billing_details: {
                        name: user?.name || 'Guest User',
                        email: user?.email || 'guest@example.com',
                        address: {
                            city: shippingData.city,
                            country: 'IN', // Assuming India for UPI compat
                            line1: shippingData.address,
                            postal_code: shippingData.postalCode,
                        }
                    }
                }
            },
            redirect: 'if_required' 
        });

        if (submitError) {
            setError(submitError.message);
            setLoading(false);
            return;
        }

        if (paymentIntent && paymentIntent.status === 'succeeded') {
            onSuccess(paymentIntent);
        } else {
            setError('Payment required additional action or failed.');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="stripe-payment-form">
            <PaymentElement />
            {error && <div className="payment-error-msg">{error}</div>}
            
            <div className="payment-actions">
                <button 
                  disabled={!stripe || loading}
                  className="btn btn-primary checkout-btn full-width"
                >
                    {loading ? <Loader className="animate-spin spin-centered" size={18} /> : `Confirm & Pay`}
                </button>
                <button type="button" onClick={onBack} disabled={loading} className="continue-shopping">Back to Shipping</button>
            </div>
        </form>
    );
};

const Checkout = () => {
    const { user } = useAuth();
    const { cartItems, totalPrice, itemsPrice, shippingPrice, taxPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
    const [clientSecret, setClientSecret] = useState('');
    const [isFetchingIntent, setIsFetchingIntent] = useState(false);

    const [shippingData, setShippingData] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: 'India',
    });

    const handleShippingSubmit = async (e) => {
        e.preventDefault();
        setIsFetchingIntent(true);
        try {
            const { data } = await api.post('/orders/create-payment-intent', {
                itemsPrice, shippingPrice, taxPrice
            });
            setClientSecret(data.clientSecret);
            setStep(2);
        } catch (error) {
            console.error(error);
            alert('Failed to initialize payment gateway.');
        } finally {
            setIsFetchingIntent(false);
        }
    };

    const handlePaymentSuccess = async (paymentIntent) => {
        try {
            const orderData = {
                orderItems: cartItems,
                shippingAddress: shippingData,
                paymentMethod: 'Stripe',
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
            };
            const { data: createdOrder } = await api.post('/orders', orderData);

            await api.put(`/orders/${createdOrder._id}/pay`, {
                id: paymentIntent.id,
                status: paymentIntent.status,
                update_time: new Date().toISOString(),
                payer: { email_address: 'stripe-auto@example.com' }
            });

            setStep(3);
            clearCart();
        } catch (error) {
            console.error('Failed to finalize order', error);
            alert('Payment accepted, but failed to create order. Please contact support.');
        }
    };

    if (step === 3) {
        return (
            <div className="cart-empty-container">
                <div className="cart-empty-icon-wrapper" style={{color: 'var(--success)'}}>
                    <CheckCircle size={64} />
                </div>
                <h1 className="cart-empty-title">Order Confirmed</h1>
                <p className="cart-empty-desc">Thank you for your purchase. Your payment was successful and your order is being processed.</p>
                <button onClick={() => navigate('/orders')} className="btn btn-primary cart-empty-btn">View My Orders</button>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <header className="cart-header">
                <h1 className="cart-title">Checkout</h1>
                <div className="checkout-steps">
                    <span className={step >= 1 ? 'step-active' : 'step-inactive'}>Shipping</span>
                    <span className="step-inactive">/</span>
                    <span className={step >= 2 ? 'step-active' : 'step-inactive'}>Payment</span>
                    <span className="step-inactive">/</span>
                    <span className="step-inactive">Confirmation</span>
                </div>
            </header>

            <div className="cart-layout">
                {/* Main Content */}
                <div className="checkout-main-content">
                   {step === 1 ? (
                       <form onSubmit={handleShippingSubmit} className="checkout-form">
                           <div className="checkout-form-header">
                               <Truck size={20} />
                               <h2>Shipping Information</h2>
                           </div>
                           
                           <div className="checkout-form-grid">
                               <div className="form-group-minimal">
                                   <label>Street Address</label>
                                   <input 
                                     required 
                                     value={shippingData.address}
                                     onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                                     placeholder="123 Minimalist St" 
                                   />
                               </div>
                               <div className="checkout-form-row">
                                   <div className="form-group-minimal">
                                       <label>City</label>
                                       <input 
                                         required 
                                         value={shippingData.city}
                                         onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                                         placeholder="Design City" 
                                       />
                                   </div>
                                    <div className="form-group-minimal">
                                       <label>Postal Code</label>
                                       <input 
                                         required 
                                         value={shippingData.postalCode}
                                         onChange={(e) => setShippingData({...shippingData, postalCode: e.target.value})}
                                         placeholder="101010" 
                                       />
                                   </div>
                               </div>
                               <div className="form-group-minimal">
                                   <label>Country</label>
                                   <input 
                                     required 
                                     value={shippingData.country}
                                     onChange={(e) => setShippingData({...shippingData, country: e.target.value})}
                                     placeholder="India" 
                                   />
                               </div>
                           </div>

                           <button type="submit" disabled={isFetchingIntent} className="btn btn-primary checkout-btn flex-row">
                               {isFetchingIntent ? <Loader className="animate-spin" size={18} /> : <>Continue to Payment <ArrowRight size={18} /></>}
                           </button>
                       </form>
                   ) : (
                       <div className="checkout-form">
                           <div className="checkout-form-header">
                               <CreditCard size={20} />
                               <h2>Payment Setup</h2>
                           </div>
                           
                           <div className="payment-method-box">
                               <div className="payment-method-name">
                                   <div className="payment-method-icon">STRIPE</div>
                                   <span>Cards & UPI</span>
                               </div>
                               <div className="payment-method-radio-active"></div>
                           </div>

                           {clientSecret && (
                               <Elements options={{ clientSecret, appearance: { theme: 'stripe' } }} stripe={stripePromise}>
                                   <CheckoutForm 
                                       user={user}
                                       shippingData={shippingData} 
                                       onSuccess={handlePaymentSuccess} 
                                       onBack={() => setStep(1)} 
                                   />
                               </Elements>
                           )}
                       </div>
                   )}
                </div>

                {/* Sidebar Summary */}
                <div className="cart-sidebar">
                    <div className="cart-summary">
                        <h2 className="cart-summary-title">Order Summary</h2>
                        <div className="checkout-items-summary">
                             {cartItems.map(item => (
                                 <div key={item.product} className="checkout-item-row">
                                     <div className="checkout-item-name">
                                         <span className="checkout-item-qty">{item.qty}x</span>
                                         <span className="checkout-item-title-trunc">{item.name}</span>
                                     </div>
                                     <span className="cart-summary-val">₹{(item.price * item.qty).toFixed(2)}</span>
                                 </div>
                             ))}
                        </div>
                        <div className="cart-summary-rows">
                             <div className="cart-summary-row mt-border">
                                 <span className="cart-summary-label">Subtotal</span>
                                 <span className="cart-summary-val">₹{itemsPrice.toFixed(2)}</span>
                             </div>
                             <div className="cart-summary-row">
                                 <span className="cart-summary-label">Shipping</span>
                                 <span className="cart-summary-val">₹{shippingPrice.toFixed(2)}</span>
                             </div>
                             <div className="cart-summary-row">
                                 <span className="cart-summary-label">Tax</span>
                                 <span className="cart-summary-val">₹{taxPrice.toFixed(2)}</span>
                             </div>
                             <div className="cart-summary-row cart-summary-total">
                                 <span className="cart-summary-label-total">Total</span>
                                 <span className="cart-summary-val-total">₹{totalPrice.toFixed(2)}</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
