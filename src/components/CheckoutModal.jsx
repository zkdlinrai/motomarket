import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  PackageCheck, 
  Copy,
  Lock,
  Building2,
  AlertCircle,
  Clock,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatPrice } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen, cartItems, subtotal, discountAmount, shippingFee, total, completeCheckout } = useCart();
  const { currentUser } = useAuth();

  // Basic Contact Data
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    city: currentUser?.city || 'Bogotá',
    address: 'Carrera 15 # 85-32, Apto 402',
    notes: 'Llamar al llegar a la portería',
    paymentMethod: 'tarjeta' // 'tarjeta' | 'nequi' | 'pse' | 'contra-entrega'
  });

  // Credit/Debit Card Fields
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    cardExpiry: '',
    cardCvv: '',
    installments: '1'
  });

  // Nequi Payment Fields
  const [nequiData, setNequiData] = useState({
    nequiPhone: currentUser?.phone?.replace(/\D/g, '').slice(-10) || '',
    nequiIdNumber: '',
    nequiAuthType: 'dinamica', // 'dinamica' | 'push'
    nequiDynamicKey: ''
  });

  // PSE Banks Fields
  const [pseData, setPseData] = useState({
    pseBank: 'Bancolombia',
    personType: 'natural', // 'natural' | 'juridica'
    docType: 'CC',
    docNumber: '',
    pseEmail: currentUser?.email || ''
  });

  // Cash on Delivery Detailed Fields
  const [codData, setCodData] = useState({
    receiverName: currentUser?.name || '',
    receiverIdNumber: '',
    secondaryPhone: '',
    cashAmount: 'Efectivo exacto',
    customCashAmount: '',
    preferredTime: 'Cualquier momento del día (8am - 6pm)',
    agreementConfirmed: false
  });

  const [validationError, setValidationError] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  if (!isCheckoutOpen) return null;

  // Format Card Number with Spaces (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardData({ ...cardData, cardNumber: formatted });
  };

  // Format Card Expiry (MM/YY)
  const handleCardExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = raw.slice(0, 2) + '/' + raw.slice(2);
    }
    setCardData({ ...cardData, cardExpiry: raw });
  };

  const detectCardBrand = (number) => {
    const clean = number.replace(/\D/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'Mastercard';
    if (/^3[47]/.test(clean)) return 'American Express';
    return 'Tarjeta';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    // Method-specific Validations
    if (formData.paymentMethod === 'tarjeta') {
      const cleanNum = cardData.cardNumber.replace(/\s/g, '');
      if (cleanNum.length < 15) {
        setValidationError('Por favor ingresa los 16 dígitos de tu tarjeta.');
        return;
      }
      if (!cardData.cardHolder.trim()) {
        setValidationError('Por favor ingresa el nombre del titular como figura en la tarjeta.');
        return;
      }
      if (cardData.cardExpiry.length < 5) {
        setValidationError('Por favor ingresa la fecha de vencimiento (MM/AA).');
        return;
      }
      if (cardData.cardCvv.length < 3) {
        setValidationError('Por favor ingresa el código de seguridad CVV (3 o 4 dígitos).');
        return;
      }
    } else if (formData.paymentMethod === 'nequi') {
      if (nequiData.nequiPhone.length < 10) {
        setValidationError('Por favor ingresa tu número de celular Nequi (10 dígitos).');
        return;
      }
      if (!nequiData.nequiIdNumber.trim()) {
        setValidationError('Por favor ingresa la cédula del titular de la cuenta Nequi.');
        return;
      }
      if (nequiData.nequiAuthType === 'dinamica' && nequiData.nequiDynamicKey.length < 6) {
        setValidationError('Ingresa la clave dinámica de 6 dígitos que te muestra tu app Nequi.');
        return;
      }
    } else if (formData.paymentMethod === 'pse') {
      if (!pseData.docNumber.trim()) {
        setValidationError('Ingresa tu número de documento para PSE.');
        return;
      }
      if (!pseData.pseEmail.trim()) {
        setValidationError('Ingresa el correo registrado en PSE.');
        return;
      }
    } else if (formData.paymentMethod === 'contra-entrega') {
      if (!codData.receiverIdNumber.trim()) {
        setValidationError('Por seguridad en contra entrega, ingresa la cédula de la persona que recibirá.');
        return;
      }
      if (!codData.secondaryPhone.trim()) {
        setValidationError('Ingresa un teléfono de respaldo para que el domiciliario se comunique si el principal no contesta.');
        return;
      }
      if (!codData.agreementConfirmed) {
        setValidationError('Debes confirmar que habrá un adulto disponible con el efectivo en la dirección.');
        return;
      }
    }

    // Consolidate payment info for order record
    const paymentDetails = {
      ...(formData.paymentMethod === 'tarjeta' && {
        cardLast4: cardData.cardNumber.replace(/\s/g, '').slice(-4),
        cardBrand: detectCardBrand(cardData.cardNumber),
        cardHolder: cardData.cardHolder,
        cardInstallments: cardData.installments
      }),
      ...(formData.paymentMethod === 'nequi' && {
        nequiPhone: nequiData.nequiPhone,
        nequiIdNumber: nequiData.nequiIdNumber,
        nequiAuthType: nequiData.nequiAuthType
      }),
      ...(formData.paymentMethod === 'pse' && {
        pseBank: pseData.pseBank,
        personType: pseData.personType,
        pseDocNumber: pseData.docNumber,
        pseEmail: pseData.pseEmail
      }),
      ...(formData.paymentMethod === 'contra-entrega' && {
        receiverName: codData.receiverName,
        receiverIdNumber: codData.receiverIdNumber,
        secondaryPhone: codData.secondaryPhone,
        cashAmount: codData.cashAmount === 'Otro monto' ? codData.customCashAmount : codData.cashAmount,
        preferredTime: codData.preferredTime
      })
    };

    const finalOrder = completeCheckout({
      ...formData,
      paymentDetails
    });

    setCompletedOrder(finalOrder);

    // Confetti animation
    try {
      confetti({
        particleCount: 140,
        spread: 90,
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-purple-200 animate-scaleUp max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-950 via-[#18122c] to-[#0d0e17] p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-600/40 flex items-center justify-center border border-purple-400/30">
              <ShieldCheck className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">BikerParts Checkout Seguro</h3>
              <p className="text-xs text-purple-200">Garantía de protección en cada pago y despacho</p>
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
          <div className="p-6 sm:p-8 text-center space-y-4 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <PackageCheck className="w-9 h-9" />
            </div>

            <h4 className="text-xl sm:text-2xl font-black text-slate-900">
              ¡Pago procesado con éxito!
            </h4>

            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Tu orden ha sido registrada en el sistema de BikerParts. Te notificaremos al despachar tus repuestos.
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
                <span className="font-semibold uppercase text-purple-700">{completedOrder.customer.paymentMethod}</span>
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
              className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm transition-colors shadow-lg shadow-purple-700/30"
            >
              Volver a la tienda
            </button>
          </div>
        ) : (
          /* Checkout Form with Dynamic Payment Fields */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
            
            {validationError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Step 1: Customer Information */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-purple-600" />
                <span>1. Datos de despacho y envío</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nombre completo *</label>
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
                  <label className="text-xs font-bold text-slate-700 block mb-1">Teléfono celular principal *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="312 458 9912"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Ciudad *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    {['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga', 'Manizales', 'Pereira'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Dirección exacta de entrega *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Calle, carrera, número de casa/apto..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method Tabs */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-purple-600" />
                <span>2. Selecciona tu método de pago</span>
              </h4>

              {/* Payment Buttons Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                
                {/* Tarjeta */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'tarjeta' })}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-center transition-all ${
                    formData.paymentMethod === 'tarjeta'
                      ? 'bg-purple-50 border-purple-600 text-purple-900 ring-2 ring-purple-600/20 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  <span className="text-xs font-bold">Tarjeta</span>
                  <span className="text-[10px] text-slate-400">Crédito/Débito</span>
                </button>

                {/* Nequi */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'nequi' })}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-center transition-all ${
                    formData.paymentMethod === 'nequi'
                      ? 'bg-purple-50 border-purple-600 text-purple-900 ring-2 ring-purple-600/20 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-purple-600" />
                  <span className="text-xs font-bold">Nequi</span>
                  <span className="text-[10px] text-slate-400">App Móvil</span>
                </button>

                {/* PSE Bancos */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'pse' })}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-center transition-all ${
                    formData.paymentMethod === 'pse'
                      ? 'bg-purple-50 border-purple-600 text-purple-900 ring-2 ring-purple-600/20 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-purple-600" />
                  <span className="text-xs font-bold">PSE Bancos</span>
                  <span className="text-[10px] text-slate-400">Bancolombia, etc.</span>
                </button>

                {/* Contra Entrega */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'contra-entrega' })}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-center transition-all ${
                    formData.paymentMethod === 'contra-entrega'
                      ? 'bg-purple-50 border-purple-600 text-purple-900 ring-2 ring-purple-600/20 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-purple-600" />
                  <span className="text-xs font-bold">Contra Entrega</span>
                  <span className="text-[10px] text-slate-400">Paga al recibir</span>
                </button>

              </div>

              {/* DYNAMIC DETAILED PAYMENT FIELDS */}
              
              {/* 1. TARJETA FORM */}
              {formData.paymentMethod === 'tarjeta' && (
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-purple-600" />
                      <span>Datos protegidos con cifrado bancario de 256 bits</span>
                    </span>
                    <span className="text-xs font-black text-purple-700">
                      {detectCardBrand(cardData.cardNumber)}
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Número de la tarjeta *
                    </label>
                    <input
                      type="text"
                      required
                      value={cardData.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4500 1234 5678 9010"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Nombre del titular como aparece en la tarjeta *
                    </label>
                    <input
                      type="text"
                      required
                      value={cardData.cardHolder}
                      onChange={(e) => setCardData({ ...cardData, cardHolder: e.target.value.toUpperCase() })}
                      placeholder="CARLOS MENDOZA"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs uppercase font-semibold bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Vencimiento *
                      </label>
                      <input
                        type="text"
                        required
                        value={cardData.cardExpiry}
                        onChange={handleCardExpiryChange}
                        placeholder="MM/AA"
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-center font-mono font-bold bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Código CVV *
                      </label>
                      <input
                        type="password"
                        maxLength="4"
                        required
                        value={cardData.cardCvv}
                        onChange={(e) => setCardData({ ...cardData, cardCvv: e.target.value.replace(/\D/g, '') })}
                        placeholder="•••"
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-center font-mono font-bold bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Cuotas
                      </label>
                      <select
                        value={cardData.installments}
                        onChange={(e) => setCardData({ ...cardData, installments: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      >
                        <option value="1">1 cuota (Sin interés)</option>
                        <option value="3">3 cuotas</option>
                        <option value="6">6 cuotas</option>
                        <option value="12">12 cuotas</option>
                        <option value="24">24 cuotas</option>
                        <option value="36">36 cuotas</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. NEQUI FORM */}
              {formData.paymentMethod === 'nequi' && (
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2 text-purple-900 text-xs font-bold">
                    <Smartphone className="w-4 h-4 text-purple-700" />
                    <span>Pago instantáneo a través de tu cuenta Nequi</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Número de celular Nequi (10 dígitos) *
                      </label>
                      <input
                        type="tel"
                        maxLength="10"
                        required
                        value={nequiData.nequiPhone}
                        onChange={(e) => setNequiData({ ...nequiData, nequiPhone: e.target.value.replace(/\D/g, '') })}
                        placeholder="300 123 4567"
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Cédula de Ciudadanía del titular *
                      </label>
                      <input
                        type="text"
                        required
                        value={nequiData.nequiIdNumber}
                        onChange={(e) => setNequiData({ ...nequiData, nequiIdNumber: e.target.value.replace(/\D/g, '') })}
                        placeholder="Ej. 1098234871"
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Método de confirmación
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setNequiData({ ...nequiData, nequiAuthType: 'dinamica' })}
                        className={`p-2 rounded-xl border text-xs font-bold text-center transition-all ${
                          nequiData.nequiAuthType === 'dinamica'
                            ? 'bg-purple-700 text-white border-purple-700'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        Clave dinámica (App Nequi)
                      </button>

                      <button
                        type="button"
                        onClick={() => setNequiData({ ...nequiData, nequiAuthType: 'push' })}
                        className={`p-2 rounded-xl border text-xs font-bold text-center transition-all ${
                          nequiData.nequiAuthType === 'push'
                            ? 'bg-purple-700 text-white border-purple-700'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        Notificación Push
                      </button>
                    </div>
                  </div>

                  {nequiData.nequiAuthType === 'dinamica' && (
                    <div className="p-3 bg-white rounded-xl border border-purple-200">
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Ingresa la clave dinámica de 6 dígitos que ves en tu App Nequi:
                      </label>
                      <input
                        type="password"
                        maxLength="6"
                        value={nequiData.nequiDynamicKey}
                        onChange={(e) => setNequiData({ ...nequiData, nequiDynamicKey: e.target.value.replace(/\D/g, '') })}
                        placeholder="••••••"
                        className="w-full p-2 rounded-lg border border-purple-300 text-center font-mono font-bold tracking-widest text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="text-[10px] text-slate-400 block mt-1 text-center">
                        Abre tu App Nequi &gt; Presiona el candado &gt; Copia la clave dinámica
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* 3. PSE BANCOS FORM */}
              {formData.paymentMethod === 'pse' && (
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2 text-purple-900 text-xs font-bold">
                    <Building2 className="w-4 h-4 text-purple-700" />
                    <span>Débito seguro desde tu cuenta de ahorros o corriente con PSE</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Selecciona tu Banco *
                    </label>
                    <select
                      value={pseData.pseBank}
                      onChange={(e) => setPseData({ ...pseData, pseBank: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    >
                      <option value="Bancolombia">Bancolombia</option>
                      <option value="Davivienda">Davivienda</option>
                      <option value="Banco de Bogotá">Banco de Bogotá</option>
                      <option value="BBVA Colombia">BBVA Colombia</option>
                      <option value="Nu Colombia (Cuenta Nu)">Nu Colombia (Cuenta Nu)</option>
                      <option value="Banco Caja Social">Banco Caja Social</option>
                      <option value="Scotiabank Colpatria">Scotiabank Colpatria</option>
                      <option value="Banco de Occidente">Banco de Occidente</option>
                      <option value="Lulo Bank">Lulo Bank</option>
                      <option value="Dale">Dale (Grupo Aval)</option>
                      <option value="Banco Popular">Banco Popular</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Tipo de persona</label>
                      <select
                        value={pseData.personType}
                        onChange={(e) => setPseData({ ...pseData, personType: e.target.value })}
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="natural">Persona Natural</option>
                        <option value="juridica">Persona Jurídica</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Documento</label>
                      <select
                        value={pseData.docType}
                        onChange={(e) => setPseData({ ...pseData, docType: e.target.value })}
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="CC">Cédula de Ciudadanía (CC)</option>
                        <option value="CE">Cédula de Extranjería (CE)</option>
                        <option value="NIT">NIT</option>
                        <option value="PAS">Pasaporte</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Número de ID *</label>
                      <input
                        type="text"
                        required
                        value={pseData.docNumber}
                        onChange={(e) => setPseData({ ...pseData, docNumber: e.target.value.replace(/\D/g, '') })}
                        placeholder="Ej. 1098234871"
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs font-mono font-bold bg-white focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Correo registrado en PSE *
                    </label>
                    <input
                      type="email"
                      required
                      value={pseData.pseEmail}
                      onChange={(e) => setPseData({ ...pseData, pseEmail: e.target.value })}
                      placeholder="tu.correo@registrado-en-pse.com"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>
              )}

              {/* 4. CONTRA ENTREGA FORM (EXTRA ROBUST & SECURE) */}
              {formData.paymentMethod === 'contra-entrega' && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2 text-amber-900 text-xs font-bold">
                    <Banknote className="w-4 h-4 text-amber-700" />
                    <span>Verificación de seguridad para pago Contra Entrega</span>
                  </div>

                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    Para garantizar la entrega y evitar fraudes o devoluciones, solicitamos datos de confirmación para el mensajero motorizado:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-800 block mb-1">
                        Nombre completo de quien recibe el paquete *
                      </label>
                      <input
                        type="text"
                        required
                        value={codData.receiverName}
                        onChange={(e) => setCodData({ ...codData, receiverName: e.target.value })}
                        placeholder="Ej. Juan Pérez o Portero del edificio"
                        className="w-full p-2.5 rounded-xl border border-amber-300 text-xs bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-800 block mb-1">
                        Cédula de quien recibe (verificación física) *
                      </label>
                      <input
                        type="text"
                        required
                        value={codData.receiverIdNumber}
                        onChange={(e) => setCodData({ ...codData, receiverIdNumber: e.target.value.replace(/\D/g, '') })}
                        placeholder="Ej. 1098234871"
                        className="w-full p-2.5 rounded-xl border border-amber-300 text-xs font-mono font-bold bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-800 block mb-1">
                        Teléfono celular de respaldo (obligatorio) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={codData.secondaryPhone}
                        onChange={(e) => setCodData({ ...codData, secondaryPhone: e.target.value })}
                        placeholder="315 998 7766 (Contacto de apoyo)"
                        className="w-full p-2.5 rounded-xl border border-amber-300 text-xs bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-800 block mb-1">
                        ¿Con cuánto efectivo vas a pagar? *
                      </label>
                      <select
                        value={codData.cashAmount}
                        onChange={(e) => setCodData({ ...codData, cashAmount: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-amber-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      >
                        <option value="Efectivo exacto">Efectivo exacto (Sin necesidad de cambio)</option>
                        <option value="Pago con billete de $100.000">Pago con billete de $100.000</option>
                        <option value="Pago con billete de $200.000">Pago con billete de $200.000</option>
                        <option value="Otro monto">Otro monto en efectivo</option>
                      </select>
                    </div>
                  </div>

                  {codData.cashAmount === 'Otro monto' && (
                    <div>
                      <label className="text-[11px] font-bold text-slate-800 block mb-1">
                        Indica el valor exacto del billete con el que vas a pagar:
                      </label>
                      <input
                        type="text"
                        value={codData.customCashAmount}
                        onChange={(e) => setCodData({ ...codData, customCashAmount: e.target.value })}
                        placeholder="Ej. $150.000"
                        className="w-full p-2 rounded-lg border border-amber-300 text-xs bg-white focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-bold text-slate-800 block mb-1">
                      Franja horaria preferida de entrega
                    </label>
                    <select
                      value={codData.preferredTime}
                      onChange={(e) => setCodData({ ...codData, preferredTime: e.target.value })}
                      className="w-full p-2 rounded-xl border border-amber-300 text-xs bg-white focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="Mañana (8:00 AM - 12:00 PM)">Mañana (8:00 AM - 12:00 PM)</option>
                      <option value="Tarde (1:00 PM - 6:00 PM)">Tarde (1:00 PM - 6:00 PM)</option>
                      <option value="Cualquier momento del día (8am - 6pm)">Cualquier momento del día (8:00 AM - 6:00 PM)</option>
                    </select>
                  </div>

                  <div className="pt-1 flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="cod-agreement"
                      checked={codData.agreementConfirmed}
                      onChange={(e) => setCodData({ ...codData, agreementConfirmed: e.target.checked })}
                      className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="cod-agreement" className="text-[11px] text-slate-700 font-medium cursor-pointer">
                      Confirmo que habrá una persona mayor de edad disponible en la dirección indicada con el dinero en efectivo preparado para la entrega.
                    </label>
                  </div>
                </div>
              )}

            </div>

            {/* Total summary */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{cartItems.length} productos en la orden:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Descuento aplicado:</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Costo de envío:</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-600">¡Gratis!</strong> : formatPrice(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                <span>Total a pagar:</span>
                <span className="text-purple-700 text-base">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Confirmar y pagar pedido ({formatPrice(total)})</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
