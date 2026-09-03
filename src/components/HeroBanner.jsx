import React, { useState } from 'react';
import { Search, Bot, Sparkles, ArrowRight, MessageSquare, Zap } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';

export default function HeroBanner() {
  const { 
    searchQuery, 
    setSearchQuery, 
    setIsAiModalOpen,
    setActiveCategory,
    setActiveTab 
  } = useProducts();

  const [localSearch, setLocalSearch] = useState(searchQuery);

  const quickExamples = [
    'Filtro de aire',
    'Pastas de freno',
    'Kit de arrastre',
    'Casco',
    'Batería'
  ];

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setSearchQuery(localSearch);
    setActiveCategory(null);
    // Smooth scroll to catalog
    const catalogElement = document.getElementById('catalogo-repuestos');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleChipClick = (example) => {
    setLocalSearch(example);
    setSearchQuery(example);
    setActiveCategory(null);
    const catalogElement = document.getElementById('catalogo-repuestos');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-[#090a12] text-white overflow-hidden py-10 md:py-16 border-b border-purple-900/30">
      {/* Dynamic Background Glows and motorcycle atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/40 via-[#0d0f1a] to-[#080910] pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }} 
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Hero Content (Left/Center) */}
          <div className="lg:col-span-8 flex flex-col items-start text-left">
            
            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-black tracking-tight leading-tight text-white mb-3">
              Encuentra, vende o cambia <br className="hidden sm:block" />
              repuestos para <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent underline decoration-purple-500/50 decoration-wavy decoration-2">tu moto</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-slate-300 font-normal mb-8 max-w-2xl">
              La comunidad biker más grande, segura y confiable de Colombia
            </p>

            {/* Big "IA Buscador" Search Bar */}
            <form 
              onSubmit={handleSearchSubmit}
              className="w-full max-w-2xl bg-white rounded-full p-1.5 sm:p-2 flex items-center shadow-2xl shadow-purple-950/60 ring-2 ring-purple-600/30 focus-within:ring-purple-500 transition-all"
            >
              {/* Purple IA Tag */}
              <button
                type="button"
                onClick={() => setIsAiModalOpen(true)}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-purple-700 to-purple-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-700/40 hover:brightness-110 transition-all shrink-0"
              >
                <Bot className="w-4 h-4 text-purple-200 animate-pulse" />
                <span className="hidden xs:inline">IA Buscador</span>
              </button>

              {/* Input field */}
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="¿Qué repuesto, moto o accesorio necesitas?"
                className="w-full bg-transparent px-3 sm:px-4 py-2 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none"
              />

              {/* Purple Search Button */}
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-purple-600/40 transition-all shrink-0 active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span>Buscar</span>
              </button>
            </form>

            {/* Quick Example Chips */}
            <div className="mt-4 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Ejemplos:</span>
              {quickExamples.map((example, index) => (
                <React.Fragment key={example}>
                  <button
                    type="button"
                    onClick={() => handleChipClick(example)}
                    className="text-slate-300 hover:text-purple-300 hover:underline cursor-pointer transition-colors"
                  >
                    {example}
                  </button>
                  {index < quickExamples.length - 1 && (
                    <span className="text-slate-600 select-none">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>

          </div>

          {/* Right Hero Card: "IA Asistente Moto_" Widget */}
          <div className="lg:col-span-4 w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-sm relative rounded-2xl p-5 bg-gradient-to-b from-[#1c1833]/90 to-[#121124]/95 border border-purple-500/30 backdrop-blur-xl shadow-2xl shadow-purple-950/70 group hover:border-purple-400/50 transition-all">
              
              {/* Corner ambient glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/20 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-start gap-3.5 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400/30 flex items-center justify-center shrink-0 shadow-inner">
                  <Bot className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-white">IA Asistente Moto_</h3>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      24/7
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Te ayuda a encontrar el repuesto ideal, compara precios y compatibilidad con tu modelo.
                  </p>
                </div>
              </div>

              {/* Action Button: Chatear con la IA */}
              <button
                type="button"
                onClick={() => setIsAiModalOpen(true)}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-purple-600/40 flex items-center justify-center gap-2 transition-all transform active:scale-98"
              >
                <MessageSquare className="w-4 h-4 text-purple-200" />
                <span>Chatear con la IA</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple-200 group-hover:translate-x-1 transition-transform" />
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
