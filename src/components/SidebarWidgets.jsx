import React from 'react';
import { CheckCircle2, Wrench, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';

export default function SidebarWidgets() {
  const { setIsGuidesModalOpen, setIsAiModalOpen } = useProducts();

  const benefits = [
    'Inteligencia Artificial para mejores búsquedas y recomendaciones',
    'Precios justos y negociables',
    'Comunidad activa de motociclistas',
    'Soporte y asesoría en tiempo real'
  ];

  return (
    <aside className="space-y-6">
      
      {/* Widget 1: ¿Por qué elegir MotoMarket? */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
          ¿Por qué elegir MotoMarket?
        </h3>
        
        <ul className="space-y-3 text-xs text-slate-600">
          {benefits.map((benefit, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{benefit}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-purple-600 font-semibold cursor-pointer hover:underline" onClick={() => setIsAiModalOpen(true)}>
          <span>Hablar con un asesor IA</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Widget 2: Tips y guías para el cuidado de tu moto */}
      <div className="rounded-2xl bg-gradient-to-b from-[#141522] to-[#0a0b12] text-white p-5 border border-purple-900/40 relative overflow-hidden shadow-xl shadow-purple-950/20">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Wrench className="w-3.5 h-3.5 text-purple-400" />
          <span>Tips y guías</span>
        </div>

        <h4 className="relative z-10 text-base font-bold text-white leading-snug">
          Tips y guías para el cuidado de tu moto
        </h4>

        <p className="relative z-10 text-xs text-slate-300 mt-2 leading-relaxed">
          Consejos prácticos de mecánicos expertos sobre frenos, cadena, lubricación y rodaje seguro.
        </p>

        <div className="relative z-10 mt-4">
          <button
            type="button"
            onClick={() => setIsGuidesModalOpen(true)}
            className="py-2 px-4 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/30 text-white text-xs font-bold flex items-center gap-2 transition-all"
          >
            <span>Ver más</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Motorcycle background silhouette illustration */}
        <div className="absolute -bottom-6 -right-6 opacity-20 pointer-events-none">
          <svg className="w-36 h-36 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="18.5" cy="17.5" r="3.5" />
            <circle cx="5.5" cy="17.5" r="3.5" />
            <circle cx="15" cy="5" r="1" />
            <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
          </svg>
        </div>

      </div>

    </aside>
  );
}
