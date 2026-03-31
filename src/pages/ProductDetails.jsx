import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { MessageCircle, ShieldCheck, Truck } from 'lucide-react';
import AccordionItem from '../components/UI/Accordion';
import ProductCard from '../components/UI/ProductCard';
import { useCart } from '../context/CartContext';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const product = products.find(p => p.id === parseInt(id));

    if (!product) return <div className="container" style={{ padding: '5rem' }}>Product not found</div>;

    // Filter related products (same category, exclude current)
    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 3);

    const handleWhatsAppClick = () => {
        const phoneNumber = "584125594826";
        const message = `Hello, I'm interested in the *${product.name}* priced at $${product.price}. Is it available?`;
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="product-details-page container">
            <div className="product-details-grid">
                <div className="product-gallery">
                    <img src={product.image} alt={product.name} />
                </div>

                <div className="product-info-column">
                    <p className="pd-category">{product.category}</p>
                    <h1 className="pd-title">{product.name}</h1>
                    <p className="pd-price">${product.price.toFixed(2)}</p>

                    <p className="pd-description">{product.description}</p>

                    <div className="pd-actions">
                        <button className="btn-add-bag" onClick={() => addToCart(product)}>Add to Bag</button>
                        <button className="btn-whatsapp" onClick={handleWhatsAppClick}>
                            <MessageCircle size={20} />
                            Buy / Inquire
                        </button>
                    </div>

                    <div className="pd-accordions">
                        <AccordionItem title="Materials">
                            <p>Crafted with 18k Gold Vermeil and ethically sourced gemstones. Our materials are hypoallergenic and designed to last.</p>
                        </AccordionItem>
                        <AccordionItem title="Care Instructions">
                            <p>Keep your jewelry dry and store it in the provided pouch when not in use. Avoid contact with perfumes and lotions.</p>
                        </AccordionItem>
                        <AccordionItem title="Shipping & Returns">
                            <p>Free shipping on orders over $100. Returns accepted within 30 days of purchase.</p>
                        </AccordionItem>
                    </div>

                    <div className="pd-features">
                        <div className="feature-item">
                            <Truck size={20} />
                            <span>Free shipping on orders over $100</span>
                        </div>
                        <div className="feature-item">
                            <ShieldCheck size={20} />
                            <span>1 year warranty included</span>
                        </div>
                    </div>
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <section className="related-products">
                    <h3>You May Also Like</h3>
                    <div className="product-grid">
                        {relatedProducts.map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default ProductDetails;
