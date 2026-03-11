import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Sidebar from './Sidebar';
import './DashboardLayout.css';

export default function DashboardLayout() {
    // Global State for Pricing Module
    const [inventory, setInventory] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]); // Array of { inventoryId, qty, itemRef }
    const [profitMargin, setProfitMargin] = useState(30);
    const [builtProducts, setBuiltProducts] = useState([]); // Array to store completed quotes/products
    const [transactions, setTransactions] = useState([]); // Track actual sales
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Setup Firestore Listeners
    useEffect(() => {
        setIsLoading(true);
        let loadedCollections = 0;
        const checkLoading = () => {
            loadedCollections++;
            if (loadedCollections === 3) setIsLoading(false);
        };

        const unsubInventory = onSnapshot(collection(db, 'inventory'), (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setInventory(data);
            checkLoading();
            // Note: If INITIAL_INVENTORY logic is needed, it would be handled via a migration script, not here.
        });

        const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBuiltProducts(data);
            checkLoading();
        });

        const unsubTransactions = onSnapshot(collection(db, 'transactions'), (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTransactions(data);
            checkLoading();
        });

        return () => {
            unsubInventory();
            unsubProducts();
            unsubTransactions();
        };
    }, []);

    // Calculate Costs for currently built product
    const totalCost = selectedItems.reduce((total, selection) => {
        return total + (selection.itemRef.unitCost * selection.qty);
    }, 0);

    const suggestedPrice = totalCost > 0 ? totalCost / (1 - (profitMargin / 100)) : 0;

    // --- Firestore Mutators ---

    const addInventoryItem = async (newItem) => {
        // We omit the local state update because the listener handles it
        const itemToSave = { ...newItem };
        delete itemToSave.id; // Let Firestore generate the ID or use custom
        await addDoc(collection(db, 'inventory'), itemToSave);
    };

    const deleteInventoryItem = async (id) => {
        await deleteDoc(doc(db, 'inventory', id));
        setSelectedItems(selectedItems.filter(i => i.inventoryId !== id)); // Keep UI state fast for builder
    };

    const updateInventoryItem = async (updatedItem) => {
        const itemRef = doc(db, 'inventory', updatedItem.id);
        const dataToSave = { ...updatedItem };
        delete dataToSave.id;
        await updateDoc(itemRef, dataToSave);
    };

    const deleteBuiltProduct = async (id) => {
        await deleteDoc(doc(db, 'products', id));
    };

    const updateBuiltProduct = async (updatedProduct) => {
        const productRef = doc(db, 'products', updatedProduct.id);
        const dataToSave = { ...updatedProduct };
        delete dataToSave.id; // Remove id from payload
        await updateDoc(productRef, dataToSave);
    };

    // Note: To add a new built product we need a dedicated function that saves to Firestore
    // Previously Pricing.jsx did `setBuiltProducts([...builtProducts, newProduct])`
    // So we'll expose a wrapper saveProduct
    const saveBuiltProduct = async (newProduct) => {
        const dataToSave = { ...newProduct };
        delete dataToSave.id;
        if (newProduct.id && typeof newProduct.id === 'string' && newProduct.id.length > 20) {
            // It might be an existing ID format update, but usually Pricing handles edit via updateBuiltProduct
        }
        await addDoc(collection(db, 'products'), dataToSave);
    };

    // To register a sale, Pricing.jsx did `setTransactions([...transactions, newTx])`
    const saveTransaction = async (newTx) => {
        const dataToSave = { ...newTx };
        delete dataToSave.id;
        await addDoc(collection(db, 'transactions'), dataToSave);
    };

    // Low stock count for sidebar badge
    const lowStockCount = builtProducts.filter(p => p.stock > 0 && p.stock <= 3).length;

    const contextValue = {
        inventory,
        builtProducts,
        selectedItems,
        profitMargin,
        transactions,
        isLoading,
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
        suggestedPrice
    };

    return (
        <div className="admin-dashboard-container">
            {/* Mobile hamburger */}
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
                <Menu size={24} />
            </button>

            <Sidebar
                lowStockCount={lowStockCount}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <main className="admin-dashboard-main">
                <div className="admin-content-area">
                    <Outlet context={contextValue} />
                </div>
            </main>
        </div>
    );
}

