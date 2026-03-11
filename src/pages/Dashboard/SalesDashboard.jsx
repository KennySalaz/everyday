import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, DollarSign, Package, Activity, Download } from 'lucide-react';
import './SalesDashboard.css';

const COLORS = ['#4318FF', '#d4af37', '#05cd99', '#f87171', '#8b5cf6', '#f59e0b'];

const CATEGORY_LABELS = {
    pulseras: 'Pulseras', collares: 'Collares', anillos: 'Anillos',
    aretes: 'Aretes', sets: 'Sets / Combos', otros: 'Otros'
};

export default function SalesDashboard() {
    const { builtProducts, transactions } = useOutletContext();

    // Date range filter state
    const [dateRange, setDateRange] = useState('all'); // all, today, week, month

    // Filter transactions by date range
    const filteredTxns = useMemo(() => {
        if (dateRange === 'all') return transactions;

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        return transactions.filter(t => {
            // Parse the date string
            const parts = t.date.match(/(\d+)\/(\d+)\/(\d+)/);
            if (!parts) return true;
            // Accept both DD/MM/YYYY and MM/DD/YYYY — keep it simple
            const txDate = new Date(parts[3], parseInt(parts[2]) - 1, parseInt(parts[1]));

            if (dateRange === 'today') {
                return txDate >= today;
            }
            if (dateRange === 'week') {
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                return txDate >= weekAgo;
            }
            if (dateRange === 'month') {
                const monthAgo = new Date(today);
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                return txDate >= monthAgo;
            }
            return true;
        });
    }, [transactions, dateRange]);

    // Dynamic Calculations based on filtered transactions
    const totalRevenue = filteredTxns.reduce((sum, t) => sum + t.revenue, 0);
    const totalProfit = filteredTxns.reduce((sum, t) => sum + t.profit, 0);
    const totalOrders = filteredTxns.reduce((sum, t) => sum + t.qty, 0);

    // Conversion rate
    const uniqueProductsSold = new Set(filteredTxns.map(t => t.productId)).size;
    const conversionRate = builtProducts.length > 0
        ? Math.round((uniqueProductsSold / builtProducts.length) * 100)
        : 0;

    // Monthly Chart Data
    const monthlyMap = {};
    filteredTxns.forEach(t => {
        const monthMatch = t.date.match(/(\d+)\/(\d+)\/(\d+)/);
        let monthKey = "Mes Actual";
        if (monthMatch) {
            const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            const monthIdx = parseInt(monthMatch[2]) - 1;
            monthKey = months[monthIdx] || "N/A";
        }
        if (!monthlyMap[monthKey]) {
            monthlyMap[monthKey] = { name: monthKey, sales: 0, investment: 0, profit: 0 };
        }
        monthlyMap[monthKey].sales += t.revenue;
        monthlyMap[monthKey].investment += t.investment;
        monthlyMap[monthKey].profit += t.profit;
    });
    const chartMonthlyData = Object.values(monthlyMap).length > 0
        ? Object.values(monthlyMap)
        : [{ name: 'Sin Ventas', sales: 0, profit: 0 }];

    // Category Pie Data — use product category if available
    const categoryMap = {};
    filteredTxns.forEach(t => {
        const product = builtProducts.find(p => p.id === t.productId);
        const catKey = product?.category ? (CATEGORY_LABELS[product.category] || product.category) : t.productName;
        if (!categoryMap[catKey]) categoryMap[catKey] = 0;
        categoryMap[catKey] += t.revenue;
    });
    const chartCategoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);
    const finalCategoryData = chartCategoryData.length > 0 ? chartCategoryData : [{ name: 'Sin Ventas', value: 1 }];

    // Export CSV
    const handleExportCSV = () => {
        if (filteredTxns.length === 0) return;
        const headers = ['Producto', 'Fecha', 'Cantidad', 'Inversión', 'Venta', 'Ganancia'];
        const rows = filteredTxns.map(t => [
            t.productName,
            t.date,
            t.qty,
            t.investment.toFixed(2),
            t.revenue.toFixed(2),
            t.profit.toFixed(2)
        ]);
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `ventas_everyday_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sales-dashboard fade-in"
        >
            <div className="header-bar mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--color-primary)', margin: '0 0 0.5rem 0' }}>Estadísticas y Ventas</h1>
                    <p style={{ color: 'var(--color-text-light)', margin: 0 }}>Monitorea el rendimiento de tus cotizaciones, ganancias y retornos de inversión.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <select
                        className="styled-select"
                        value={dateRange}
                        onChange={e => setDateRange(e.target.value)}
                        style={{ width: 'auto', padding: '0.6rem 1.25rem', fontSize: '0.9rem', minWidth: '140px' }}
                    >
                        <option value="all">Todo el Tiempo</option>
                        <option value="today">Hoy</option>
                        <option value="week">Última Semana</option>
                        <option value="month">Último Mes</option>
                    </select>
                    <button
                        className="btn-primary"
                        style={{ width: 'auto', padding: '0.6rem 1.25rem', fontSize: '0.9rem', opacity: filteredTxns.length === 0 ? 0.5 : 1 }}
                        onClick={handleExportCSV}
                        disabled={filteredTxns.length === 0}
                    >
                        <Download size={16} /> Exportar CSV
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <div className="kpi-grid">
                <div className="admin-card kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(5, 205, 153, 0.1)', color: '#05cd99' }}>
                        <DollarSign size={24} />
                    </div>
                    <div className="kpi-info">
                        <span className="kpi-label">Ingresos Totales</span>
                        <h3 className="kpi-value">${totalRevenue.toFixed(2)}</h3>
                        <span className="kpi-trend positive">{filteredTxns.length} ventas</span>
                    </div>
                </div>

                <div className="admin-card kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--color-accent)' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div className="kpi-info">
                        <span className="kpi-label">Ganancia Neta (Profit)</span>
                        <h3 className="kpi-value">${totalProfit.toFixed(2)}</h3>
                        <span className="kpi-trend positive">{totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0}% margen</span>
                    </div>
                </div>

                <div className="admin-card kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(67, 24, 255, 0.1)', color: 'var(--color-primary)' }}>
                        <Package size={24} />
                    </div>
                    <div className="kpi-info">
                        <span className="kpi-label">Productos Vendidos</span>
                        <h3 className="kpi-value">{totalOrders} uds</h3>
                        <span className="kpi-trend neutral">{uniqueProductsSold} producto{uniqueProductsSold !== 1 ? 's' : ''} distinto{uniqueProductsSold !== 1 ? 's' : ''}</span>
                    </div>
                </div>

                <div className="admin-card kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(248, 113, 113, 0.1)', color: '#f87171' }}>
                        <Activity size={24} />
                    </div>
                    <div className="kpi-info">
                        <span className="kpi-label">Conversión Muestras</span>
                        <h3 className="kpi-value">
                            {conversionRate}%
                        </h3>
                        <span className="kpi-trend text-light">Cotizados vs Vendidos</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
                <div className="admin-card chart-container col-span-2">
                    <h3 className="chart-title">Rendimiento Mensual (Ventas vs Ganancia)</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart
                                data={chartMonthlyData}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4318FF" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4318FF" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#05cd99" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#05cd99" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="var(--color-text-light)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--color-text-light)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                                    formatter={(value) => [`$${value.toFixed(2)}`, undefined]}
                                />
                                <Area type="monotone" dataKey="sales" name="Ventas ($)" stroke="#4318FF" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                                <Area type="monotone" dataKey="profit" name="Ganancia ($)" stroke="#05cd99" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="admin-card chart-container">
                    <h3 className="chart-title">Ventas por Categoría</h3>
                    <div style={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={finalCategoryData}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {finalCategoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                                    formatter={(value) => [`$${value.toFixed(2)}`, undefined]}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="admin-card" style={{ marginTop: '2rem' }}>
                <h3 className="chart-title" style={{ marginBottom: '1.5rem' }}>Transacciones Recientes</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #f1f5f9', color: 'var(--color-text-light)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                                <th style={{ padding: '1rem' }}>Producto</th>
                                <th style={{ padding: '1rem' }}>Fecha</th>
                                <th style={{ padding: '1rem' }}>Inversión</th>
                                <th style={{ padding: '1rem' }}>Venta</th>
                                <th style={{ padding: '1rem' }}>Ganancia</th>
                                <th style={{ padding: '1rem' }}>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTxns.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
                                        No hay transacciones {dateRange !== 'all' ? 'en este período' : 'recientes'}. Comienza registrando una venta en tus Cotizaciones.
                                    </td>
                                </tr>
                            ) : (
                                [...filteredTxns].reverse().map(t => (
                                    <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                                        <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                                            {t.productName}
                                            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-light)', fontWeight: 400 }}>x{t.qty} unidades</span>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--color-text-light)' }}>{t.date}</td>
                                        <td style={{ padding: '1rem', color: 'var(--color-text-light)' }}>${t.investment.toFixed(2)}</td>
                                        <td style={{ padding: '1rem', fontWeight: 700, color: '#4318FF' }}>${t.revenue.toFixed(2)}</td>
                                        <td style={{ padding: '1rem', fontWeight: 700, color: '#05cd99' }}>+${t.profit.toFixed(2)}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ background: 'rgba(5, 205, 153, 0.1)', color: '#05cd99', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600 }}>Completado</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </motion.div>
    );
}
