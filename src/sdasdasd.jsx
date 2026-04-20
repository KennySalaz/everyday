import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductDetails from './pages/ProductDetails';
import AnnouncementBar from './components/UI/AnnouncementBar';
import PricingDashboard from './pages/Pricing';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import SalesDashboard from './pages/Dashboard/SalesDashboard';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

function PublicLayout({ children }) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  return (
    <>
     
      <Navbar />
      {/* Solo Home tiene hero full-screen que compensa el navbar fijo.
          El resto necesita un offset para no quedar tapado */}
      <main style={isHome ? {} : { paddingTop: '70px' }}>{children}</main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* ── Login admin ─────────────────────────────── */}
          <Route path="/ed-admin-2026/login" element={<LoginPage />} />

          {/* ── Dashboard protegido (ruta secreta) ─────── */}
          <Route path="/ed-admin-2026" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<PricingDashboard initialTab="overview" />} />
            <Route path="inventory" element={<PricingDashboard initialTab="inventory" />} />
            <Route path="builder" element={<PricingDashboard initialTab="builder" />} />
            <Route path="sales" element={<SalesDashboard />} />
          </Route>

          {/* ── Rutas públicas ──────────────────────────── */}
          <Route path="*" element={
            <PublicLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/product/:id" element={<ProductDetails />} />
              </Routes>
            </PublicLayout>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
