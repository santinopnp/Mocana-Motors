import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Icon, IconButton, Logo } from '../design-system/ui';

interface Message { role: 'user' | 'assistant'; content: string; }

export default function ChatWidget() {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hola, soy Moto, tu asesor de Mocana Motors. ¿En qué te ayudo hoy?' }
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
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Tuve un problema para responder. Intenta de nuevo en un momento.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Botón flotante — sobre la navegación inferior en móvil */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 right-4 desktop:bottom-6 desktop:right-6 z-50 w-14 h-14 rounded-lg bg-brand text-brand-on hover:bg-brand-strong shadow-2 flex items-center justify-center"
        aria-label={open ? 'Cerrar chat' : 'Abrir chat con Moto'}
        aria-expanded={open}
      >
        <Icon name={open ? 'close' : 'chat'} size={26} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Chat con Moto"
          className="fixed bottom-36 desktop:bottom-24 right-4 desktop:right-6 w-[calc(100vw-32px)] max-w-sm bg-surface-raised rounded-xl shadow-2 border border-line flex flex-col z-50 overflow-hidden"
          style={{ height: 440 }}
        >
          <div className="bg-asphalt text-asphalt-on pl-4 pr-1 py-2 flex items-center gap-3 shrink-0">
            <Logo variant="badge" height={32} label="" />
            <div className="flex-1">
              <p className="t-title">Moto</p>
              <p className="t-caption text-asphalt-muted">Asesor Mocana Motors</p>
            </div>
            <IconButton icon="close" label="Cerrar chat" variant="on-dark" onClick={() => setOpen(false)} />
          </div>

          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-lg t-body-sm ${
                  m.role === 'user'
                    ? 'bg-asphalt text-asphalt-on rounded-br-sm'
                    : 'bg-surface-sunken text-ink rounded-bl-sm'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-surface-sunken px-3 py-2 rounded-lg rounded-bl-sm t-body-sm text-ink-muted">
                  <span className="animate-pulse">Escribiendo…</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="p-3 border-t border-line flex gap-2 shrink-0">
            <label htmlFor="chat-input" className="mm-sr">Tu pregunta</label>
            <input
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta…"
              className="mm-input flex-1"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Enviar"
              className="mm-btn mm-btn-primary !px-0 w-12 shrink-0"
            >
              <Icon name="arrow-right" size={20} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
