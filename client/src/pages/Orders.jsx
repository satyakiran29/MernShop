import { useState, useEffect } from 'react';
import api from '../api/axios';
import Loader from '../components/Loader';
import { Package, Clock, CheckCircle, Truck, TrendingUp } from 'lucide-react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/myorders');
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="orders-page">
            <header className="orders-header">
                <h1 className="orders-title">My Orders</h1>
                <p className="orders-subtitle">{orders.length} orders placed with Mernshop.</p>
            </header>

            {orders.length === 0 ? (
                <div className="orders-empty">
                    <Package size={48} className="text-muted" />
                    <h2>No orders yet</h2>
                    <p>You haven't placed any orders yet. Once you do, they will appear here.</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order._id} className="order-card">
                            {/* Order Info */}
                            <div className="order-info-panel">
                                <div className="order-info-item">
                                    <span className="order-info-label">Order ID</span>
                                    <span className="order-info-val font-mono">{order._id}</span>
                                </div>
                                <div className="order-info-item">
                                    <span className="order-info-label">Placed on</span>
                                    <span className="order-info-val-large">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="order-info-item">
                                    <span className="order-info-label">Total Paid</span>
                                    <span className="order-info-val-large font-bold">₹{order.totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="order-status-badges">
                                     <div className={`status-badge ${order.isPaid ? 'status-success' : 'status-error'}`}>
                                         {order.isPaid ? <CheckCircle size={14} /> : <Clock size={14} />}
                                         {order.isPaid ? 'Paid' : 'Unpaid'}
                                     </div>
                                     <div className={`status-badge ${order.isDelivered ? 'status-success' : 'status-muted'}`}>
                                         {order.isDelivered ? <Truck size={14} /> : <Clock size={14} />}
                                         {order.isDelivered ? 'Delivered' : 'Processing'}
                                     </div>
                                </div>
                            </div>
                            
                            {/* Order Items */}
                            <div className="order-items-panel">
                                <h3 className="order-items-panel-title">Order Items</h3>
                                <div className="order-items-list">
                                    {order.orderItems.map(item => (
                                        <div key={item.product} className="order-item-row">
                                            <div className="order-item-left">
                                                <div className="order-item-img-container">
                                                    <img src={item.image} alt={item.name} />
                                                </div>
                                                <div className="order-item-text">
                                                    <span className="order-item-name">{item.name}</span>
                                                    <span className="order-item-qty">Qty: {item.qty} × ₹{item.price.toFixed(2)}</span>
                                                </div>
                                            </div>
                                            <span className="order-item-total">₹{(item.qty * item.price).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
