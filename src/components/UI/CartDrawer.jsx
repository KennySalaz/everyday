import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './CartDrawer.css';

const CartDrawer = () => {
    const { cart, isDrawerOpen, toggleDrawer, removeFromCart, updateQuantity, cartTotal } = useCart();

    const handleCheckout = () => {
        const phoneNumber = "58000000000"; // Replace with real number
        let message = "Hello! I'd like to place an order for the following items:\n\n";

        cart.forEach(item => {
            message += `- ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}\n`;
        });

        message += `\n*Total: $${cartTotal.toFixed(2)}*`;

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <AnimatePresence>
            {isDrawerOpen && (
                <>
                    <motion.div
                        className="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleDrawer}
                    />
                    <motion.div
                        className="cart-drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                    >
                        <div className="cart-header">
                            <h2>Your Bag ({cart.length})</h2>
                            <button onClick={toggleDrawer} className="close-btn"><X size={24} /></button>
                        </div>

                        <div className="cart-items">
                            {cart.length === 0 ? (
                                <div className="empty-cart">
                                    <p>Your bag is empty.</p>
                                    <button onClick={toggleDrawer} className="btn-secondary">Start Shopping</button>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="cart-item">
                                        <img src={item.image} alt={item.name} />
                                        <div className="item-details">
                                            <h4>{item.name}</h4>
                                            <p>${item.price.toFixed(2)}</p>
                                            <div className="item-controls">
                                                <div className="quantity-controls">
                                                    <button onClick={() => updateQuantity(item.id, -1)}><Minus size={16} /></button>
                                                    <span>{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)}><Plus size={16} /></button>
                                                </div>
                                                <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="cart-footer">
                                <div className="total-row">
                                    <span>Total:</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <button onClick={handleCheckout} className="btn-checkout">
                                    <MessageCircle size={20} />
                                    Checkout via WhatsApp
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
