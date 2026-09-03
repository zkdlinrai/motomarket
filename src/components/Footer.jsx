import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Heart, Phone, Mail, MapPin } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';

export default function Footer() {
  const { setActiveCategory, setActiveTab, setIsAiModalOpen, setIsGuidesModalOpen } = useProducts();

  return (
    <footer className="bg-[#080910] text-slate-400 border-t border-purple-950/60 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-white/5">
          
          {/* Col 1 & 2: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="18.5" cy="17.5" r="3.5" />
                  <circle cx="5.5" cy="17.5" r="3.5" />
                  <circle cx="15" cy="5" r="1" />
                  <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-black text-white">
                  Moto<span className="text-purple-400">Market</span>
                </span>
                <span className="text-[10px] text-slate-400 block -mt-1 font-medium">
                  Repuestos • Venta • Cambio
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              La plataforma líder en Colombia para comprar, vender y permutar repuestos, accesorios y partes mecánicas para motocicletas de todas las marcas con protección y asesoría IA.
            </p>

            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span>Cobertura en Bogotá, Medellín, Cali y todo el país</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-purple-400" />
                <span>Línea motera: +57 (601) 745-9000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                <span>contacto@motomarket.co</span>
              </div>
            </div>
          </div>

          {/* Col 3: Categorías */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Categorías
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveCategory('motor')} className="hover:text-purple-300 transition-colors">
                  Motor & Cilindrada
                </button>
              </li>
              <li>
                <button onClick={() => setActiveCategory('frenos')} className="hover:text-purple-300 transition-colors">
                  Frenos & Discos
                </button>
              </li>
              <li>
                <button onClick={() => setActiveCategory('transmision')} className="hover:text-purple-300 transition-colors">
                  Kits de Arrastre
                </button>
              </li>
              <li>
                <button onClick={() => setActiveCategory('suspension')} className="hover:text-purple-300 transition-colors">
                  Suspensión & Monoshock
                </button>
              </li>
              <li>
                <button onClick={() => setActiveCategory('electrico')} className="hover:text-purple-300 transition-colors">
                  Eléctrico & Farolas LED
                </button>
              </li>
              <li>
                <button onClick={() => setActiveCategory('accesorios')} className="hover:text-purple-300 transition-colors">
                  Cascos & Accesorios
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Venta y Permuta */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Venta y Cambio
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('venta')} className="hover:text-purple-300 transition-colors">
                  Catálogo de repuestos en venta
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('cambio')} className="hover:text-purple-300 transition-colors">
                  Repuestos disponibles para cambio
                </button>
              </li>
              <li>
                <button onClick={() => setIsGuidesModalOpen(true)} className="hover:text-purple-300 transition-colors">
                  Guía de permuta segura
                </button>
              </li>
              <li>
                <button onClick={() => setIsAiModalOpen(true)} className="hover:text-purple-300 transition-colors">
                  Consultar al Asistente IA
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Seguridad & Garantía */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Garantía Biker
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Pago seguro contra entrega o transferencia protegida</span>
              </div>
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Despacho el mismo día con número de guía</span>
              </div>
              <div className="flex items-start gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Validación de compatibilidad con IA</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright and legal */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <div className="flex items-center gap-1">
            <span>© 2026 MotoMarket Colombia. Todos los derechos reservados. Hecho con pasión biker</span>
            <Heart className="w-3 h-3 text-purple-500 inline fill-purple-500" />
          </div>

          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Términos de servicio</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacidad de datos</span>
            <span className="hover:text-slate-400 cursor-pointer">Políticas de garantía</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
