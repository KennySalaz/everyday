import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <motion.div
            className="product-card"
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 250, damping: 20 }}
        >
            {/* Image */}
            <div className="product-image-container">
                <Link to={`/product/${product.id}`}>
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                        loading="lazy"
                    />
                </Link>
                {/* Hover overlay with quick-add */}
                <div className="product-overlay">
                    <button
                        className="add-to-cart-btn"
                        aria-label="Add to bag"
                        onClick={(e) => { e.preventDefault(); addToCart(product); }}
                    >
                        <ShoppingBag size={18} />
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="product-info">
                <p className="product-category">{product.category}</p>
                <Link to={`/product/${product.id}`}>
                    <h3 className="product-name">{product.name}</h3>
                </Link>
                <p className="product-price">${product.price.toFixed(2)}</p>
            </div>
        </motion.div>
    );
};

export default ProductCard;
