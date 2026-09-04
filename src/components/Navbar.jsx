import React, { useState } from 'react';
import { 
  Home, 
  Wrench, 
  Tag, 
  RefreshCw, 
  MessageSquare, 
  User, 
  Bell, 
  ShoppingCart, 
  PlusCircle, 
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';

export default function Navbar() {
  const { currentUser, isAdmin, openAuthModal, setIsProfileModalOpen, setIsAdminPanelOpen } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const { 
    setActiveTab, 
    setActiveCategory, 
    setSearchQuery, 
    setIsPublishModalOpen,
    setIsForumModalOpen 
  } = useProducts();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, title: 'Oferta de intercambio', text: 'Alguien propuso un cambio por tu Pastas de freno', time: 'Hace 10 min', unread: true },
    { id: 2, title: 'Envío en camino', text: 'Tu pedido BP-849201 ha sido despachado', time: 'Hace 1 hora', unread: false },
    { id: 3, title: 'Nuevo cupón', text: 'Usa BIKER10 para obtener 10% en tu próxima compra', time: 'Hoy', unread: false }
  ]);

  const handleNavClick = (tab, category = null) => {
    setActiveTab(tab);
    if (category !== undefined) setActiveCategory(category);
    setSearchQuery('');
    window.scrollTo({ top: 480, behavior: 'smooth' });
  };

  const resetToHome = () => {
    setActiveTab('venta');
    setActiveCategory(null);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#090a10]/95 backdrop-blur-md border-b border-purple-900/30 text-white shadow-xl shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo Brand with Official BikerParts Image */}
          <div 
            onClick={resetToHome}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <img
              src="/logo.png"
              alt="BikerParts Logo"
              className="h-10 md:h-13 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-0.5">
                Biker<span className="text-purple-400">Parts</span>
              </span>
              <span className="text-[10px] md:text-xs text-slate-300 font-medium tracking-wide">
                Repuestos • Venta • Cambio
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={resetToHome}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-purple-950/40 transition-colors"
            >
              <Home className="w-4 h-4 text-purple-400" />
              <span>Inicio</span>
            </button>

            <button
              onClick={() => handleNavClick('venta', null)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-purple-950/40 transition-colors"
            >
              <Wrench className="w-4 h-4 text-purple-400" />
              <span>Repuestos</span>
            </button>

            <button
              onClick={() => handleNavClick('venta')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-purple-950/40 transition-colors"
            >
              <Tag className="w-4 h-4 text-purple-400" />
              <span>Venta</span>
            </button>

            <button
              onClick={() => handleNavClick('cambio')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-purple-950/40 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              <span>Cambio</span>
            </button>

            <button
              onClick={() => setIsForumModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-purple-950/40 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span>Foro</span>
            </button>

            {currentUser ? (
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-purple-300 hover:text-white hover:bg-purple-900/30 transition-colors"
              >
                <User className="w-4 h-4 text-purple-400" />
                <span className="max-w-[110px] truncate">{currentUser.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-purple-950/40 transition-colors"
              >
                <User className="w-4 h-4 text-purple-400" />
                <span>Mi cuenta</span>
              </button>
            )}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 md:gap-3">
            
            {/* Master Admin Button (Visible only to Admin) */}
            {isAdmin && (
              <button
                onClick={() => setIsAdminPanelOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 text-slate-950 shadow-lg shadow-amber-400/20 transition-all border border-amber-200"
                title="Abrir Panel de Control Maestro"
              >
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                <span>👑 Panel Admin</span>
              </button>
            )}

            {/* Quick Publish Button */}
            <button
              onClick={() => setIsPublishModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/25 transition-all transform hover:scale-105"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Publicar</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Notificaciones"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-purple-500 rounded-full ring-2 ring-[#090a10]" />
              </button>

              {/* Notification Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-[#12131d] border border-purple-900/40 rounded-2xl shadow-2xl p-3 z-50 text-slate-100 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-purple-900/30 px-1">
                    <span className="font-semibold text-sm">Notificaciones</span>
                    <span className="text-[11px] text-purple-400 hover:underline cursor-pointer">Marcar leídas</span>
                  </div>
                  <div className="divide-y divide-white/5 max-h-64 overflow-y-auto mt-1">
                    {notifications.map(item => (
                      <div key={item.id} className={`p-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-xs ${item.unread ? 'bg-purple-950/20' : ''}`}>
                        <div className="flex items-center justify-between font-medium text-slate-200">
                          <span>{item.title}</span>
                          <span className="text-[10px] text-slate-400">{item.time}</span>
                        </div>
                        <p className="text-slate-400 mt-1 leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart Button with Dynamic Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full text-slate-200 hover:text-white hover:bg-white/10 transition-colors group"
              title="Carrito de compras"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-purple-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#090a10] shadow-md shadow-purple-600/50 animate-bounce">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Profile Avatar / Login Button */}
            {currentUser ? (
              <div 
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2 pl-1 cursor-pointer group"
                title={isAdmin ? "Administrador Maestro" : "Ver perfil de motero"}
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className={`w-8 h-8 md:w-9 md:h-9 rounded-full ring-2 transition-all object-cover ${
                    isAdmin ? 'ring-amber-400 p-0.5 bg-white' : 'ring-purple-500/70'
                  }`}
                />
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="p-1.5 md:px-3 md:py-1.5 rounded-xl text-xs md:text-sm font-medium border border-purple-500/40 text-purple-300 hover:bg-purple-600 hover:text-white transition-all flex items-center gap-1.5"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Ingresar</span>
              </button>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}
