import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { ChatBubbleOvalLeftIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface Message { role: 'user' | 'assistant'; content: string; }

export default function ChatWidget() {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Hola! Soy Moto 🏍️, tu asesor de Mocana Motors. ¿En qué te puedo ayudar hoy? Puedo orientarte sobre motos, accesorios, repuestos o el taller.' }
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const sessionId = useRef(`mm-${Math.random().toString(36).slice(2)}`);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);
    try {
      const { data } = await axios.post('/api/chat', { message: userMsg, sessionId: sessionId.current });
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Lo siento, tuve un problema. ¿Puedes intentar de nuevo?' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Bubble */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-brand-500 hover:bg-brand-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-50 transition-colors"
        aria-label="Abrir chat"
      >
        {open ? <XMarkIcon className="h-6 w-6" /> : <ChatBubbleOvalLeftIcon className="h-6 w-6" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-50 overflow-hidden" style={{ height: 460 }}>
          <div className="bg-dark-900 text-white px-4 py-3 flex items-center gap-3">
            <span className="text-xl">🏍️</span>
            <div>
              <p className="font-semibold text-sm">Moto</p>
              <p className="text-xs text-gray-400">Asistente Mocana Motors</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-brand-500 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-3 py-2 rounded-2xl rounded-bl-sm text-sm text-gray-500">
                  Escribiendo<span className="animate-pulse">...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t border-gray-100 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Escribe tu pregunta..."
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
              disabled={loading}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white rounded-xl w-9 h-9 flex items-center justify-center shrink-0 transition-colors"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
