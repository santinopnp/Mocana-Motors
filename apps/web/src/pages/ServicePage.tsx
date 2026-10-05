import { useState } from 'react';
import axios from 'axios';
import { WrenchScrewdriverIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const SERVICE_TYPES = [
  { value: 'oil_change',           label: 'Cambio de aceite',         emoji: '🛢️' },
  { value: 'maintenance',          label: 'Mantenimiento preventivo',  emoji: '🔧' },
  { value: 'repair',               label: 'Reparación',                emoji: '🔩' },
  { value: 'technical_inspection', label: 'Revisión técnica',          emoji: '🔍' },
  { value: 'customization',        label: 'Personalización',           emoji: '✨' },
  { value: 'other',                label: 'Otro',                      emoji: '📋' },
];

const inputCls = 'mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400 focus:bg-white bg-gray-50 transition-colors';

export default function ServicePage() {
  const [form, setForm]       = useState({ motoPlate: '', motoBrand: '', motoModel: '', motoYear: '', serviceType: 'maintenance', description: '', scheduledAt: '' });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/service-orders', { ...form, motoYear: Number(form.motoYear) || undefined });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al agendar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-8 text-center">
        <CheckCircleIcon className="h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-xl font-black text-gray-900 mb-1">¡Servicio agendado!</h2>
        <p className="text-gray-500 text-sm">Te contactaremos para confirmar fecha y hora.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center shrink-0">
          <WrenchScrewdriverIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-black leading-tight">Agendar taller</h1>
          <p className="text-gray-400 text-xs">Te contactamos para confirmar</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {/* Moto info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tu moto</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600">Placa *</label>
              <input required value={form.motoPlate}
                onChange={(e) => setForm({ ...form, motoPlate: e.target.value.toUpperCase() })}
                placeholder="ABC123"
                className={inputCls + ' uppercase'}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Año</label>
              <input type="number" value={form.motoYear}
                onChange={(e) => setForm({ ...form, motoYear: e.target.value })}
                placeholder="2022"
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Marca</label>
              <input value={form.motoBrand}
                onChange={(e) => setForm({ ...form, motoBrand: e.target.value })}
                placeholder="Honda, Yamaha…"
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Modelo</label>
              <input value={form.motoModel}
                onChange={(e) => setForm({ ...form, motoModel: e.target.value })}
                placeholder="CB190R, FZ25…"
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* Service type */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tipo de servicio *</p>
          <div className="grid grid-cols-2 gap-2">
            {SERVICE_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setForm({ ...form, serviceType: t.value })}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-colors text-left ${
                  form.serviceType === t.value
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-gray-100 text-gray-600 hover:border-gray-200'
                }`}
              >
                <span>{t.emoji}</span> {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description + date */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600">Descripción *</label>
            <textarea required value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe el problema o servicio requerido…"
              rows={3}
              className={inputCls + ' resize-none'}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Fecha preferida</label>
            <input type="datetime-local" value={form.scheduledAt}
              onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
              className={inputCls}
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full text-sm">
          {loading ? 'Agendando…' : '📅 Agendar servicio'}
        </button>
      </form>
    </div>
  );
}
