import React, { useState } from 'react';
import { X, MapPin, Star, ShieldCheck, RefreshCw, ShoppingCart, Check, Phone, MessageCircle } from 'lucide-react';
import { formatPrice } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';

export default function ProductDetailModal() {
  const { selectedProductForDetail, setSelectedProductForDetail, setSelectedProductForSwap } = useProducts();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!selectedProductForDetail) return null;
  const product = selectedProductForDetail;
  const isSale = product.type === 'venta';

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleOpenSwap = () => {
    setSelectedProductForDetail(null);
    setSelectedProductForSwap(product);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-purple-200 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductForDetail(null)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          
          {/* Left: Product Image & Badge */}
          <div className="md:col-span-5 bg-slate-50 p-6 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-slate-100">
            <span
              className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-xs ${
                isSale ? 'bg-purple-600 text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              {isSale ? 'Venta' : 'Cambio'}
            </span>

            <div className="w-full h-56 sm:h-64 flex items-center justify-center p-4">
              <img
                src={product.image}
                alt={product.title}
                className="max-h-full max-w-full object-contain drop-shadow-md"
              />
            </div>

            <div className="mt-2 text-center text-xs text-slate-500 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Garantía de originalidad MotoMarket</span>
            </div>
          </div>

          {/* Right: Info & Actions */}
          <div className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="uppercase font-bold tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md">
                  {product.category}
                </span>

                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-slate-800">{product.rating}</span>
                  <span>({product.reviewsCount} opiniones)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mb-2">
                {product.title}
              </h2>

              {/* Location & Condition */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-purple-600" />
                  <strong className="text-slate-700">{product.city}</strong>
                </span>
                <span>•</span>
                <span>Estado: <strong className="text-slate-700">{product.condition}</strong></span>
              </div>

              {/* Price / Swap info box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 mb-4">
                {isSale ? (
                  <div>
                    <span className="text-xs text-slate-500 font-medium">Precio de venta:</span>
                    <div className="text-2xl sm:text-3xl font-black text-purple-700">
                      {formatPrice(product.price)}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mb-1">
                      <RefreshCw className="w-4 h-4" />
                      <span>Disponible para cambio / permuta</span>
                    </div>
                    <p className="text-xs text-slate-700">
                      <strong className="text-slate-900">Interesa a cambio:</strong> {product.tradeFor}
                    </p>
                  </div>
                )}
              </div>

              {/* Compatible Bikes */}
              {product.compatibleBikes && product.compatibleBikes.length > 0 && (
                <div className="mb-4">
                  <span className="text-xs font-bold text-slate-700 block mb-1.5">
                    Motos compatibles verificadas:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.compatibleBikes.map(bike => (
                      <span key={bike} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                        {bike}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-5">
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  Descripción del repuesto:
                </span>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-h-28 overflow-y-auto">
                  {product.description}
                </p>
              </div>

              {/* Seller snapshot */}
              {product.seller && (
                <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center justify-between text-xs mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">
                      {product.seller.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{product.seller.name}</h4>
                      <span className="text-[10px] text-slate-500">Vendedor en {product.seller.city} • ★ {product.seller.rating}</span>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/?text=Hola%20${encodeURIComponent(product.seller.name)},%20te%20escribo%20desde%20MotoMarket%20por%20tu%20anuncio:%20${encodeURIComponent(product.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 font-semibold"
                    title="Contactar vendedor por WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat</span>
                  </a>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-slate-100">
              {isSale ? (
                <div className="flex items-center gap-3">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-2 text-xs font-bold text-slate-900 min-w-[32px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>¡Agregado al carrito!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>Añadir al carrito ({formatPrice(product.price * quantity)})</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleOpenSwap}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Proponer intercambio / permuta</span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
