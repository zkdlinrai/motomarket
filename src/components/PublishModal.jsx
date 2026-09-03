import React, { useState } from 'react';
import { X, PlusCircle, Image, Check, AlertCircle, RefreshCw, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import { CATEGORIES } from '../data/categories';

export default function PublishModal() {
  const { currentUser } = useAuth();
  const { isPublishModalOpen, setIsPublishModalOpen, addProduct, setActiveTab } = useProducts();

  const [type, setType] = useState('venta'); // 'venta' | 'cambio'
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('motor');
  const [price, setPrice] = useState('');
  const [tradeFor, setTradeFor] = useState('');
  const [city, setCity] = useState(currentUser?.city || 'Bogotá');
  const [condition, setCondition] = useState('Nuevo');
  const [compatibleBikes, setCompatibleBikes] = useState(currentUser?.bikeModel || '');
  const [description, setDescription] = useState('');
  const [imageIndex, setImageIndex] = useState(0);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [sellerName, setSellerName] = useState(currentUser?.name || '');
  const [sellerPhone, setSellerPhone] = useState(currentUser?.phone || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isPublishModalOpen) return null;

  // Preset sample motorcycle spare images
  const sampleImages = [
    { label: 'Farola LED', url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80' },
    { label: 'Kit de arrastre', url: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=600&auto=format&fit=crop&q=80' },
    { label: 'Pastas de freno', url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80' },
    { label: 'Casco integral', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80' },
    { label: 'Batería de moto', url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80' },
    { label: 'Llanta deportiva', url: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=600&auto=format&fit=crop&q=80' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Por favor indica el título del repuesto.');
      return;
    }

    if (type === 'venta' && (!price || Number(price) <= 0)) {
      setError('Por favor indica un precio válido de venta.');
      return;
    }

    if (type === 'cambio' && !tradeFor.trim()) {
      setError('Por favor describe qué repuesto buscas a cambio.');
      return;
    }

    const finalImage = customImageUrl.trim() || sampleImages[imageIndex].url;
    const finalSellerName = currentUser?.name || sellerName.trim() || 'Motero MotoMarket';
    const finalSellerPhone = currentUser?.phone || sellerPhone.trim() || '+57 300 123 4567';

    const newProduct = {
      title: title.trim(),
      type: type,
      category: category,
      price: type === 'venta' ? Number(price) : 0,
      tradeFor: type === 'cambio' ? tradeFor.trim() : null,
      city: city,
      condition: condition,
      compatibleBikes: compatibleBikes.split(',').map(b => b.trim()).filter(Boolean),
      description: description.trim() || 'Repuesto para motocicleta en excelente estado publicado por la comunidad.',
      image: finalImage,
      seller: {
        id: currentUser?.id || `guest-${Date.now()}`,
        name: finalSellerName,
        phone: finalSellerPhone,
        rating: 5.0,
        salesCount: 1,
        verified: !!currentUser,
        city: city
      },
      tags: [category, city.toLowerCase(), type, ...title.toLowerCase().split(' ')]
    };

    addProduct(newProduct);
    setActiveTab(type);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      setIsPublishModalOpen(false);
      // Reset form
      setTitle('');
      setPrice('');
      setTradeFor('');
      setDescription('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-purple-200 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/50 flex items-center justify-center border border-purple-400/40">
              <PlusCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Publicar Repuesto o Anuncio</h3>
              <p className="text-xs text-purple-200">Vende o permuta repuestos con la comunidad motera</p>
            </div>
          </div>
          <button
            onClick={() => setIsPublishModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {success ? (
          <div className="p-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-1">¡Anuncio publicado con éxito!</h4>
            <p className="text-xs text-slate-500">Tu repuesto ya está visible en el catálogo de {type === 'venta' ? 'Ventas' : 'Cambios'}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Mode Selector: Venta vs Cambio */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                ¿Qué deseas hacer con tu repuesto?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('venta')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    type === 'venta'
                      ? 'bg-purple-50 border-purple-600 text-purple-700 ring-2 ring-purple-600/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Tag className="w-4 h-4" />
                  <span>Vender repuesto</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('cambio')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    type === 'cambio'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-700 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Cambiar / Permutar</span>
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Título del repuesto *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Kit de arrastre con cadena dorada para Honda CB 190R"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Category & City row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Ciudad
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  {['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga', 'Manizales', 'Pereira', 'Cartagena'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price (if venta) OR Trade description (if cambio) */}
            {type === 'venta' ? (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Precio (COP $) *
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ej. 180000"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  ¿Qué repuesto buscas a cambio? *
                </label>
                <input
                  type="text"
                  value={tradeFor}
                  onChange={(e) => setTradeFor(e.target.value)}
                  placeholder="Ej. Busco pastas sinterizadas o filtro de alto flujo"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            )}

            {/* Condition & Compatible Bikes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Estado del repuesto
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="Nuevo">Nuevo en caja sellada</option>
                  <option value="Como nuevo">Como nuevo (pocos kilómetros)</option>
                  <option value="Usado - Buen estado">Usado - Buen estado garantizado</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Motos compatibles (separar con coma)
                </label>
                <input
                  type="text"
                  value={compatibleBikes}
                  onChange={(e) => setCompatibleBikes(e.target.value)}
                  placeholder="Ej. Yamaha FZ 16, Yamaha FZ 2.0"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Image selection */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Foto del repuesto (selecciona una muestra o usa un link)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
                {sampleImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setImageIndex(idx);
                      setCustomImageUrl('');
                    }}
                    className={`relative rounded-xl overflow-hidden h-14 border-2 cursor-pointer transition-all ${
                      imageIndex === idx && !customImageUrl ? 'border-purple-600 ring-2 ring-purple-600/30' : 'border-slate-200 opacity-80'
                    }`}
                  >
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center truncate py-0.5 px-1">
                      {img.label}
                    </span>
                  </div>
                ))}
              </div>

              <input
                type="url"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="O pega aquí una URL de imagen personalizada (opcional)"
                className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Contact details if not logged in */}
            {!currentUser && (
              <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Tu nombre de contacto *
                  </label>
                  <input
                    type="text"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Tu teléfono o WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    placeholder="Ej. 312 456 7890"
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Descripción detallada
              </label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Indica marca, tiempo de uso, motivo de venta o detalles de compatibilidad..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publicar anuncio ahora</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
