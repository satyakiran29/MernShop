import { useState, useEffect } from 'react';
import api from '../api/axios';
import Loader from '../components/Loader';
import { Package, ShoppingBag, Plus, Trash2, Edit2, CheckCircle, Clock, IndianRupee, Truck, TrendingUp } from 'lucide-react';

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
        <div className="container py-20 flex flex-col gap-12">
            <header className="flex flex-col gap-6">
                <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
                        <p className="text-muted text-sm">Manage your store products and customer orders.</p>
                    </div>
                </div>

                <div className="flex gap-8 border-b text-sm font-medium overflow-x-auto whitespace-nowrap">
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`pb-4 border-b-2 transition-all ${activeTab === 'overview' ? 'border-black text-black' : 'border-transparent text-muted hover:text-black'}`}
                    >
                        Overview Analytics
                    </button>
                    <button 
                        onClick={() => setActiveTab('products')}
                        className={`pb-4 border-b-2 transition-all ${activeTab === 'products' ? 'border-black text-black' : 'border-transparent text-muted hover:text-black'}`}
                    >
                        Products ({products.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('orders')}
                        className={`pb-4 border-b-2 transition-all ${activeTab === 'orders' ? 'border-black text-black' : 'border-transparent text-muted hover:text-black'}`}
                    >
                        Orders ({orders.length})
                    </button>
                </div>
            </header>

            <main>
                {activeTab === 'overview' && (
                    <div className="flex flex-col gap-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-surface p-6 rounded-lg border flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <span className="text-sm font-medium text-muted">Total Revenue</span>
                                    <div className="p-2 bg-success/10 rounded-md text-success"><IndianRupee size={18} /></div>
                                </div>
                                <h3 className="text-3xl font-bold tracking-tight shrink-0 overflow-hidden text-ellipsis">₹{totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                            </div>
                            
                            <div className="bg-surface p-6 rounded-lg border flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <span className="text-sm font-medium text-muted">Pending Shipments</span>
                                    <div className="p-2 bg-orange-500/10 rounded-md text-orange-600"><Truck size={18} /></div>
                                </div>
                                <h3 className="text-3xl font-bold tracking-tight">{pendingShipments}</h3>
                            </div>

                            <div className="bg-surface p-6 rounded-lg border flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <span className="text-sm font-medium text-muted">Lifetime Orders</span>
                                    <div className="p-2 bg-black/5 rounded-md"><ShoppingBag size={18} /></div>
                                </div>
                                <h3 className="text-3xl font-bold tracking-tight">{orders.length}</h3>
                            </div>

                            <div className="bg-surface p-6 rounded-lg border flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <span className="text-sm font-medium text-muted">Active Inventory</span>
                                    <div className="p-2 bg-black/5 rounded-md"><Package size={18} /></div>
                                </div>
                                <h3 className="text-3xl font-bold tracking-tight">{products.length}</h3>
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'products' && (
                    <div className="flex flex-col gap-8">
                        <div className="flex justify-between items-center bg-surface p-4 rounded-lg border">
                             <span className="text-sm font-medium">Product Catalog</span>
                             <button onClick={handleCreateProduct} className="btn btn-primary gap-2 text-xs py-2 px-4 uppercase font-bold tracking-widest">
                                 <Plus size={16} /> Add Product
                             </button>
                        </div>

                        <div className="overflow-x-auto border rounded-lg">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-surface text-[10px] uppercase tracking-widest font-bold border-b">
                                        <th className="p-4">ID</th>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Price</th>
                                        <th className="p-4">Stock</th>
                                        <th className="p-4">Category</th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product._id} className="border-b last:border-none hover:bg-surface/50 transition-colors">
                                            <td className="p-4 text-xs font-mono text-muted">{product._id.slice(-6)}</td>
                                            <td className="p-4 text-sm font-medium">{product.name}</td>
                                            <td className="p-4 text-sm">₹{product.price.toFixed(2)}</td>
                                            <td className="p-4 text-sm">{product.countInStock}</td>
                                            <td className="p-4 text-sm text-muted">{product.category}</td>
                                            <td className="p-4">
                                                <div className="flex gap-4">
                                                    <button onClick={() => handleEditClick(product)} className="text-muted hover:text-black"><Edit2 size={16} /></button>
                                                    <button onClick={() => handleDeleteProduct(product._id)} className="text-muted hover:text-error"><Trash2 size={16} /></button>
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
                    <div className="flex flex-col gap-8">
                        <div className="bg-surface p-4 rounded-lg border">
                             <span className="text-sm font-medium">Customer Orders</span>
                        </div>

                        <div className="overflow-x-auto border rounded-lg">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-surface text-[10px] uppercase tracking-widest font-bold border-b">
                                        <th className="p-4">ID</th>
                                        <th className="p-4">Customer</th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Total</th>
                                        <th className="p-4">Paid</th>
                                        <th className="p-4">Delivered</th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order._id} className="border-b last:border-none hover:bg-surface/50 transition-colors">
                                            <td className="p-4 text-xs font-mono text-muted">{order._id.slice(-6)}</td>
                                            <td className="p-4 text-sm font-medium">{order.user?.name || 'Guest'}</td>
                                            <td className="p-4 text-sm text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="p-4 text-sm font-bold">₹{order.totalPrice.toFixed(2)}</td>
                                            <td className="p-4">
                                                {order.isPaid ? <span className="text-success text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-success/10 rounded-sm">Paid</span> : <span className="text-error text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-error/10 rounded-sm">No</span>}
                                            </td>
                                            <td className="p-4">
                                                {order.isDelivered ? (
                                                    <span className="text-success text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-success/10 rounded-sm">Shipped</span>
                                                ) : order.isPaid ? (
                                                    <span className="text-orange-600 text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-orange-500/10 rounded-sm whitespace-nowrap">Pending Dispatch</span>
                                                ) : (
                                                    <span className="text-muted text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-surface rounded-sm">No</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {!order.isDelivered && order.isPaid && (
                                                    <button onClick={() => handleDeliverOrder(order._id)} className="text-xs font-bold uppercase tracking-widest hover:underline">Mark Delivered</button>
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
                            <div className="form-group-minimal">
                                <label>Name</label>
                                <input type="text" required value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group-minimal">
                                    <label>Price (₹)</label>
                                    <input type="number" step="0.01" required value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} />
                                </div>
                                <div className="form-group-minimal">
                                    <label>Stock Quantity</label>
                                    <input type="number" required value={editingProduct.countInStock} onChange={e => setEditingProduct({...editingProduct, countInStock: parseInt(e.target.value, 10)})} />
                                </div>
                            </div>
                            <div className="form-group-minimal">
                                <label>Image URL</label>
                                <input type="text" required value={editingProduct.image} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group-minimal">
                                    <label>Brand</label>
                                    <input type="text" required value={editingProduct.brand} onChange={e => setEditingProduct({...editingProduct, brand: e.target.value})} />
                                </div>
                                <div className="form-group-minimal">
                                    <label>Category</label>
                                    <input type="text" required value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} />
                                </div>
                            </div>
                            <div className="form-group-minimal">
                                <label>Description</label>
                                <textarea required rows={4} value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline" style={{ padding: '0.6rem 1.25rem' }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
