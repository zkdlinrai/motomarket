import React, { useState } from 'react';
import { X, MessageSquare, Send, ThumbsUp, Eye, Bike, Clock } from 'lucide-react';
import { FORUM_TOPICS } from '../data/guides';
import { useProducts } from '../context/ProductsContext';
import { useAuth } from '../context/AuthContext';

export default function ForumModal() {
  const { isForumModalOpen, setIsForumModalOpen } = useProducts();
  const { currentUser, openAuthModal } = useAuth();

  const [topics, setTopics] = useState(FORUM_TOPICS);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [showNewTopicForm, setShowNewTopicForm] = useState(false);

  if (!isForumModalOpen) return null;

  const handleCreateTopic = (e) => {
    e.preventDefault();
    if (!newTopicTitle.trim()) return;

    const newTopic = {
      id: `forum-${Date.now()}`,
      author: currentUser?.name?.split(' ')[0] || 'RiderNuevo',
      bike: currentUser?.bikeModel || 'Moto Ciudad',
      title: newTopicTitle.trim(),
      replies: 0,
      views: 1,
      time: 'Justo ahora'
    };

    setTopics(prev => [newTopic, ...prev]);
    setNewTopicTitle('');
    setShowNewTopicForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-purple-200 animate-scaleUp max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/50 flex items-center justify-center border border-purple-400/40">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Foro Biker MotoMarket</h3>
              <p className="text-xs text-purple-200">Preguntas, experiencias mecánicas y recomendaciones de rutas</p>
            </div>
          </div>
          <button
            onClick={() => setIsForumModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* New Discussion CTA */}
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Discusiones recientes ({topics.length})
            </h4>
            <button
              onClick={() => {
                if (!currentUser) {
                  openAuthModal('login');
                  return;
                }
                setShowNewTopicForm(!showNewTopicForm);
              }}
              className="text-xs font-bold text-purple-600 hover:text-purple-800 bg-purple-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              {showNewTopicForm ? 'Cancelar' : '+ Abrir nuevo tema'}
            </button>
          </div>

          {showNewTopicForm && (
            <form onSubmit={handleCreateTopic} className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3">
              <label className="text-xs font-bold text-purple-900 block">
                Escribe tu duda, consulta o tema de debate:
              </label>
              <input
                type="text"
                required
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
                placeholder="Ej. ¿Qué tal es el rendimiento de las llantas Diablo Rosso en lluvia?"
                className="w-full p-2.5 rounded-xl border border-purple-300 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
              />
              <button
                type="submit"
                className="py-2 px-4 rounded-xl bg-purple-700 text-white text-xs font-bold hover:bg-purple-800 transition-colors"
              >
                Publicar pregunta en el foro
              </button>
            </form>
          )}

          {/* Topics List */}
          <div className="space-y-3">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/20 transition-all cursor-pointer bg-white"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-purple-700">{topic.author}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Bike className="w-3 h-3 text-slate-400" />
                      {topic.bike}
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {topic.time}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2">
                  {topic.title}
                </h3>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                    <strong>{topic.replies}</strong> respuestas
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    {topic.views} lecturas
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
