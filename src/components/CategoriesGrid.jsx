import React from 'react';
import { ArrowRight, PlusCircle } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { useProducts } from '../context/ProductsContext';

export default function CategoriesGrid() {
  const { activeCategory, setActiveCategory, setIsPublishModalOpen } = useProducts();

  return (
    <section className="py-8 bg-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header of Categories Section */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="18.5" cy="17.5" r="3.5" />
              <circle cx="5.5" cy="17.5" r="3.5" />
              <circle cx="15" cy="5" r="1" />
              <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
            </svg>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Categorías de repuestos
            </h2>
          </div>

          <button
            onClick={() => setActiveCategory(null)}
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors"
          >
            <span>{activeCategory ? 'Ver todas' : 'Todas las categorías'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Categories Grid and Side CTA Banner */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          
          {/* Categories Grid: 8 columns / cards */}
          <div className="xl:col-span-9">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
              {CATEGORIES.map((cat) => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(isSelected ? null : cat.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center group ${
                      isSelected
                        ? 'bg-purple-50 border-purple-600 shadow-md shadow-purple-600/10 ring-2 ring-purple-600/30'
                        : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-purple-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden mb-2 bg-white p-1 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover rounded-lg"
                        loading="lazy"
                      />
                    </div>
                    <span className={`text-xs font-bold truncate max-w-full ${
                      isSelected ? 'text-purple-700' : 'text-slate-800 group-hover:text-purple-600'
                    }`}>
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      {cat.count} items
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Banner: "¡Publica, vende o cambia!" exactly matching the reference image */}
          <div className="xl:col-span-3">
            <div className="h-full rounded-2xl bg-gradient-to-br from-purple-800 via-purple-700 to-indigo-900 text-white p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between shadow-xl shadow-purple-950/20 border border-purple-600/40">
              
              {/* Background ambient lighting */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative z-10">
                <span className="inline-block text-[10px] font-extrabold tracking-wider uppercase text-purple-200 bg-white/10 px-2 py-0.5 rounded-full mb-1.5">
                  Vende o Permuta
                </span>
                <h3 className="text-base sm:text-lg font-black leading-tight text-white">
                  ¡Publica, vende o cambia!
                </h3>
                <p className="text-xs text-purple-100 mt-1 leading-relaxed">
                  Llega a miles de moteros en todo el país gratis y seguro.
                </p>
              </div>

              {/* Action Button: Yellow / Gold pill like in image */}
              <div className="relative z-10 mt-4 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(true)}
                  className="w-full py-2.5 px-3 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-slate-900" />
                  <span>Publicar anuncio</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
