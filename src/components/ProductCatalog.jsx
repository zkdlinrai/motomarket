import React from 'react';
import { ShoppingBag, RefreshCw, Users, X, Search, Filter } from 'lucide-react';
import ProductCard from './ProductCard';
import SidebarWidgets from './SidebarWidgets';
import { useProducts } from '../context/ProductsContext';
import { CATEGORIES } from '../data/categories';

export default function ProductCatalog() {
  const {
    filteredProducts,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    selectedCity,
    setSelectedCity,
    products
  } = useProducts();

  const currentCategoryObj = CATEGORIES.find(c => c.id === activeCategory);

  const saleCount = products.filter(p => p.type === 'venta').length;
  const swapCount = products.filter(p => p.type === 'cambio').length;
  const newCount = products.filter(p => p.isNewListing).length;

  const cities = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga', 'Manizales', 'Pereira'];

  return (
    <section id="catalogo-repuestos" className="py-10 bg-slate-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Tabs Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 max-w-full">
            
            {/* Tab: Repuestos en venta */}
            <button
              onClick={() => setActiveTab('venta')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                activeTab === 'venta'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Repuestos en venta</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                activeTab === 'venta' ? 'bg-purple-800 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {saleCount}
              </span>
            </button>

            {/* Tab: Repuestos para cambio */}
            <button
              onClick={() => setActiveTab('cambio')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                activeTab === 'cambio'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Repuestos para cambio</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                activeTab === 'cambio' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {swapCount}
              </span>
            </button>

            {/* Tab: Nuevos usuarios */}
            <button
              onClick={() => setActiveTab('nuevos')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                activeTab === 'nuevos'
                  ? 'bg-purple-900 text-white shadow-md shadow-purple-950/40'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Nuevos usuarios</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                activeTab === 'nuevos' ? 'bg-purple-950 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {newCount}
              </span>
            </button>

          </div>

          {/* City quick filter dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium hidden sm:inline">Ciudad:</span>
            <select
              value={selectedCity || ''}
              onChange={(e) => setSelectedCity(e.target.value || null)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="">Todas las ciudades</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Badges */}
        {(searchQuery || activeCategory || selectedCity) && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-xs">
            <span className="font-semibold text-purple-900">Filtros aplicados:</span>
            
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-purple-200 text-purple-800 px-2.5 py-1 rounded-full font-medium">
                Búsqueda: "{searchQuery}"
                <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => setSearchQuery('')} />
              </span>
            )}

            {currentCategoryObj && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-purple-200 text-purple-800 px-2.5 py-1 rounded-full font-medium">
                Categoría: {currentCategoryObj.name}
                <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => setActiveCategory(null)} />
              </span>
            )}

            {selectedCity && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-purple-200 text-purple-800 px-2.5 py-1 rounded-full font-medium">
                Ciudad: {selectedCity}
                <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => setSelectedCity(null)} />
              </span>
            )}

            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory(null);
                setSelectedCity(null);
              }}
              className="text-purple-600 hover:text-purple-900 underline font-semibold ml-auto"
            >
              Limpiar todos
            </button>
          </div>
        )}

        {/* Catalog 2-Column Section (Matches Mockup Image) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Main Product Cards Grid (9 cols on xl) */}
          <div className="xl:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  No encontramos repuestos que coincidan
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-6">
                  Intenta buscar con otros términos como "Yamaha", "Freno", "Cadena", o elimina los filtros aplicados.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory(null);
                    setSelectedCity(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs sm:text-sm font-semibold hover:bg-purple-700 transition-colors"
                >
                  Restablecer catálogo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar Widgets (3 cols on xl) */}
          <div className="xl:col-span-3">
            <SidebarWidgets />
          </div>

        </div>

      </div>
    </section>
  );
}
