import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
    Hammer,
    Plus,
    Trash2,
    Package,
    Gem,
    Scissors,
    Box,
    Minus,
    Search,
    Pencil,
    Tag,
    DollarSign,
    AlertTriangle,
    ShoppingCart,
    TrendingUp,
    Image as ImageIcon,
    UploadCloud,
    X,
    Eye
} from 'lucide-react';
import { uploadToBunny } from '../utils/bunny';
import InventoryModal from './Dashboard/InventoryModal';
import InventoryEditModal from './Dashboard/InventoryEditModal';
import InventoryDetailModal from './Dashboard/InventoryDetailModal';
import './Pricing.css';

const CATEGORIES = [
    { value: 'pulseras', label: 'Pulseras' },
    { value: 'collares', label: 'Collares' },
    { value: 'anillos', label: 'Anillos' },
    { value: 'aretes', label: 'Aretes' },
    { value: 'sets', label: 'Sets / Combos' },
    { value: 'otros', label: 'Otros' },
];

export const ICONS = {
    Gem: <Gem size={24} />,
    Package: <Package size={24} />,
    Box: <Box size={24} />,
    Scissors: <Scissors size={24} />
};

// Formatea el costo unitario: quita ceros al final pero mantiene mínimo 2 decimales
// Ej: 0.230 → $0.23 | 0.156 → $0.156 | 2.390 → $2.39
const formatUnitCost = (value) => {
    const fixed3 = value.toFixed(3);
    const trimmed = parseFloat(fixed3).toString();
    // Asegurar mínimo 2 decimales
    const parts = trimmed.split('.');
    if (!parts[1] || parts[1].length < 2) {
        return parseFloat(fixed3).toFixed(2);
    }
    return trimmed;
};

