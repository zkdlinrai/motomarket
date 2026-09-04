import React, { useState } from 'react';
import { 
  X, 
  Package, 
  Tag, 
  ShoppingBag, 
  RefreshCw, 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  AlertCircle, 
  DollarSign, 
  Users, 
  Truck, 
  ShieldCheck, 
  Search,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { formatPrice, formatDate } from '../utils/formatters';

export default function AdminPanelModal() {
  const { isAdmin, isAdminPanelOpen, setIsAdminPanelOpen, users } = useAuth();
  const { 
    products, 
    deleteProduct, 
    openEditModal, 
    setIsPublishModalOpen,
    swapProposals,
    updateSwapStatus,
    deleteSwapProposal 
  } = useProducts();
  const { 
    coupons, 
    addCoupon, 
    deleteCoupon, 
    toggleCouponStatus, 
    orders, 
    updateOrderStatus,
    deleteOrder 
  } = useCart();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'coupons' | 'orders' | 'swaps' | 'metrics'
  const [productSearch, setProductSearch] = useState('');

  // New Coupon Form state
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState('percent');
  const [newCouponValue, setNewCouponValue] = useState(15);
  const [newCouponLabel, setNewCouponLabel] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isAdminPanelOpen || !isAdmin) return null;

  // Filter products in admin
  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.city.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Metrics calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const activeProductsCount = products.length;
  const activeCouponsCount = coupons.filter(c => c.active).length;
  const pendingOrdersCount = orders.filter(o => o.status !== 'Entregado' && o.status !== 'Cancelado').length;

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    try {
      addCoupon({
        code: newCouponCode,
        type: newCouponType,
        percent: newCouponType === 'percent' ? Number(newCouponValue) : 0,
        freeShipping: newCouponType === 'shipping',
        label: newCouponLabel.trim() || (newCouponType === 'shipping' ? 'Envío gratis asegurado' : `${newCouponValue}% de descuento`)
      });

      setCouponSuccess(`¡Cupón "${newCouponCode.toUpperCase()}" creado exitosamente!`);
      setNewCouponCode('');
      setNewCouponLabel('');
      setTimeout(() => setCouponSuccess(''), 3000);
    } catch (err) {
      setCouponError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-[#0d0e17] rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl border border-purple-500/50 text-white flex flex-col h-[650px] max-h-[92vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Admin Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-950 via-[#18122c] to-[#0d0e17] border-b border-purple-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-white">Panel Administrador Maestro</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-black uppercase tracking-wider">
                  Acceso Total
                </span>
              </div>
              <p className="text-xs text-purple-200">
                Gestión centralizada de catálogo, cupones de descuento, órdenes y usuarios de BikerParts
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminPanelOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-[#121320] border-b border-purple-900/40 px-4 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-4 font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-purple-500 text-purple-300 bg-purple-950/30'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Productos ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`py-3 px-4 font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'coupons'
                ? 'border-purple-500 text-purple-300 bg-purple-950/30'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Cupones ({coupons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-purple-500 text-purple-300 bg-purple-950/30'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pedidos & Facturación ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('swaps')}
            className={`py-3 px-4 font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'swaps'
                ? 'border-purple-500 text-purple-300 bg-purple-950/30'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Permutas ({swapProposals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('metrics')}
            className={`py-3 px-4 font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'metrics'
                ? 'border-purple-500 text-purple-300 bg-purple-950/30'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Métricas & Dashboard</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0a0b12]">
          
          {/* TAB 1: PRODUCT MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Buscar repuesto por nombre o ciudad..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#161726] border border-purple-900/50 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(true)}
                  className="w-full sm:w-auto py-2 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Agregar Nuevo Repuesto</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="border border-purple-900/40 rounded-2xl overflow-hidden bg-[#121320]">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#1a1b2e] text-[11px] uppercase tracking-wider text-purple-300 font-extrabold">
                    <tr>
                      <th className="py-3 px-3">Repuesto</th>
                      <th className="py-3 px-3">Tipo</th>
                      <th className="py-3 px-3">Precio / Oferta</th>
                      <th className="py-3 px-3">Ciudad</th>
                      <th className="py-3 px-3">Stock</th>
                      <th className="py-3 px-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-900/20">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-purple-950/20 transition-colors">
                        <td className="py-3 px-3 flex items-center gap-2.5">
                          <img src={p.image} alt={p.title} className="w-10 h-10 rounded-lg object-contain bg-white/5 p-1 shrink-0" />
                          <div className="min-w-0">
                            <span className="font-bold text-white block truncate max-w-[200px]">{p.title}</span>
                            <span className="text-[10px] text-purple-400 capitalize">{p.category}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            p.type === 'venta' ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' : 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                          }`}>
                            {p.type}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-white">
                          {p.type === 'venta' ? formatPrice(p.price) : <span className="text-emerald-400 text-[11px]">Permuta</span>}
                        </td>
                        <td className="py-3 px-3 text-slate-400">{p.city}</td>
                        <td className="py-3 px-3">{p.stock || 1} uds</td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditModal(p)}
                              className="p-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white transition-colors"
                              title="Editar producto"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`¿Eliminar "${p.title}"?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white transition-colors"
                              title="Eliminar producto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: COUPON MANAGEMENT */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              {/* Add Coupon Form */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#141524] border border-purple-900/50 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-purple-400" />
                  <span>Crear Nuevo Cupón de Descuento</span>
                </h4>

                {couponError && (
                  <div className="p-2.5 rounded-xl bg-red-900/30 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{couponError}</span>
                  </div>
                )}

                {couponSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-900/30 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>{couponSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Código del cupón *</label>
                    <input
                      type="text"
                      required
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                      placeholder="Ej. BIKER25"
                      className="w-full p-2.5 rounded-xl bg-[#0e0f18] border border-purple-900/50 text-xs font-bold uppercase text-white focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Tipo de beneficio</label>
                    <select
                      value={newCouponType}
                      onChange={(e) => setNewCouponType(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#0e0f18] border border-purple-900/50 text-xs text-white focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    >
                      <option value="percent">% Porcentaje de descuento</option>
                      <option value="shipping">Envío Nacional Gratis</option>
                    </select>
                  </div>

                  {newCouponType === 'percent' && (
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-1">% de descuento</label>
                      <input
                        type="number"
                        min="1"
                        max="90"
                        value={newCouponValue}
                        onChange={(e) => setNewCouponValue(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#0e0f18] border border-purple-900/50 text-xs font-bold text-white focus:ring-1 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-600/30"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Guardar Cupón</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Existing Coupons Table */}
              <div className="border border-purple-900/40 rounded-2xl overflow-hidden bg-[#121320]">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#1a1b2e] text-[11px] uppercase tracking-wider text-purple-300 font-extrabold">
                    <tr>
                      <th className="py-3 px-4">Código</th>
                      <th className="py-3 px-4">Beneficio</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-900/20">
                    {coupons.map((c) => (
                      <tr key={c.code} className="hover:bg-purple-950/20 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-white text-sm">
                          {c.code}
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {c.label || (c.freeShipping ? 'Envío gratis' : `${c.percent}% OFF`)}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => toggleCouponStatus(c.code)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              c.active 
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-slate-700 text-slate-400'
                            }`}
                          >
                            {c.active ? 'Activo' : 'Inactivo (Clic para activar)'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`¿Eliminar cupón "${c.code}"?`)) {
                                deleteCoupon(c.code);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white transition-colors"
                            title="Eliminar cupón"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS MANAGEMENT & BILLING */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No hay órdenes registradas aún.
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.orderId}
                      className="p-4 rounded-2xl bg-[#141525] border border-purple-900/40 space-y-3 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-900/30 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-purple-300">{order.orderId}</span>
                          <span className="text-slate-400">• {formatDate(order.date)}</span>
                        </div>

                        {/* Status selector */}
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-[11px]">Estado:</span>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                            className="bg-[#0e0f18] border border-purple-900/60 rounded-lg px-2 py-1 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                          >
                            <option value="En preparación">En preparación</option>
                            <option value="Despachado">Despachado / En camino</option>
                            <option value="Entregado">Entregado</option>
                            <option value="Cancelado">Cancelado</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`¿Eliminar orden "${order.orderId}"?`)) {
                                deleteOrder(order.orderId);
                              }
                            }}
                            className="p-1 rounded text-slate-500 hover:text-red-400"
                            title="Eliminar orden"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Customer and Delivery info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#0d0e17] p-3 rounded-xl border border-purple-900/20">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold">Cliente:</span>
                          <strong className="text-white block">{order.customer?.fullName}</strong>
                          <span className="text-slate-400 text-[11px] block">{order.customer?.phone}</span>
                          <span className="text-slate-400 text-[11px] block">{order.customer?.email}</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold">Destino:</span>
                          <strong className="text-white block">{order.customer?.city}</strong>
                          <span className="text-slate-400 text-[11px] block">{order.customer?.address}</span>
                          {order.customer?.notes && (
                            <span className="text-purple-300 text-[10px] block mt-1">Nota: {order.customer.notes}</span>
                          )}
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold">Método de Pago:</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-600/30 text-purple-300 inline-block mb-1">
                            {order.customer?.paymentMethod}
                          </span>

                          {/* Specific payment details */}
                          {order.customer?.paymentDetails && (
                            <div className="text-[10px] text-slate-300 space-y-0.5 mt-0.5">
                              {order.customer.paymentDetails.cardLast4 && (
                                <p>Tarjeta: •••• {order.customer.paymentDetails.cardLast4} ({order.customer.paymentDetails.cardInstallments} cuota/s)</p>
                              )}
                              {order.customer.paymentDetails.nequiPhone && (
                                <p>Nequi: {order.customer.paymentDetails.nequiPhone} (CC: {order.customer.paymentDetails.nequiIdNumber})</p>
                              )}
                              {order.customer.paymentDetails.pseBank && (
                                <p>PSE Banco: {order.customer.paymentDetails.pseBank} ({order.customer.paymentDetails.pseDocNumber})</p>
                              )}
                              {order.customer.paymentDetails.cashAmount && (
                                <p>Contra entrega: Paga con {order.customer.paymentDetails.cashAmount} (Doc receptor: {order.customer.paymentDetails.receiverIdNumber})</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Items and Total */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                          <span>{order.items?.length} productos</span>
                          <span>• Total facturado:</span>
                        </div>
                        <span className="text-base font-black text-purple-400">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SWAPS / PERMUTAS */}
          {activeTab === 'swaps' && (
            <div className="space-y-3">
              {swapProposals.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No hay propuestas de intercambio registradas.
                </div>
              ) : (
                swapProposals.map((swap) => (
                  <div
                    key={swap.id}
                    className="p-4 rounded-2xl bg-[#141525] border border-purple-900/40 text-xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between border-b border-purple-900/30 pb-2">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-white">Propuesta por: {swap.targetProductTitle}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <select
                          value={swap.status}
                          onChange={(e) => updateSwapStatus(swap.id, e.target.value)}
                          className="bg-[#0e0f18] border border-purple-900/60 rounded-lg px-2 py-1 text-xs text-white"
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="Contactado">Contactado</option>
                          <option value="Aprobado">Aprobado</option>
                          <option value="Rechazado">Rechazado</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => deleteSwapProposal(swap.id)}
                          className="text-slate-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Pieza ofrecida a cambio:</span>
                        <strong className="text-emerald-400 text-sm">{swap.offeredPart}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Motero interesado:</span>
                        <span>{swap.proposerName} • {swap.proposerCity} • Tel: {swap.proposerPhone}</span>
                      </div>
                    </div>

                    {swap.message && (
                      <p className="text-slate-400 bg-[#0d0e17] p-2.5 rounded-xl border border-purple-900/20 text-[11px]">
                        "{swap.message}"
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 5: GENERAL METRICS */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/60 to-[#15122b] border border-purple-800/40">
                  <span className="text-slate-400 text-xs block mb-1">Ventas Totales</span>
                  <span className="text-xl sm:text-2xl font-black text-purple-400">
                    {formatPrice(totalRevenue)}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#141525] border border-purple-900/40">
                  <span className="text-slate-400 text-xs block mb-1">Repuestos en Catálogo</span>
                  <span className="text-xl sm:text-2xl font-black text-white">
                    {activeProductsCount}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#141525] border border-purple-900/40">
                  <span className="text-slate-400 text-xs block mb-1">Pedidos Activos</span>
                  <span className="text-xl sm:text-2xl font-black text-amber-400">
                    {pendingOrdersCount}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#141525] border border-purple-900/40">
                  <span className="text-slate-400 text-xs block mb-1">Cupones Activos</span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-400">
                    {activeCouponsCount}
                  </span>
                </div>

              </div>

              {/* Quick Actions */}
              <div className="p-5 rounded-2xl bg-[#121322] border border-purple-900/40">
                <h4 className="font-bold text-sm text-white mb-3">Atajos Rápidos de Administración</h4>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => {
                      setActiveTab('products');
                      setIsPublishModalOpen(true);
                    }}
                    className="py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
                  >
                    + Publicar repuesto oficial
                  </button>
                  <button
                    onClick={() => setActiveTab('coupons')}
                    className="py-2 px-4 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-500/40 text-purple-300 font-bold text-xs"
                  >
                    + Crear cupón especial
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="py-2 px-4 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-500/40 text-purple-300 font-bold text-xs"
                  >
                    Ver historial de despachos
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
