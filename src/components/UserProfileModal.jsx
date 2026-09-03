import React from 'react';
import { X, User, Phone, MapPin, Bike, Calendar, LogOut, Package, RefreshCw, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import { formatDate } from '../utils/formatters';

export default function UserProfileModal() {
  const { currentUser, isProfileModalOpen, setIsProfileModalOpen, logout } = useAuth();
  const { products, swapProposals, setSelectedProductForDetail } = useProducts();

  if (!isProfileModalOpen || !currentUser) return null;

  // Filter listings by current user
  const userProducts = products.filter(
    p => p.seller?.id === currentUser.id || p.seller?.name === currentUser.name
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-purple-200 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-purple-900 via-purple-700 to-indigo-900 relative">
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card Info */}
        <div className="px-6 pb-6 pt-0 relative">
          
          {/* Avatar */}
          <div className="-mt-14 mb-3 flex justify-between items-end">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover bg-white"
            />
            <button
              onClick={logout}
              className="py-1.5 px-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar sesión</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-slate-900">{currentUser.name}</h3>
            <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {currentUser.ratings || '5.0'}
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-4">{currentUser.email}</p>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 mb-5">
            <div className="flex items-center gap-2">
              <Bike className="w-4 h-4 text-purple-600 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block">Motocicleta:</span>
                <strong className="truncate block">{currentUser.bikeModel || 'No registrada'}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block">Ciudad:</span>
                <strong className="truncate block">{currentUser.city || 'Bogotá'}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-purple-600 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block">Teléfono / WhatsApp:</span>
                <strong className="truncate block">{currentUser.phone}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block">Miembro desde:</span>
                <strong className="truncate block">{formatDate(currentUser.joinedDate || '2026-01-01')}</strong>
              </div>
            </div>
          </div>

          {/* My Published Listings */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-purple-600" />
              <span>Mis repuestos publicados ({userProducts.length})</span>
            </h4>

            {userProducts.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                Aún no has publicado repuestos. ¡Usa el botón "Publicar" para comenzar a vender o cambiar!
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {userProducts.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setIsProfileModalOpen(false);
                      setSelectedProductForDetail(p);
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 flex items-center justify-between cursor-pointer group bg-white"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={p.image} alt={p.title} className="w-9 h-9 object-contain rounded-lg bg-slate-50 p-0.5 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-800 group-hover:text-purple-700 truncate block">
                          {p.title}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
                          {p.type === 'venta' ? 'En venta' : 'Para cambio'}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-purple-700">
                      {p.type === 'venta' ? `$${p.price.toLocaleString('es-CO')}` : 'Permuta'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
