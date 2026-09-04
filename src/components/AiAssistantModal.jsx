import React, { useState, useRef, useEffect } from 'react';
import { X, Bot, Send, Sparkles, User, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';

export default function AiAssistantModal() {
  const { isAiModalOpen, setIsAiModalOpen, setSearchQuery, setActiveTab, setSelectedProductForDetail, products } = useProducts();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '¡Hola motero! 🏍️ Soy tu Asistente IA de BikerParts. Te ayudo a resolver dudas mecánicas, verificar compatibilidad de repuestos para tu moto y encontrar los mejores precios o permutas en nuestra plataforma.',
      recommendation: null
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickQuestions = [
    '¿Qué repuesto le sirve a una Yamaha FZ?',
    '¿Cuándo debo cambiar mis pastas de freno?',
    '¿Kit de arrastre con o sin O-Ring?',
    '¿Cómo funciona el intercambio de repuestos?'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isAiModalOpen) return null;

  const generateBotReply = (query) => {
    const q = query.toLowerCase();

    if (q.includes('yamaha') || q.includes('fz')) {
      const p = products.find(prod => prod.title.toLowerCase().includes('yamaha'));
      return {
        text: 'Para Yamaha FZ (16 y 2.0/25), disponemos de Farola LED de alta potencia 6000K, kit de arrastre 428H y baterías selladas 12V 7Ah. ¿Te gustaría ver las especificaciones de la farola o filtrar todos los repuestos para Yamaha?',
        recommendation: p || null
      };
    }

    if (q.includes('freno') || q.includes('pastas')) {
      const p = products.find(prod => prod.category === 'frenos');
      return {
        text: 'El límite de seguridad en pastas de freno son 2 mm de material. Si escuchas chillido metálico, es momento de cambiarlas antes de rayar el disco. En la plataforma tenemos un juego de pastas disponible para intercambio en Cali.',
        recommendation: p || null
      };
    }

    if (q.includes('arrastre') || q.includes('cadena')) {
      const p = products.find(prod => prod.category === 'transmision');
      return {
        text: 'Un kit de arrastre con O-Ring o X-Ring retiene mejor la lubricación interna y dura hasta un 40% más que las cadenas sencillas, ideal si ruedas en lluvia o carretera. Te sugiero el kit con cadena dorada reforzada.',
        recommendation: p || null
      };
    }

    if (q.includes('casco') || q.includes('ls2') || q.includes('seguridad')) {
      const p = products.find(prod => prod.category === 'accesorios');
      return {
        text: 'Para máxima protección en carretera recomendamos cascos con norma ECE 22.06 o DOT, calota HPTT y visor anti-rayones. El casco integral LS2 Rapid II publicado en Barranquilla cumple con los máximos estándares.',
        recommendation: p || null
      };
    }

    if (q.includes('cambio') || q.includes('permuta') || q.includes('intercambio')) {
      return {
        text: '¡El sistema de cambio de BikerParts es genial! Puedes entrar a la pestaña "Repuestos para cambio", ver qué busca el dueño (ej. un filtro a cambio de llanta) y proponerle tu repuesto. Todo queda registrado de forma segura.',
        recommendation: null
      };
    }

    return {
      text: `Excelente consulta sobre "${query}". He analizado nuestra base de repuestos y te recomiendo revisar nuestro catálogo filtrado. También puedes usar el botón de "Publicar anuncio" si buscas una pieza específica que no esté publicada.`,
      recommendation: null
    };
  };

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    // Append user message
    const userMsg = { sender: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking response
    setTimeout(() => {
      const reply = generateBotReply(text);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: reply.text,
        recommendation: reply.recommendation
      }]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-[#0d0e17] rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-purple-500/40 text-white animate-scaleUp flex flex-col h-[600px] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chat Header */}
        <div className="p-4 bg-gradient-to-r from-purple-900 to-indigo-950 border-b border-purple-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/40 border border-purple-400/40 flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base">IA Asistente Biker_</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="text-[11px] text-purple-200">Asesoría mecánica y compatibilidad de repuestos</p>
            </div>
          </div>

          <button
            onClick={() => setIsAiModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-2.5 items-start ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="w-7 h-7 rounded-xl bg-purple-600/50 border border-purple-400/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-purple-200" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-3 leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-tr-xs'
                    : 'bg-[#181926] border border-purple-900/40 text-slate-200 rounded-tl-xs'
                }`}
              >
                <p>{msg.text}</p>

                {/* Product Recommendation Card embedded in chat */}
                {msg.recommendation && (
                  <div className="mt-3 p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={msg.recommendation.image}
                        alt={msg.recommendation.title}
                        className="w-10 h-10 rounded-lg object-contain bg-white/10 p-0.5 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-[11px] text-white truncate block">
                          {msg.recommendation.title}
                        </span>
                        <span className="text-[10px] text-purple-300">
                          {msg.recommendation.type === 'venta'
                            ? `$${msg.recommendation.price.toLocaleString('es-CO')}`
                            : 'Disponible para cambio'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsAiModalOpen(false);
                        setSelectedProductForDetail(msg.recommendation);
                      }}
                      className="py-1 px-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold shrink-0 flex items-center gap-1"
                    >
                      <span>Ver</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2 items-center text-slate-400 text-xs pl-9">
              <Bot className="w-4 h-4 text-purple-400 animate-spin" />
              <span>Analizando repuestos y datos técnicos...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-[#12131f] border-t border-purple-900/30 overflow-x-auto flex gap-1.5 no-scrollbar">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              className="text-[11px] bg-purple-950/70 hover:bg-purple-900 border border-purple-500/30 text-purple-200 px-3 py-1 rounded-full whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-[#0a0b12] border-t border-purple-900/40 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Pregúntale a la IA (ej: ¿Qué filtro le sirve a mi FZ?)..."
            className="flex-1 bg-[#181926] border border-purple-900/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white disabled:opacity-40 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
