import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, CreditCard, Banknote, Smartphone, PackageCheck, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatPrice } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen, cartItems, subtotal, discountAmount, shippingFee, total, completeCheckout } = useCart();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    fullName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    city: currentUser?.city || 'Bogotá',
    address: 'Carrera 15 # 85-32, Apto 402',
    bikeModel: currentUser?.bikeModel || 'Yamaha FZ 2.0',
    notes: 'Por favor llamar antes de entregar',
    paymentMethod: 'contra-entrega' // 'contra-entrega' | 'nequi' | 'tarjeta' | 'pse'
  });

  const [completedOrder, setCompletedOrder] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const order = completeCheckout(formData);
    setCompletedOrder(order);

    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleCopyId = () => {
    if (completedOrder?.orderId) {
      navigator.clipboard.writeText(completedOrder.orderId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-purple-200 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/50 flex items-center justify-center border border-purple-400/40">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Finalizar Compra Segura</h3>
              <p className="text-xs text-purple-200">Envíos asegurados a todo el territorio nacional</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsCheckoutOpen(false);
              setCompletedOrder(null);
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Order Completed Ticket View */}
        {completedOrder ? (
          <div className="p-7 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <PackageCheck className="w-9 h-9" />
            </div>

            <h4 className="text-xl sm:text-2xl font-black text-slate-900">
              ¡Pedido confirmado con éxito!
            </h4>

            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Hemos recibido tu orden y los vendedores ya están preparando el despacho de tus repuestos.
            </p>

            {/* Receipt Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Número de seguimiento:</span>
                <div className="flex items-center gap-1.5 font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  <span>{completedOrder.orderId}</span>
                  <button onClick={handleCopyId} className="hover:text-purple-900" title="Copiar ID">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {copiedId && <span className="text-[10px] text-emerald-600 font-sans">¡Copiado!</span>}
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Destinatario:</span>
                <span className="font-semibold text-slate-800">{completedOrder.customer.fullName} ({completedOrder.customer.city})</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Dirección:</span>
                <span className="font-semibold text-slate-800">{completedOrder.customer.address}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Método de pago:</span>
                <span className="font-semibold uppercase text-slate-800">{completedOrder.customer.paymentMethod}</span>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-sm">
                <span>Total pagado:</span>
                <span className="text-purple-700">{formatPrice(completedOrder.total)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCheckoutOpen(false);
                setCompletedOrder(null);
              }}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm transition-colors"
            >
              Volver a la tienda
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            
            {/* Customer Information */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Datos de entrega
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nombre y apellido *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Ej. Carlos Mendoza"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Teléfono celular *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ej. 312 458 9912"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Ciudad de entrega *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
                  >
                    {['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga', 'Manizales', 'Pereira'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Dirección exacta *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Calle, carrera, número, apto..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Indicaciones de entrega</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ej. Dejar en portería o timbre 402"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Método de pago
              </h4>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'contra-entrega' })}
                  className={`p-3 rounded-xl border flex flex-col items-start gap-1.5 text-left transition-all ${
                    formData.paymentMethod === 'contra-entrega'
                      ? 'bg-purple-50 border-purple-600 ring-2 ring-purple-600/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                    <Banknote className="w-4 h-4 text-purple-600" />
                    <span>Contra entrega</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Pagas en efectivo al recibir</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'nequi' })}
                  className={`p-3 rounded-xl border flex flex-col items-start gap-1.5 text-left transition-all ${
                    formData.paymentMethod === 'nequi'
                      ? 'bg-purple-50 border-purple-600 ring-2 ring-purple-600/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                    <Smartphone className="w-4 h-4 text-purple-600" />
                    <span>Nequi / Daviplata</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Transferencia al instante</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'tarjeta' })}
                  className={`p-3 rounded-xl border flex flex-col items-start gap-1.5 text-left transition-all ${
                    formData.paymentMethod === 'tarjeta'
                      ? 'bg-purple-50 border-purple-600 ring-2 ring-purple-600/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                    <CreditCard className="w-4 h-4 text-purple-600" />
                    <span>Tarjeta Crédito/Débito</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Visa, Mastercard, etc.</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'pse' })}
                  className={`p-3 rounded-xl border flex flex-col items-start gap-1.5 text-left transition-all ${
                    formData.paymentMethod === 'pse'
                      ? 'bg-purple-50 border-purple-600 ring-2 ring-purple-600/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span>PSE Bancos</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Débito cuenta bancaria</span>
                </button>
              </div>
            </div>

            {/* Total summary */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{cartItems.length} productos en la orden:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Descuento aplicado:</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Costo de envío:</span>
                <span>{shippingFee === 0 ? 'Gratis' : formatPrice(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                <span>Total a pagar:</span>
                <span className="text-purple-700">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Confirmar pedido ({formatPrice(total)})</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
