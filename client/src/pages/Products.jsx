import { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setProducts(data);
                const uniqueCategories = ['All', ...new Set(data.map(p => p.category))];
                setCategories(uniqueCategories);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = category === 'All' || product.category === category;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="products-page">
            <header className="products-header">
                <h1 className="products-title">Shop All</h1>
                
                <div className="products-toolbar">
                   <div className="search-wrapper">
                        <Search className="search-icon" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search products..." 
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                   </div>

                   <div className="filter-controls">
                        <div className="select-wrapper">
                            <select 
                                className="select-input"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {categories.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <ChevronDown className="select-icon" size={16} />
                        </div>
                   </div>
                </div>
            </header>

            {loading ? (
                <Loader />
            ) : (
               <main style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
                   <div style={{fontSize: '0.875rem', color: 'var(--muted)'}}>
                        <span>Showing {filteredProducts.length} products</span>
                   </div>

                   {filteredProducts.length > 0 ? (
                       <div className="product-grid">
                            {filteredProducts.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                       </div>
                   ) : (
                       <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 0', gap: '1rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)'}}>
                           <h2 style={{fontSize: '1.25rem', fontWeight: 500}}>No products found</h2>
                           <p style={{color: 'var(--muted)', fontSize: '0.875rem'}}>Try adjusting your search or filters to find what you're looking for.</p>
                           <button onClick={() => {setSearchTerm(''); setCategory('All');}} className="btn btn-primary" style={{marginTop: '1rem'}}>Reset Filters</button>
                       </div>
                   )}
               </main>
            )}
        </div>
    );
};

export default Products;
