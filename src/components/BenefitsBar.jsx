import React from 'react';
import { ShieldCheck, RefreshCw, Truck, Users } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';

export default function BenefitsBar() {
  const { setActiveTab, setIsForumModalOpen } = useProducts();

  const benefits = [
    {
      id: 1,
      title: 'Compra segura',
      desc: 'Protección en cada transacción',
      icon: ShieldCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100/70',
      onClick: () => {}
    },
    {
      id: 2,
      title: 'Venta y cambio',
      desc: 'Publica o intercambia repuestos',
      icon: RefreshCw,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100/70',
      onClick: () => setActiveTab('cambio')
    },
    {
      id: 3,
      title: 'Envíos a todo el país',
      desc: 'Rápido y confiable',
      icon: Truck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100/70',
      onClick: () => {}
    },
    {
      id: 4,
      title: 'Comunidad biker',
      desc: 'Consejos, tips y más',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100/70',
      onClick: () => setIsForumModalOpen(true)
    }
  ];

  return (
    <section className="bg-white border-b border-slate-200/80 py-4 sm:py-5 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {benefits.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={item.onClick}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 hover:bg-purple-50/60 border border-slate-100 hover:border-purple-200 transition-all cursor-pointer group"
              >
                <div className={`w-10 h-10 rounded-xl ${item.bgColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
