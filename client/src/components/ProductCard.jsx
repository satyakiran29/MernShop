import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product, 1);
    };

    return (
        <div className="product-card">
            <Link to={`/products/${product._id}`} className="product-image-container">
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="product-image"
                />
                <button 
                  onClick={handleAddToCart}
                  className="product-cart-btn"
                >
                    <ShoppingCart size={18} />
                </button>
            </Link>
            <div className="product-info">
                <div className="product-header">
                    <Link to={`/products/${product._id}`} className="product-name">
                        {product.name}
                    </Link>
                    <span className="product-price">₹{product.price.toFixed(2)}</span>
                </div>
                <p className="product-brand">{product.brand}</p>
            </div>
        </div>
    );
};

export default ProductCard;
