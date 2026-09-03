import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Check } from 'lucide-react';
import { formatPrice } from '../utils/formatters';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    couponCode,
    setCouponCode,
    appliedDiscount,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen
  } = useCart();

  const [couponFeedback, setCouponFeedback] = useState(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponFeedback(res);
    setTimeout(() => setCouponFeedback(null), 4000);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-slideLeft">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-purple-300" />
            <h3 className="font-bold text-base">Carrito de compras</h3>
            <span className="bg-purple-600/60 text-purple-100 text-xs px-2 py-0.5 rounded-full font-bold">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} ítems
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-purple-50 px-4 py-2 border-b border-purple-100 text-[11px] text-purple-900 flex items-center justify-between">
          {subtotal >= 150000 ? (
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>¡Felicidades! Tienes envío GRATIS incluido</span>
            </div>
          ) : (
            <span>
              Agrega <strong>{formatPrice(150000 - subtotal)}</strong> más para envío <strong>GRATIS</strong>
            </span>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
          {cartItems.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Tu carrito está vacío</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mb-5">
                Explora el catálogo de repuestos para motos y añade lo que necesites.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="py-2 px-4 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors"
              >
                Explorar repuestos
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="py-3.5 flex gap-3 items-start group">
                <div className="w-16 h-16 rounded-xl bg-slate-50 p-1.5 border border-slate-100 flex items-center justify-center shrink-0">
                  <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 leading-snug truncate">
                    {item.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 block mb-1">
                    {item.city}
                  </span>
                  <div className="font-extrabold text-xs sm:text-sm text-purple-700">
                    {formatPrice(item.price)}
                  </div>

                  {/* Quantity and Remove Controls */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold text-slate-900 min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                      title="Eliminar del carrito"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with summary and coupon */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
            
            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Cupón: BIKER10"
                  className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold uppercase focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition-colors shrink-0"
              >
                Aplicar
              </button>
            </form>

            {/* Coupon Feedback or applied badge */}
            {couponFeedback && (
              <div className={`p-2 rounded-lg text-xs font-medium ${
                couponFeedback.success ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {couponFeedback.message}
              </div>
            )}

            {appliedDiscount && (
              <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 p-2 rounded-lg border border-emerald-200">
                <span>Cupón: <strong>{appliedDiscount.code}</strong> ({appliedDiscount.label})</span>
                <button onClick={removeCoupon} className="text-red-500 hover:underline font-bold text-[11px]">
                  Quitar
                </button>
              </div>
            )}

            {/* Cost Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Descuento aplicado</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Costo de envío nacional</span>
                <span className="font-semibold text-slate-900">
                  {shippingFee === 0 ? <strong className="text-emerald-600">¡GRATIS!</strong> : formatPrice(shippingFee)}
                </span>
              </div>

              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total estimado</span>
                <span className="text-base text-purple-700">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-700/30 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Proceder al pago seguro</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Transacción protegida por MotoMarket Pay</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
