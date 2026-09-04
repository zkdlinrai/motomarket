import React, { useState, useEffect } from 'react';
import { X, Save, Edit3, Trash2, AlertCircle, Check } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { CATEGORIES } from '../data/categories';

export default function EditProductModal() {
  const { editingProduct, isEditModalOpen, closeEditModal, updateProduct, deleteProduct } = useProducts();

  const [formData, setFormData] = useState({
    title: '',
    type: 'venta',
    category: 'motor',
    price: 0,
    tradeFor: '',
    city: '',
    condition: 'Nuevo',
    stock: 1,
    compatibleBikes: '',
    description: '',
    image: ''
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        title: editingProduct.title || '',
        type: editingProduct.type || 'venta',
        category: editingProduct.category || 'motor',
        price: editingProduct.price || 0,
        tradeFor: editingProduct.tradeFor || '',
        city: editingProduct.city || 'Bogotá',
        condition: editingProduct.condition || 'Nuevo',
        stock: editingProduct.stock || 1,
        compatibleBikes: Array.isArray(editingProduct.compatibleBikes) 
          ? editingProduct.compatibleBikes.join(', ') 
          : '',
        description: editingProduct.description || '',
        image: editingProduct.image || ''
      });
    }
  }, [editingProduct]);

  if (!isEditModalOpen || !editingProduct) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProduct(editingProduct.id, {
      ...formData,
      price: formData.type === 'venta' ? Number(formData.price) : 0,
      stock: Number(formData.stock),
      compatibleBikes: formData.compatibleBikes.split(',').map(b => b.trim()).filter(Boolean)
    });

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      closeEditModal();
    }, 1200);
  };

  const handleDelete = () => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar permanentemente "${editingProduct.title}"?`)) {
      deleteProduct(editingProduct.id);
      closeEditModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-purple-200 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/50 flex items-center justify-center border border-purple-400/40">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Modo Administrador: Editar Repuesto</h3>
              <p className="text-xs text-purple-200 truncate max-w-xs">{editingProduct.title}</p>
            </div>
          </div>
          <button
            onClick={closeEditModal}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {saved ? (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-slate-900">¡Repuesto actualizado con éxito!</h4>
            <p className="text-xs text-slate-500">Los cambios se han guardado en el catálogo general.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-3.5 max-h-[80vh] overflow-y-auto">
            
            {/* Title */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Título del repuesto *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            {/* Type, Category & City */}
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Modalidad</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="venta">Venta</option>
                  <option value="cambio">Cambio / Permuta</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Categoría</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Ciudad</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  {['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga', 'Manizales', 'Pereira'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price or Trade Requirement */}
            {formData.type === 'venta' ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Precio (COP $) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-purple-700 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Stock disponible</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">¿Qué busca a cambio? *</label>
                <input
                  type="text"
                  required
                  value={formData.tradeFor}
                  onChange={(e) => setFormData({ ...formData, tradeFor: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            )}

            {/* Condition & Compatible bikes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Estado</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="Nuevo">Nuevo</option>
                  <option value="Como nuevo">Como nuevo</option>
                  <option value="Usado - Buen estado">Usado - Buen estado</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Motos compatibles</label>
                <input
                  type="text"
                  value={formData.compatibleBikes}
                  onChange={(e) => setFormData({ ...formData, compatibleBikes: e.target.value })}
                  placeholder="Yamaha FZ, Pulsar NS200..."
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">URL de la imagen</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Descripción</label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleDelete}
                className="py-2.5 px-4 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar repuesto</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-700/30 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar cambios</span>
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
