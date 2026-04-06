import { useState, useEffect } from 'react';
import { Package, ShoppingBag, Plus, Trash2, Edit2, IndianRupee, Truck } from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';

const Admin = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editingProduct, setEditingProduct] = useState({
        name: '', price: 0, image: '', brand: '', category: '', countInStock: 0, description: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, orderRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/orders')
                ]);
                setProducts(prodRes.data);
                setOrders(orderRes.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCreateProduct = async () => {
        try {
            const { data } = await api.post('/products', {});
            setProducts([data, ...products]);
            handleEditClick(data);
        } catch (error) {
            alert('Error creating product');
        }
    };

    const handleEditClick = (product) => {
        setEditId(product._id);
        setEditingProduct({
            name: product.name || '',
            price: product.price || 0,
            image: product.image || '',
            brand: product.brand || '',
            category: product.category || '',
            countInStock: product.countInStock || 0,
            description: product.description || ''
        });
        setIsModalOpen(true);
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.put(`/products/${editId}`, editingProduct);
            setProducts(products.map(p => p._id === data._id ? data : p));
            setIsModalOpen(false);
            setEditId(null);
        } catch (error) {
            alert('Error updating product');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                setProducts(products.filter(p => p._id !== id));
            } catch (error) {
                alert('Error deleting product');
            }
        }
    };

    const handleDeliverOrder = async (id) => {
        try {
            await api.put(`/orders/${id}/deliver`);
            setOrders(orders.map(o => o._id === id ? { ...o, isDelivered: true, deliveredAt: new Date() } : o));
        } catch (error) {
            alert('Error updating order');
        }
    };

    if (loading) return <Loader />;

    const totalIncome = orders.filter(o => o.isPaid).reduce((acc, current) => acc + current.totalPrice, 0);
    const pendingShipments = orders.filter(o => o.isPaid && !o.isDelivered).length;

    return (
        <div className="container" style={{ padding: '5rem 2rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <header style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.025em' }}>Admin Dashboard</h1>
                    <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Manage your store products and customer orders.</p>
                </div>

                <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border)', fontSize: '0.875rem', fontWeight: 500 }}>
                    <button 
                        onClick={() => setActiveTab('overview')}
                        style={{ paddingBottom: '1rem', borderBottom: activeTab === 'overview' ? '2px solid var(--fg)' : '2px solid transparent', color: activeTab === 'overview' ? 'var(--fg)' : 'var(--muted)' }}
                    >
                        Overview Analytics
                    </button>
                    <button 
                        onClick={() => setActiveTab('products')}
                        style={{ paddingBottom: '1rem', borderBottom: activeTab === 'products' ? '2px solid var(--fg)' : '2px solid transparent', color: activeTab === 'products' ? 'var(--fg)' : 'var(--muted)' }}
                    >
                        Products ({products.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('orders')}
                        style={{ paddingBottom: '1rem', borderBottom: activeTab === 'orders' ? '2px solid var(--fg)' : '2px solid transparent', color: activeTab === 'orders' ? 'var(--fg)' : 'var(--muted)' }}
                    >
                        Orders ({orders.length})
                    </button>
                </div>
            </header>

            <main>
                {activeTab === 'overview' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                            <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--muted)', fontWeight: 500 }}>Total Revenue</span>
                                    <div style={{ color: 'var(--success)' }}><IndianRupee size={20} /></div>
                                </div>
                                <h3 style={{ fontSize: '2rem', fontWeight: 700 }}>₹{totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
                            </div>
                            
                            <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--muted)', fontWeight: 500 }}>Pending Shipments</span>
                                    <div style={{ color: '#d97706' }}><Truck size={20} /></div>
                                </div>
                                <h3 style={{ fontSize: '2rem', fontWeight: 700 }}>{pendingShipments}</h3>
                            </div>

                            <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--muted)', fontWeight: 500 }}>Lifetime Orders</span>
                                    <div style={{ color: 'var(--fg)' }}><ShoppingBag size={20} /></div>
                                </div>
                                <h3 style={{ fontSize: '2rem', fontWeight: 700 }}>{orders.length}</h3>
                            </div>

                            <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--muted)', fontWeight: 500 }}>Active Inventory</span>
                                    <div style={{ color: 'var(--fg)' }}><Package size={20} /></div>
                                </div>
                                <h3 style={{ fontSize: '2rem', fontWeight: 700 }}>{products.length}</h3>
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'products' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                             <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Product Catalog</span>
                             <button onClick={handleCreateProduct} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                 <Plus size={16} /> Add Product
                             </button>
                        </div>

                        <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '8px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: 'var(--surface)', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>
                                        <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>ID</th>
                                        <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Name</th>
                                        <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Price</th>
                                        <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Stock</th>
                                        <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Category</th>
                                        <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product._id}>
                                            <td style={{ padding: '1rem', fontSize: '0.75rem', color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>{product._id.slice(-6)}</td>
                                            <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 500, borderBottom: '1px solid var(--border)' }}>{product.name}</td>
                                            <td style={{ padding: '1rem', fontSize: '0.875rem', borderBottom: '1px solid var(--border)' }}>₹{product.price.toFixed(2)}</td>
                                            <td style={{ padding: '1rem', fontSize: '0.875rem', borderBottom: '1px solid var(--border)' }}>{product.countInStock}</td>
                                            <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>{product.category}</td>
                                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                                                <div style={{ display: 'flex', gap: '1rem' }}>
                                                    <button onClick={() => handleEditClick(product)} style={{ color: 'var(--muted)' }}><Edit2 size={16} /></button>
                                                    <button onClick={() => handleDeleteProduct(product._id)} style={{ color: 'var(--error)' }}><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                
                {activeTab === 'orders' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ background: 'var(--surface)', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                             <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Customer Orders</span>
                        </div>

                        <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '8px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: 'var(--surface)', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>
                                        <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>ID</th>
                                        <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Customer</th>
                                        <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Date</th>
                                        <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Total</th>
                                        <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Paid</th>
                                        <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Delivered</th>
                                        <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order._id}>
                                            <td style={{ padding: '1rem', fontSize: '0.75rem', color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>{order._id.slice(-6)}</td>
                                            <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 500, borderBottom: '1px solid var(--border)' }}>{order.user?.name || 'Guest'}</td>
                                            <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 700, borderBottom: '1px solid var(--border)' }}>₹{order.totalPrice.toFixed(2)}</td>
                                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                                                {order.isPaid ? 
                                                    <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>Paid</span> : 
                                                    <span className="badge" style={{ background: 'rgba(225, 29, 72, 0.1)', color: 'var(--error)' }}>No</span>}
                                            </td>
                                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                                                {order.isDelivered ? (
                                                    <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>Shipped</span>
                                                ) : order.isPaid ? (
                                                    <span className="badge" style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#d97706' }}>Pending Dispatch</span>
                                                ) : (
                                                    <span className="badge" style={{ background: 'var(--surface)', color: 'var(--muted)' }}>No</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                                                {!order.isDelivered && order.isPaid && (
                                                    <button onClick={() => handleDeliverOrder(order._id)} style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', textDecoration: 'underline' }}>Mark Delivered</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
            
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{editId ? 'Edit Product' : 'Add Product'}</h2>
                        </div>
                        <form onSubmit={handleUpdateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Name</label>
                                <input type="text" required value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Price (₹)</label>
                                    <input type="number" step="0.01" required value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Stock Quantity</label>
                                    <input type="number" required value={editingProduct.countInStock} onChange={e => setEditingProduct({...editingProduct, countInStock: parseInt(e.target.value, 10)})} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Image URL</label>
                                <input type="text" required value={editingProduct.image} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Brand</label>
                                    <input type="text" required value={editingProduct.brand} onChange={e => setEditingProduct({...editingProduct, brand: e.target.value})} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Category</label>
                                    <input type="text" required value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Description</label>
                                <textarea required rows={4} style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '4px', fontFamily: 'inherit' }} value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
