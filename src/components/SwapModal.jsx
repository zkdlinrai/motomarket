import React, { useState } from 'react';
import { X, RefreshCw, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';

export default function SwapModal() {
  const { currentUser } = useAuth();
  const { selectedProductForSwap, setSelectedProductForSwap, proposeSwap } = useProducts();

  const [offeredPart, setOfferedPart] = useState('');
  const [proposalMessage, setProposalMessage] = useState('');
  const [proposerPhone, setProposerPhone] = useState(currentUser?.phone || '');
  const [proposerCity, setProposerCity] = useState(currentUser?.city || 'Bogotá');
  const [submitted, setSubmitted] = useState(false);

  if (!selectedProductForSwap) return null;
  const product = selectedProductForSwap;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!offeredPart.trim()) return;

    proposeSwap({
      targetProductId: product.id,
      targetProductTitle: product.title,
      targetSellerName: product.seller?.name || 'Vendedor MotoMarket',
      proposerName: currentUser?.name || 'Motero Interesado',
      proposerPhone: proposerPhone || '+57 300 000 0000',
      proposerCity,
      offeredPart: offeredPart.trim(),
      message: proposalMessage.trim()
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedProductForSwap(null);
      setOfferedPart('');
      setProposalMessage('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-emerald-200 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/50 flex items-center justify-center border border-emerald-300/40">
              <RefreshCw className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Proponer Intercambio / Permuta</h3>
              <p className="text-xs text-emerald-100">Acuerda un cambio directo entre moteros</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedProductForSwap(null)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-slate-900 mb-1">¡Propuesta enviada al dueño!</h4>
            <p className="text-xs text-slate-600 max-w-xs">
              El vendedor ({product.seller?.name}) recibirá tu oferta para coordinar el intercambio.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Target Product Summary */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center gap-3">
              <img src={product.image} alt={product.title} className="w-12 h-12 object-contain bg-white rounded-lg p-1" />
              <div className="min-w-0">
                <span className="text-[10px] text-emerald-800 uppercase font-extrabold block">Repuesto deseado</span>
                <h4 className="text-xs font-bold text-slate-900 truncate">{product.title}</h4>
                <p className="text-[11px] text-slate-500 truncate">
                  El dueño busca: <strong>{product.tradeFor || 'Abierto a ofertas'}</strong>
                </p>
              </div>
            </div>

            {/* Offered part */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                ¿Qué repuesto o accesorio ofreces a cambio? *
              </label>
              <input
                type="text"
                required
                value={offeredPart}
                onChange={(e) => setOfferedPart(e.target.value)}
                placeholder="Ej. Filtro de aire K&N o Casco talla L en perfecto estado"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tu ciudad de residencia *
                </label>
                <select
                  value={proposerCity}
                  onChange={(e) => setProposerCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  {['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga', 'Manizales', 'Pereira'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tu número de WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={proposerPhone}
                  onChange={(e) => setProposerPhone(e.target.value)}
                  placeholder="300 123 4567"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Mensaje o propuesta para el dueño
              </label>
              <textarea
                rows="3"
                value={proposalMessage}
                onChange={(e) => setProposalMessage(e.target.value)}
                placeholder="Describe el estado de tu pieza y propone un punto de encuentro o entrega..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>MotoMarket valida la reputación de ambas partes para un cambio transparente.</span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Enviar propuesta de intercambio</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
