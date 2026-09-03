import React, { useState } from 'react';
import { X, BookOpen, Clock, Tag, ChevronRight } from 'lucide-react';
import { BIKER_GUIDES } from '../data/guides';
import { useProducts } from '../context/ProductsContext';

export default function GuidesModal() {
  const { isGuidesModalOpen, setIsGuidesModalOpen } = useProducts();
  const [selectedGuide, setSelectedGuide] = useState(BIKER_GUIDES[0]);

  if (!isGuidesModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-purple-200 animate-scaleUp flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/50 flex items-center justify-center border border-purple-400/40">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Tips y Guías para el Cuidado de tu Moto</h3>
              <p className="text-xs text-purple-200">Recomendaciones técnicas de mecánicos e ingenieros moteros</p>
            </div>
          </div>
          <button
            onClick={() => setIsGuidesModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          
          {/* Guide Selector list */}
          <div className="md:col-span-4 bg-slate-50 border-r border-slate-200 p-3 space-y-2 overflow-y-auto">
            {BIKER_GUIDES.map((guide) => {
              const isSelected = selectedGuide?.id === guide.id;
              return (
                <div
                  key={guide.id}
                  onClick={() => setSelectedGuide(guide)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-purple-50 border-purple-600 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold text-purple-700 block mb-0.5">
                    {guide.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 leading-snug line-clamp-2">
                    {guide.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1.5">
                    <Clock className="w-3 h-3" />
                    <span>{guide.readTime}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Guide Detail view */}
          <div className="md:col-span-8 p-6 overflow-y-auto">
            {selectedGuide && (
              <article className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="bg-purple-100 text-purple-800 font-bold px-2.5 py-0.5 rounded-full">
                    {selectedGuide.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedGuide.readTime} de lectura</span>
                  </div>
                </div>

                <h2 className="text-xl font-black text-slate-900 leading-tight">
                  {selectedGuide.title}
                </h2>

                <div className="h-44 rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={selectedGuide.image}
                    alt={selectedGuide.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  {selectedGuide.content}
                </div>
              </article>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