export default function PricingDashboard({ initialTab }) {
    // If no initialTab provided, default to inventory (or could be an Overview tab)
    const activeTab = initialTab || 'inventory';
    const navigate = useNavigate();

    // Get Global State from DashboardLayout Context
    const {
        inventory,
        builtProducts,
        selectedItems,
        profitMargin,
        transactions,
        setProfitMargin,
        setSelectedItems,
        saveBuiltProduct,
        saveTransaction,
        addInventoryItem,
        deleteInventoryItem,
        deleteBuiltProduct,
        updateBuiltProduct,
        updateInventoryItem,
        totalCost,
        suggestedPrice,
        isLoading
    } = useOutletContext();

    // Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingInventoryItem, setEditingInventoryItem] = useState(null);
    const [detailInventoryItem, setDetailInventoryItem] = useState(null);

    // Builder State
    const [productName, setProductName] = useState('');
    const [productImage, setProductImage] = useState(null);
    const [productImagePreview, setProductImagePreview] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [productionQty, setProductionQty] = useState(1);
    const [productCategory, setProductCategory] = useState('pulseras');
    const [currentStep, setCurrentStep] = useState(1);
    const [direction, setDirection] = useState(1);

    // Edit mode
    const [editingProductId, setEditingProductId] = useState(null);

    // Filter States
    const [overviewSearch, setOverviewSearch] = useState('');
    const [overviewStockFilter, setOverviewStockFilter] = useState('all'); // all, available, out
    const [overviewCategoryFilter, setOverviewCategoryFilter] = useState('all');
    const [inventorySearch, setInventorySearch] = useState('');
    const [inventoryTypeFilter, setInventoryTypeFilter] = useState('all'); // all, materia, empaque

    // Add to Inventory from Modal
    const handleAddInventory = async (newItem) => {
        await addInventoryItem(newItem);
        Toast.fire({ icon: 'success', title: 'Insumo agregado al inventario' });
    };

    // Builder Logic
    const toggleItemInBuilder = (invItem) => {
        const existing = selectedItems.find(item => item.inventoryId === invItem.id);
        if (existing) {
            setSelectedItems(selectedItems.filter(item => item.inventoryId !== invItem.id));
        } else {
            setSelectedItems([...selectedItems, { inventoryId: invItem.id, qty: 1, itemRef: invItem }]);
        }
    };

    const updateBuilderQty = (invId, delta) => {
        setSelectedItems(selectedItems.map(item => {
            if (item.inventoryId === invId) {
                const newQty = Math.max(1, item.qty + delta);
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    // Render Components
    const renderInventoryTab = () => {
        const filtered = inventory.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(inventorySearch.toLowerCase());
            const matchesType = inventoryTypeFilter === 'all' || item.type === inventoryTypeFilter;
            return matchesSearch && matchesType;
        });

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inventory-tab"
            >
                <div className="header-bar mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', color: 'var(--color-primary)', margin: '0 0 0.5rem 0' }}>Inventario</h1>
                        <p style={{ color: 'var(--color-text-light)', margin: 0 }}>Registra los materiales, cuentas y empaques para tu bisutería.</p>
                    </div>
                    <button
                        className="btn-primary"
                        onClick={() => setIsAddModalOpen(true)}
                        style={{ width: 'auto' }}
                    >
                        <Plus size={20} /> Añadir Insumo
                    </button>
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Stock Disponible</h3>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                        <input
                            type="text"
                            className="styled-input"
                            placeholder="Buscar insumo..."
                            value={inventorySearch}
                            onChange={e => setInventorySearch(e.target.value)}
                            style={{ paddingLeft: '2.75rem', padding: '0.75rem 1rem 0.75rem 2.75rem' }}
                        />
                    </div>
                    <select
                        className="styled-select"
                        value={inventoryTypeFilter}
                        onChange={e => setInventoryTypeFilter(e.target.value)}
                        style={{ width: 'auto', padding: '0.75rem 1.25rem', minWidth: '160px' }}
                    >
                        <option value="all">Todos los Tipos</option>
                        <option value="materia">Materia Prima</option>
                        <option value="empaque">Empaque / POP</option>
                    </select>
                </div>

                <div className="inventory-grid">
                    <AnimatePresence>
                        {filtered.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="inventory-item spotify-card"
                            >
                                {/* Background Blur Layer */}
                                {item.imageUrl && (
                                    <div
                                        className="spotify-bg"
                                        style={{ backgroundImage: `url(${item.imageUrl})` }}
                                    />
                                )}
                                <div className="spotify-overlay" />

                                <div className="spotify-content modern-variant">
                                    <div className="card-top-actions">
                                        <span className="card-badge">{item.type === 'materia' ? 'Materia' : 'Empaque'}</span>
                                        <div className="action-buttons">
                                            <button className="glass-icon-btn" onClick={() => setDetailInventoryItem(item)} title="Ver detalle">
                                                <Eye size={14} />
                                            </button>
                                            <button className="glass-icon-btn edit" onClick={() => handleEditPrice(item)} title="Editar">
                                                <Pencil size={14} />
                                            </button>
                                            <button className="glass-icon-btn delete" onClick={() => deleteInventoryItem(item.id)} title="Eliminar">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="card-center-image">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.name} />
                                        ) : (
                                            <div className="fallback-icon-large">{ICONS[item.icon]}</div>
                                        )}
                                    </div>

                                    <div className="card-bottom-info">
                                        <h4 className="item-title">{item.name}</h4>
                                        <p className="item-subtitle">{item.priceHistory?.length > 0 ? 'Precio verificado' : 'Sin actualizacion'}</p>

                                        <div className="stats-pill">
                                            <div className="stat-segment">
                                                <span className="stat-label">Costo c/u</span>
                                                <span className="stat-val highlight">${formatUnitCost(item.unitCost)}</span>
                                            </div>
                                            <div className="stat-divider" />
                                            <div className="stat-segment">
                                                <span className="stat-label">Paquete (x{item.totalQty})</span>
                                                <span className="stat-val">${item.totalPrice.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filtered.length === 0 && inventory.length > 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-light)' }}>
                        <Search size={32} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                        <p>No se encontraron insumos con ese filtro.</p>
                    </div>
                )}

                <InventoryModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAddInventory}
                />

                <InventoryEditModal
                    isOpen={!!editingInventoryItem}
                    onClose={() => setEditingInventoryItem(null)}
                    onSave={handleSaveInventoryEdit}
                    item={editingInventoryItem}
                />

                <InventoryDetailModal
                    isOpen={!!detailInventoryItem}
                    onClose={() => setDetailInventoryItem(null)}
                    item={detailInventoryItem}
                    onEdit={(item) => setEditingInventoryItem(item)}
                />
            </motion.div>
        );
    };

    const handleSaveQuote = async () => {
        if (!productName || selectedItems.length === 0) return;

        let finalImageUrl = productImagePreview; // Keep existing if editing but not changing picture

        if (productImage) {
            setIsUploading(true);
            try {
                // Upload to Bunny.net
                finalImageUrl = await uploadToBunny(productImage);
            } catch (error) {
                Swal.fire('Error', 'No se pudo subir la imagen. ' + error.message, 'error');
                setIsUploading(false);
                return;
            }
            setIsUploading(false);
        }

        const newProduct = {
            id: editingProductId || Date.now().toString(),
            name: productName,
            imageUrl: finalImageUrl,
            items: selectedItems,
            totalCost,
            profitMargin,
            suggestedPrice,
            stock: productionQty,
            category: productCategory,
            date: new Date().toLocaleDateString()
        };

        if (editingProductId) {
            await updateBuiltProduct(newProduct);
        } else {
            await saveBuiltProduct(newProduct);
        }

        // Form Reset
        setProductName('');
        setProductImage(null);
        setProductImagePreview('');
        setProductionQty(1);
        setProductCategory('pulseras');
        setEditingProductId(null);
        setSelectedItems([]);
        setProfitMargin(30);
        setCurrentStep(1);

        // Navigate
        navigate('/ed-admin-2026');
        Toast.fire({ icon: 'success', title: 'Cotización guardada exitosamente.' });
    };

    const handleEditPrice = (item) => {
        setEditingInventoryItem(item);
    };

    const handleSaveInventoryEdit = async (updatedItem) => {
        await updateInventoryItem(updatedItem);
        Toast.fire({ icon: 'success', title: 'Insumo actualizado.' });
    };

    const handleDeleteProduct = async (product) => {
        const result = await Swal.fire({
            title: '¿Eliminar cotización?',
            text: `Se eliminará "${product.name}" permanentemente.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b'
        });
        if (result.isConfirmed) {
            deleteBuiltProduct(product.id);
            Toast.fire({ icon: 'success', title: 'Cotización eliminada.' });
        }
    };

    const handleEditProduct = (product) => {
        setEditingProductId(product.id);
        setProductName(product.name);
        setProductImagePreview(product.imageUrl || '');
        setProductImage(null);
        setProductionQty(product.stock);
        setProductCategory(product.category || 'otros');
        setSelectedItems(product.items);
        setProfitMargin(product.profitMargin);
        setCurrentStep(1);
        navigate('/ed-admin-2026/builder');
    };

    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });

    const handleRegisterSale = async (product) => {
        const { value: qtyToSellStr } = await Swal.fire({
            title: 'Registrar Venta',
            input: 'number',
            inputLabel: `¿Cuántas unidades de "${product.name}" deseas vender? (Stock actual: ${product.stock})`,
            inputValue: 1,
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: 'var(--color-primary)',
            cancelButtonColor: '#f87171',
            inputAttributes: {
                min: 1,
                max: product.stock,
                step: 1
            },
            inputValidator: (value) => {
                if (!value || isNaN(parseInt(value)) || parseInt(value) <= 0) {
                    return 'Debes ingresar una cantidad válida mayor a 0.';
                }
                if (parseInt(value) > product.stock) {
                    return `Solo tienes ${product.stock} unidades en stock.`;
                }
            }
        });

        if (!qtyToSellStr) return; // User cancelled

        const qtyToSell = parseInt(qtyToSellStr);

        // 1. Record the transaction
        const newTransaction = {
            id: Date.now().toString(),
            productId: product.id,
            productName: product.name,
            qty: qtyToSell,
            investment: product.totalCost * qtyToSell,
            revenue: product.suggestedPrice * qtyToSell,
            profit: (product.suggestedPrice - product.totalCost) * qtyToSell,
            date: new Date().toLocaleDateString()
        };

        await saveTransaction(newTransaction);

        // 2. Deduct from stock
        await updateBuiltProduct({ ...product, stock: product.stock - qtyToSell });

        Toast.fire({
            icon: 'success',
            title: `Se registraron ${qtyToSell} unidades vendidas.`
        });
    };

    const renderOverviewTab = () => {
        // Compute accumulated profit per product
        const getProductSales = (productId) => {
            const productTxns = transactions.filter(t => t.productId === productId);
            const totalSold = productTxns.reduce((sum, t) => sum + t.qty, 0);
            const totalProfit = productTxns.reduce((sum, t) => sum + t.profit, 0);
            return { totalSold, totalProfit };
        };

        // Mini KPIs
        const todayStr = new Date().toLocaleDateString();
        const todayRevenue = transactions.filter(t => t.date === todayStr).reduce((s, t) => s + t.revenue, 0);
        const lowStockProducts = builtProducts.filter(p => p.stock > 0 && p.stock <= 3);
        const lastSale = transactions.length > 0 ? transactions[transactions.length - 1] : null;

        // Filtered products
        const filteredProducts = builtProducts.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(overviewSearch.toLowerCase());
            const matchesStock = overviewStockFilter === 'all' || (overviewStockFilter === 'available' ? p.stock > 0 : p.stock === 0);
            const matchesCategory = overviewCategoryFilter === 'all' || p.category === overviewCategoryFilter;
            return matchesSearch && matchesStock && matchesCategory;
        });

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="overview-tab"
            >
                <div className="header-bar mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', color: 'var(--color-primary)', margin: '0 0 0.5rem 0' }}>Resumen General</h1>
                        <p style={{ color: 'var(--color-text-light)', margin: 0 }}>Gestiona y revisa todos los productos que has armado.</p>
                    </div>
                    <button className="btn-primary" style={{ width: 'auto' }} onClick={() => navigate('/ed-admin-2026/builder')}>
                        <Plus size={18} /> Nuevo Producto
                    </button>
                </div>

                {/* Mini KPIs Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    <div className="admin-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(5,205,153,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#05cd99' }}>
                            <DollarSign size={20} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ingreso Hoy</div>
                            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-primary)' }}>${todayRevenue.toFixed(2)}</div>
                        </div>
                    </div>
                    <div className="admin-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: lowStockProducts.length > 0 ? 'rgba(248,113,113,0.1)' : 'rgba(67,24,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: lowStockProducts.length > 0 ? '#f87171' : 'var(--color-primary)' }}>
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Stock Bajo</div>
                            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: lowStockProducts.length > 0 ? '#f87171' : 'var(--color-primary)' }}>{lowStockProducts.length} productos</div>
                        </div>
                    </div>
                    <div className="admin-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)' }}>
                            <ShoppingCart size={20} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Última Venta</div>
                            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>{lastSale ? `${lastSale.productName} (x${lastSale.qty})` : 'Sin ventas'}</div>
                        </div>
                    </div>
                </div>

                {/* Filters Row */}
                {builtProducts.length > 0 && (
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
                            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                            <input
                                type="text"
                                className="styled-input"
                                placeholder="Buscar producto..."
                                value={overviewSearch}
                                onChange={e => setOverviewSearch(e.target.value)}
                                style={{ paddingLeft: '2.75rem', padding: '0.75rem 1rem 0.75rem 2.75rem' }}
                            />
                        </div>
                        <select className="styled-select" value={overviewStockFilter} onChange={e => setOverviewStockFilter(e.target.value)} style={{ width: 'auto', padding: '0.75rem 1.25rem', minWidth: '150px' }}>
                            <option value="all">Todo Stock</option>
                            <option value="available">Disponible</option>
                            <option value="out">Agotado</option>
                        </select>
                        <select className="styled-select" value={overviewCategoryFilter} onChange={e => setOverviewCategoryFilter(e.target.value)} style={{ width: 'auto', padding: '0.75rem 1.25rem', minWidth: '150px' }}>
                            <option value="all">Todas las Categorías</option>
                            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                    </div>
                )}

                {builtProducts.length === 0 ? (
                    <div className="admin-card text-center" style={{ padding: '4rem 2rem' }}>
                        <Hammer size={48} color="var(--color-accent)" style={{ margin: '0 auto 1.5rem auto', opacity: 0.8 }} />
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>No tienes productos todavía</h2>
                        <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem' }}>Ve a la pestaña "Armador" para crear tu primera cotización.</p>
                        <button className="btn-primary" style={{ width: 'auto', margin: '0 auto' }} onClick={() => navigate('/ed-admin-2026/builder')}>
                            Crear Nuevo Producto
                        </button>
                    </div>
                ) : (
                    <div className="inventory-grid">
                        <AnimatePresence>
                            {filteredProducts.map((product) => {
                                const sales = getProductSales(product.id);
                                const isLowStock = product.stock > 0 && product.stock <= 3;
                                return (
                                    <motion.div
                                        key={product.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="admin-card"
                                        style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative', border: isLowStock ? '2px solid #f87171' : undefined }}
                                    >
                                        {/* Edit / Delete buttons */}
                                        <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
                                            <button onClick={() => handleEditProduct(product)} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: 'var(--color-text)', padding: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} title="Editar"><Pencil size={14} /></button>
                                            <button onClick={() => handleDeleteProduct(product)} style={{ background: 'white', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', color: '#ef4444', padding: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} title="Eliminar"><Trash2 size={14} /></button>
                                        </div>

                                        {isLowStock && (
                                            <span style={{ position: 'absolute', top: '-10px', left: '1rem', background: '#f87171', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '2px 10px', borderRadius: '99px', zIndex: 10 }}>Stock Bajo</span>
                                        )}

                                        {/* Image Display */}
                                        <div style={{ width: '100%', height: '160px', borderRadius: '12px', background: 'var(--color-background-off)', marginBottom: '0.5rem', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {product.imageUrl ? (
                                                <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <ImageIcon size={40} color="var(--color-text-light)" style={{ opacity: 0.3 }} />
                                            )}
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <h4 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', margin: 0 }}>{product.name}</h4>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                            {product.category && (
                                                <span style={{ background: 'rgba(67,24,255,0.08)', color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: '99px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                    <Tag size={12} /> {CATEGORIES.find(c => c.value === product.category)?.label || product.category}
                                                </span>
                                            )}
                                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>{product.items.length} insumos • {product.date}</span>
                                        </div>

                                        {/* Accumulated profit */}
                                        {sales.totalSold > 0 && (
                                            <div style={{ background: 'rgba(5,205,153,0.06)', borderRadius: '10px', padding: '0.6rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>Vendidos: {sales.totalSold} uds</span>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#05cd99' }}>+${sales.totalProfit.toFixed(2)}</span>
                                            </div>
                                        )}

                                        <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            <div>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', display: 'block' }}>Costo ud: ${product.totalCost.toFixed(2)}</span>
                                                <span style={{ fontSize: '0.8rem', color: '#05cd99', fontWeight: 600, display: 'block' }}>Margen: +{product.profitMargin}%</span>
                                            </div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                                                ${product.suggestedPrice.toFixed(2)}
                                            </div>
                                        </div>
                                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: product.stock > 0 ? 'var(--color-primary)' : '#f87171' }}>
                                                Stock: {product.stock}
                                            </span>
                                            <button
                                                className="btn-primary"
                                                style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', background: product.stock > 0 ? 'var(--color-primary)' : '#cbd5e1', cursor: product.stock > 0 ? 'pointer' : 'not-allowed', width: 'auto' }}
                                                onClick={() => handleRegisterSale(product)}
                                                disabled={product.stock <= 0}
                                            >
                                                Registrar Venta
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {filteredProducts.length === 0 && builtProducts.length > 0 && (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--color-text-light)' }}>
                                <Search size={32} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                                <p>No se encontraron productos con ese filtro.</p>
                            </div>
                        )}
                    </div>
                )}
            </motion.div>
        );
    };

    const handleNextStep = () => {
        if (currentStep === 1 && !productName.trim()) return;
        if (currentStep === 2 && selectedItems.length === 0) return;
        if (currentStep < 3) {
            setDirection(1);
            setCurrentStep(c => c + 1);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setDirection(-1);
            setCurrentStep(c => c - 1);
        }
    };

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? -50 : 50,
            opacity: 0
        })
    };

    const renderBuilderTab = () => {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="builder-tab"
            >
                <div className="header-bar mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', color: 'var(--color-primary)', margin: '0 0 0.5rem 0' }}>Crear Producto</h1>
                        <p style={{ color: 'var(--color-text-light)', margin: 0 }}>Sigue los pasos para diseñar tu pieza y calcular su rentabilidad.</p>
                    </div>
                </div>

                <div className="stepper-container admin-card" style={{ marginBottom: '3.5rem' }}>
                    <div className="stepper">
                        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                            <div className="step-num">1</div>
                            <span className="step-text">General</span>
                        </div>
                        <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`}></div>
                        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                            <div className="step-num">2</div>
                            <span className="step-text">Catálogo</span>
                        </div>
                        <div className={`step-line ${currentStep >= 3 ? 'active' : ''}`}></div>
                        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                            <div className="step-num">3</div>
                            <span className="step-text">Cotización</span>
                        </div>
                    </div>
                </div>

                <div className="wizard-content-container" style={{ minHeight: '600px', position: 'relative', overflowX: 'hidden', paddingBottom: '2rem' }}>
                    <AnimatePresence mode="wait" custom={direction}>
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="wizard-step"
                            >
                                <div className="step1-layout">

                                    {/* Columna izquierda: foto */}
                                    <div className="step1-photo-col">
                                        <p className="step1-field-label">Foto del Producto</p>
                                        <div
                                            className="step1-upload-area"
                                            onClick={() => document.getElementById('product-image-upload').click()}
                                        >
                                            {productImagePreview ? (
                                                <>
                                                    <img src={productImagePreview} alt="Preview" className="step1-preview-img" />
                                                    <button
                                                        type="button"
                                                        className="step1-remove-img"
                                                        onClick={e => { e.stopPropagation(); setProductImage(null); setProductImagePreview(''); }}
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="step1-upload-placeholder">
                                                    <UploadCloud size={36} color="var(--color-accent)" />
                                                    <span>Subir foto</span>
                                                </div>
                                            )}
                                            <input
                                                id="product-image-upload"
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setProductImage(file);
                                                        setProductImagePreview(URL.createObjectURL(file));
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Columna derecha: campos */}
                                    <div className="step1-fields-col admin-card">
                                        <div className="step1-heading">
                                            <Hammer size={28} color="var(--color-accent)" />
                                            <div>
                                                <h2 className="step1-title">{editingProductId ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                                                <p className="step1-subtitle">Completa la información básica de tu pieza.</p>
                                            </div>
                                        </div>

                                        <div className="step1-form-grid">
                                            <div className="input-group step1-name-field">
                                                <label className="step1-field-label">Nombre del producto</label>
                                                <input
                                                    type="text"
                                                    className="styled-input"
                                                    value={productName}
                                                    onChange={e => setProductName(e.target.value)}
                                                    placeholder="Ej: Conjunto de Verano Neón"
                                                    autoFocus
                                                />
                                            </div>

                                            <div className="input-group">
                                                <label className="step1-field-label">Categoría</label>
                                                <select
                                                    className="styled-select"
                                                    value={productCategory}
                                                    onChange={e => setProductCategory(e.target.value)}
                                                >
                                                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                                </select>
                                            </div>

                                            <div className="input-group">
                                                <label className="step1-field-label">Cantidad a producir (stock)</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="styled-input"
                                                    value={productionQty}
                                                    onChange={e => setProductionQty(e.target.value === '' ? '' : parseInt(e.target.value))}
                                                    onBlur={e => { if (!e.target.value || parseInt(e.target.value) < 1) setProductionQty(1); }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="wizard-step"
                            >
                                <div className="catalog-layout">
                                    {/* Panel izquierdo: catálogo */}
                                    <div className="admin-card catalog-panel">
                                        <div className="catalog-header">
                                            <div>
                                                <h3 className="section-title" style={{ margin: 0 }}>Catálogo de Insumos</h3>
                                                <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>Toca un insumo para añadirlo al producto</p>
                                            </div>
                                        </div>
                                        <div className="catalog-grid">
                                            {inventory.map(item => {
                                                const isSelected = selectedItems.some(sel => sel.inventoryId === item.id);
                                                const sel = selectedItems.find(s => s.inventoryId === item.id);
                                                return (
                                                    <div
                                                        key={`pick-${item.id}`}
                                                        className={`catalog-card ${isSelected ? 'selected' : ''}`}
                                                        onClick={() => toggleItemInBuilder(item)}
                                                    >
                                                        {isSelected && (
                                                            <div className="catalog-check">✓</div>
                                                        )}
                                                        <div className="catalog-img-wrap">
                                                            {item.imageUrl
                                                                ? <img src={item.imageUrl} alt={item.name} className="catalog-img" />
                                                                : <div className="catalog-icon">{ICONS[item.icon]}</div>
                                                            }
                                                        </div>
                                                        <div className="catalog-info">
                                                            <span className="catalog-badge">{item.type === 'materia' ? 'Materia' : 'Empaque'}</span>
                                                            <p className="catalog-name">{item.name}</p>
                                                            <p className="catalog-price">${formatUnitCost(item.unitCost)} <span>c/u</span></p>
                                                        </div>
                                                        {isSelected && sel && (
                                                            <div className="catalog-qty-row" onClick={e => e.stopPropagation()}>
                                                                <button className="qty-btn-sm" onClick={() => updateBuilderQty(item.id, -1)}><Minus size={12}/></button>
                                                                <span className="qty-val">{sel.qty}</span>
                                                                <button className="qty-btn-sm" onClick={() => updateBuilderQty(item.id, 1)}><Plus size={12}/></button>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Panel derecho: resumen de selección */}
                                    <div className="admin-card catalog-summary-panel">
                                        <h3 className="section-title" style={{ marginBottom: '1rem' }}>Seleccionados</h3>
                                        {selectedItems.length === 0 ? (
                                            <div className="catalog-empty">
                                                <Package size={32} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                                                <p>Aún no has elegido<br/>ningún insumo</p>
                                            </div>
                                        ) : (
                                            <div className="catalog-selected-list">
                                                {selectedItems.map(sel => (
                                                    <div key={sel.inventoryId} className="catalog-selected-row">
                                                        <div className="csr-icon">
                                                            {sel.itemRef.imageUrl
                                                                ? <img src={sel.itemRef.imageUrl} alt={sel.itemRef.name} />
                                                                : ICONS[sel.itemRef.icon]
                                                            }
                                                        </div>
                                                        <div className="csr-info">
                                                            <p className="csr-name">{sel.itemRef.name}</p>
                                                            <p className="csr-sub">x{sel.qty} · ${(sel.itemRef.unitCost * sel.qty).toFixed(2)}</p>
                                                        </div>
                                                        <button className="csr-remove" onClick={() => toggleItemInBuilder(sel.itemRef)}>
                                                            <X size={14}/>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <div className="catalog-total">
                                            <span>Total insumos</span>
                                            <strong>${selectedItems.reduce((s, sel) => s + sel.itemRef.unitCost * sel.qty, 0).toFixed(2)}</strong>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="wizard-step quote-layout"
                            >
                                {/* ── Columna izquierda: lista de piezas ── */}
                                <div className="admin-card quote-pieces-panel">
                                    <div className="quote-pieces-header">
                                        <div>
                                            <h3 className="section-title" style={{ margin: 0 }}>Piezas del producto</h3>
                                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>{productName}</p>
                                        </div>
                                        <span className="quote-count-badge">{selectedItems.length} insumos</span>
                                    </div>

                                    <div className="quote-items-list">
                                        {selectedItems.map((sel) => (
                                            <div key={sel.inventoryId} className="quote-item-row">
                                                <div className="quote-item-thumb">
                                                    {sel.itemRef.imageUrl
                                                        ? <img src={sel.itemRef.imageUrl} alt={sel.itemRef.name} />
                                                        : <span className="quote-item-icon">{ICONS[sel.itemRef.icon]}</span>
                                                    }
                                                </div>
                                                <div className="quote-item-info">
                                                    <p className="quote-item-name">{sel.itemRef.name}</p>
                                                    <p className="quote-item-meta">${formatUnitCost(sel.itemRef.unitCost)} c/u</p>
                                                </div>
                                                <div className="quote-qty-ctrl">
                                                    <button className="qty-btn" onClick={() => updateBuilderQty(sel.inventoryId, -1)}><Minus size={13}/></button>
                                                    <span className="qty-display">{sel.qty}</span>
                                                    <button className="qty-btn" onClick={() => updateBuilderQty(sel.inventoryId, 1)}><Plus size={13}/></button>
                                                </div>
                                                <div className="quote-item-subtotal">
                                                    ${(sel.itemRef.unitCost * sel.qty).toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="quote-pieces-footer">
                                        <span>Costo total de producción</span>
                                        <strong>${totalCost.toFixed(2)}</strong>
                                    </div>
                                </div>

                                {/* ── Columna derecha: cotización ── */}
                                <div className="admin-card quote-summary-panel">

                                    {/* Precio sugerido hero */}
                                    <div className="quote-price-hero">
                                        <p className="qph-label">Precio Sugerido</p>
                                        <h2 className="qph-price">${suggestedPrice.toFixed(2)}</h2>
                                        <div className="qph-profit">
                                            +${(suggestedPrice > 0 ? suggestedPrice - totalCost : 0).toFixed(2)} ganancia
                                        </div>
                                    </div>

                                    {/* Margen */}
                                    <div className="quote-margin-block">
                                        <div className="quote-margin-row">
                                            <span>Margen de ganancia</span>
                                            <strong>{profitMargin}%</strong>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="90"
                                            step="5"
                                            value={profitMargin}
                                            onChange={(e) => setProfitMargin(e.target.value)}
                                            className="custom-range"
                                        />
                                        <div className="quote-range-labels">
                                            <span>0%</span><span>45%</span><span>90%</span>
                                        </div>
                                    </div>

                                    {/* Desglose */}
                                    <div className="quote-breakdown">
                                        <div className="qb-row">
                                            <span className="qb-label">Costo producción</span>
                                            <span className="qb-val">${totalCost.toFixed(2)}</span>
                                        </div>
                                        <div className="qb-row">
                                            <span className="qb-label">Ganancia ({profitMargin}%)</span>
                                            <span className="qb-val gain">+${(suggestedPrice > 0 ? suggestedPrice - totalCost : 0).toFixed(2)}</span>
                                        </div>
                                        <div className="qb-divider" />
                                        <div className="qb-row total">
                                            <span className="qb-label">Precio final</span>
                                            <span className="qb-val">${suggestedPrice.toFixed(2)}</span>
                                        </div>
                                    </div>

                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="wizard-navigation" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', padding: '1rem 0' }}>
                    <button
                        className={`btn-secondary ${currentStep === 1 ? 'invisible' : ''}`}
                        onClick={handlePrevStep}
                        disabled={currentStep === 1}
                        style={{ padding: '0.75rem 2rem', borderRadius: '12px', border: '2px solid #e2e8f0', background: 'transparent', color: '#64748b', fontWeight: 600, cursor: 'pointer', visibility: currentStep === 1 ? 'hidden' : 'visible' }}
                    >
                        Paso Anterior
                    </button>

                    <button
                        className="btn-primary"
                        onClick={currentStep === 3 ? handleSaveQuote : handleNextStep}
                        style={{ width: 'auto', padding: '0.75rem 2rem', opacity: isUploading ? 0.7 : 1, pointerEvents: isUploading ? 'none' : 'auto' }}
                        disabled={isUploading || (currentStep === 3 && selectedItems.length === 0)}
                    >
                        {isUploading ? 'Guardando...' : (currentStep === 3 ? 'Guardar Cotización' : 'Siguiente Paso')}
                    </button>
                </div>
            </motion.div>
        );
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--color-primary)' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid rgba(67,24,255,0.1)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <p style={{ marginTop: '1rem', fontWeight: 600 }}>Cargando datos...</p>
                <style>
                    {`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                    `}
                </style>
            </div>
        );
    }

    return (
        <div className="pricing-content fade-in">
            <AnimatePresence mode="wait">
                {activeTab === 'overview' && <motion.div key="overview">{renderOverviewTab()}</motion.div>}
                {activeTab === 'inventory' && <motion.div key="inventory">{renderInventoryTab()}</motion.div>}
                {activeTab === 'builder' && <motion.div key="builder">{renderBuilderTab()}</motion.div>}
            </AnimatePresence>
        </div>
    );
}
