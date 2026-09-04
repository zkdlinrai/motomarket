import React, { useState } from 'react';
import { X, User, Mail, Lock, Phone, MapPin, Bike, Check, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    register,
    login,
    loginAsAdmin
  } = useAuth();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: 'Bogotá',
    bikeModel: ''
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    try {
      login(loginEmail, loginPassword);
      setSuccessMsg('¡Sesión iniciada con éxito!');
      setTimeout(() => {
        setSuccessMsg('');
        closeAuthModal();
      }, 900);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    if (!registerData.name.trim() || !registerData.email.trim() || !registerData.password.trim()) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }

    try {
      register(registerData);
      setSuccessMsg('¡Cuenta creada y datos guardados exitosamente!');
      setTimeout(() => {
        setSuccessMsg('');
        closeAuthModal();
      }, 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMasterAdminLogin = () => {
    setError('');
    loginAsAdmin();
    setSuccessMsg('¡Bienvenido, Administrador Maestro!');
    setTimeout(() => {
      setSuccessMsg('');
      closeAuthModal();
    }, 800);
  };

  const handleDemoUserLogin = () => {
    setError('');
    login('alejandro.biker@bikerparts.co', '');
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-purple-200 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient and Logo */}
        <div className="bg-gradient-to-r from-purple-950 via-[#19132c] to-[#0a0a12] p-6 text-white text-center relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <img
            src="/logo.png"
            alt="BikerParts"
            className="h-12 w-auto mx-auto mb-2 object-contain drop-shadow"
          />

          <h3 className="font-black text-xl tracking-tight">
            Comunidad <span className="text-purple-400">BikerParts</span>
          </h3>
          <p className="text-xs text-purple-200 mt-0.5">
            Plataforma oficial de venta y cambio de repuestos
          </p>

          {/* Tab Switcher */}
          <div className="flex bg-black/40 p-1 rounded-xl mt-4 max-w-xs mx-auto">
            <button
              onClick={() => {
                setAuthModalMode('login');
                setError('');
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                authModalMode === 'login'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => {
                setAuthModalMode('register');
                setError('');
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                authModalMode === 'register'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              Registrarse
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 animate-bounce">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {authModalMode === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="tu@correo.com o admin@bikerparts.co"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md shadow-purple-700/30 transition-all"
              >
                Ingresar a mi cuenta
              </button>

              {/* Quick Access Buttons for Demo and Master Admin */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  onClick={handleMasterAdminLogin}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-amber-400/20 transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-950" />
                  <span>👑 Acceso Administrador Maestro (1 Clic)</span>
                </button>

                <button
                  type="button"
                  onClick={handleDemoUserLogin}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Entrar como Usuario Motero Demo</span>
                </button>
              </div>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nombre completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    placeholder="Ej. Andrés Morales"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Correo electrónico *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder="andres.biker@correo.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Teléfono celular *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                      placeholder="315 901 2233"
                      className="w-full pl-8 pr-2 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Ciudad *
                  </label>
                  <select
                    value={registerData.city}
                    onChange={(e) => setRegisterData({ ...registerData, city: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    {['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga', 'Manizales', 'Pereira'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tu moto actual (Marca / Modelo)
                </label>
                <div className="relative">
                  <Bike className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={registerData.bikeModel}
                    onChange={(e) => setRegisterData({ ...registerData, bikeModel: e.target.value })}
                    placeholder="Ej. Yamaha FZ 2.0 / Pulsar NS200"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Contraseña *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    placeholder="Crea tu contraseña segura"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md shadow-purple-700/30 transition-all"
                >
                  Guardar información y registrarme
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-400">
                Al registrarte aceptas las políticas de compra y permuta segura de BikerParts.
              </p>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
