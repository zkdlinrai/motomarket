import React from 'react';
import { MapPin, Star, RefreshCw, ShoppingCart, ArrowRight } from 'lucide-react';
import { formatPrice } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { setSelectedProductForDetail, setSelectedProductForSwap } = useProducts();

  const isSale = product.type === 'venta';

  const handleQuickAction = (e) => {
    e.stopPropagation();
    if (isSale) {
      addToCart(product, 1);
    } else {
      setSelectedProductForSwap(product);
    }
  };

  return (
    <div 
      onClick={() => setSelectedProductForDetail(product)}
      className="bg-white rounded-2xl border border-slate-200/90 hover:border-purple-300 p-3.5 flex flex-col justify-between card-hover-shadow cursor-pointer relative group transition-all"
    >
      {/* Top Tag Badge */}
      <div className="flex items-center justify-between w-full mb-2">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wide uppercase ${
            isSale
              ? 'bg-purple-600 text-white'
              : 'bg-emerald-500 text-white'
          }`}
        >
          {isSale ? 'Venta' : 'Cambio'}
        </span>

        {product.isNewListing && (
          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            Nuevo
          </span>
        )}
      </div>

      {/* Product Image */}
      <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center p-2 mb-3">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-grow">
        <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-1">
          {product.title}
        </h3>

        {/* Price or Exchange Notice */}
        <div className="mt-1 mb-2">
          {isSale ? (
            <span className="text-base sm:text-lg font-black text-slate-900">
              {formatPrice(product.price)}
            </span>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Intercambio</span>
            </div>
          )}
        </div>

        {/* Location and Rating info */}
        <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate max-w-[90px]">{product.city}</span>
          </div>

          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
            <span className="font-semibold text-slate-700">{product.rating}</span>
            <span className="text-[10px] text-slate-400">({product.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Action Buttons: "Ver detalle" and Quick Add */}
      <div className="mt-3.5 pt-1 flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProductForDetail(product);
          }}
          className="flex-1 py-1.5 px-3 rounded-lg border border-purple-600 text-purple-700 hover:bg-purple-600 hover:text-white font-semibold text-xs transition-colors text-center"
        >
          Ver detalle
        </button>

        {isSale ? (
          <button
            type="button"
            onClick={handleQuickAction}
            className="p-1.5 rounded-lg bg-purple-100 hover:bg-purple-600 text-purple-700 hover:text-white transition-colors"
            title="Añadir al carrito"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleQuickAction}
            className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-600 text-emerald-700 hover:text-white transition-colors"
            title="Proponer cambio"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}
