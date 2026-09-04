import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductsProvider } from './context/ProductsContext';

import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import BenefitsBar from './components/BenefitsBar';
import CategoriesGrid from './components/CategoriesGrid';
import ProductCatalog from './components/ProductCatalog';
import Footer from './components/Footer';

import ProductDetailModal from './components/ProductDetailModal';
import PublishModal from './components/PublishModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AuthModal from './components/AuthModal';
import UserProfileModal from './components/UserProfileModal';
import AiAssistantModal from './components/AiAssistantModal';
import SwapModal from './components/SwapModal';
import GuidesModal from './components/GuidesModal';
import ForumModal from './components/ForumModal';
import AdminPanelModal from './components/AdminPanelModal';
import EditProductModal from './components/EditProductModal';

function MainApp() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-sans selection:bg-purple-600 selection:text-white">
      {/* Top sticky navigation bar */}
      <Navbar />

      <main className="flex-grow">
        {/* Dark Hero with cyber bike background, IA Buscador and IA Asistente Biker_ */}
        <HeroBanner />

        {/* 4 horizontal value badges */}
        <BenefitsBar />

        {/* Categories Grid and Prominent Publish Banner */}
        <CategoriesGrid />

        {/* Product Catalog with tabs: Venta, Cambio, Nuevos, search & right sidebar */}
        <ProductCatalog />
      </main>

      {/* Dark Footer */}
      <Footer />

      {/* Interactive Modals and Drawers */}
      <ProductDetailModal />
      <PublishModal />
      <CartDrawer />
      <CheckoutModal />
      <AuthModal />
      <UserProfileModal />
      <AiAssistantModal />
      <SwapModal />
      <GuidesModal />
      <ForumModal />
      <AdminPanelModal />
      <EditProductModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ProductsProvider>
          <MainApp />
        </ProductsProvider>
      </CartProvider>
    </AuthProvider>
  );
}
