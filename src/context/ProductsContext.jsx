import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const ProductsContext = createContext();

const PRODUCTS_STORAGE_KEY = 'motomarket_products_v2';
const SWAP_STORAGE_KEY = 'motomarket_swap_proposals';

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error reading products from localStorage', e);
    }
    return INITIAL_PRODUCTS;
  });

  const [swapProposals, setSwapProposals] = useState(() => {
    try {
      const saved = localStorage.getItem(SWAP_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Navigation & Filter States
  const [activeTab, setActiveTab] = useState('venta'); // 'venta' | 'cambio' | 'nuevos'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // Modal States
  const [selectedProductForDetail, setSelectedProductForDetail] = useState(null);
  const [selectedProductForSwap, setSelectedProductForSwap] = useState(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isGuidesModalOpen, setIsGuidesModalOpen] = useState(false);
  const [isForumModalOpen, setIsForumModalOpen] = useState(false);

  // Sync products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products to localStorage', e);
    }
  }, [products]);

  // Sync swap proposals
  useEffect(() => {
    try {
      localStorage.setItem(SWAP_STORAGE_KEY, JSON.stringify(swapProposals));
    } catch (e) {
      console.error('Error saving swap proposals to localStorage', e);
    }
  }, [swapProposals]);

  const addProduct = (newProductData) => {
    const newProduct = {
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      isNewListing: true,
      createdAt: new Date().toISOString().split('T')[0],
      stock: 1,
      ...newProductData
    };

    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const proposeSwap = (proposal) => {
    const newProposal = {
      id: `swap-${Date.now()}`,
      date: new Date().toISOString(),
      status: 'Pendiente de respuesta del vendedor',
      ...proposal
    };

    setSwapProposals(prev => [newProposal, ...prev]);
    return newProposal;
  };

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Filter by tab
      if (activeTab === 'venta' && product.type !== 'venta') return false;
      if (activeTab === 'cambio' && product.type !== 'cambio') return false;
      if (activeTab === 'nuevos' && !product.isNewListing) return false;

      // Filter by category
      if (activeCategory && product.category !== activeCategory) return false;

      // Filter by city
      if (selectedCity && product.city.toLowerCase() !== selectedCity.toLowerCase()) return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        const matchesCity = product.city.toLowerCase().includes(q);
        const matchesTags = product.tags?.some(tag => tag.toLowerCase().includes(q));
        const matchesBikes = product.compatibleBikes?.some(bike => bike.toLowerCase().includes(q));
        const matchesDesc = product.description.toLowerCase().includes(q);

        if (!matchesTitle && !matchesCategory && !matchesCity && !matchesTags && !matchesBikes && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [products, activeTab, activeCategory, selectedCity, searchQuery]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        filteredProducts,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
        selectedCity,
        setSelectedCity,
        selectedProductForDetail,
        setSelectedProductForDetail,
        selectedProductForSwap,
        setSelectedProductForSwap,
        isPublishModalOpen,
        setIsPublishModalOpen,
        isAiModalOpen,
        setIsAiModalOpen,
        isGuidesModalOpen,
        setIsGuidesModalOpen,
        isForumModalOpen,
        setIsForumModalOpen,
        addProduct,
        proposeSwap,
        swapProposals
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
