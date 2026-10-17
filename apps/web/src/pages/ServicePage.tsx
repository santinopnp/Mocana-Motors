import { useState } from 'react';
import axios from 'axios';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const SERVICE_TYPES = [
  { value: 'oil_change',           label: 'Cambio de aceite' },
  { value: 'maintenance',          label: 'Mantenimiento preventivo' },
  { value: 'repair',               label: 'Reparación' },
  { value: 'technical_inspection', label: 'Revisión técnica' },
  { value: 'customization',        label: 'Personalización' },
  { value: 'other',                label: 'Otro' },
];

const inputCls = 'mt-1 w-full border border-[#8A8F98] rounded-md px-4 min-h-[48px] py-3 text-base bg-surface-raised text-ink';

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
      setError(err.response?.data?.error || 'No pudimos agendar tu servicio. Revisa tu conexión e inténtalo otra vez.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-8 text-center">
        <CheckCircleIcon className="h-16 w-16 text-[#1D7A3B] mb-4" />
        <h2 className="display text-[28px] mb-2">Servicio agendado</h2>
        <p className="text-ink-3">Te escribimos para confirmar el día y la hora.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex flex-col gap-1.5">
          <span className="eyebrow text-brand-600">Servicio técnico y taller</span>
          <h1 className="display text-[32px] lg:text-[44px]">Agenda tu servicio</h1>
          <p className="text-ink-3">Escoge qué necesita tu moto y la hora que te sirve. Te confirmamos por WhatsApp.</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {/* Moto info */}
        <div className="bg-surface-raised rounded-lg p-5 md:p-6 space-y-4">
          <p className="text-xl font-bold text-ink">Tu moto</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-ink">Placa *</label>
              <input required value={form.motoPlate}
                onChange={(e) => setForm({ ...form, motoPlate: e.target.value.toUpperCase() })}
                placeholder="ABC123"
                className={inputCls + ' uppercase'}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink">Año</label>
              <input type="number" value={form.motoYear}
                onChange={(e) => setForm({ ...form, motoYear: e.target.value })}
                placeholder="2022"
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink">Marca</label>
              <input value={form.motoBrand}
                onChange={(e) => setForm({ ...form, motoBrand: e.target.value })}
                placeholder="Honda, Yamaha…"
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink">Modelo</label>
              <input value={form.motoModel}
                onChange={(e) => setForm({ ...form, motoModel: e.target.value })}
                placeholder="CB190R, FZ25…"
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* Service type */}
        <div className="bg-surface-raised rounded-lg p-5 md:p-6 space-y-3">
          <p className="text-xl font-bold text-ink">¿Qué necesita tu moto?</p>
          <div className="grid grid-cols-2 gap-2">
            {SERVICE_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                aria-pressed={form.serviceType === t.value}
                onClick={() => setForm({ ...form, serviceType: t.value })}
                className={`flex items-center min-h-[56px] px-4 rounded-md font-semibold transition-colors text-left text-ink ${
                  form.serviceType === t.value
                    ? 'border-2 border-ink bg-surface-sunken'
                    : 'border border-[#8A8F98] bg-surface-raised hover:border-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description + date */}
        <div className="bg-surface-raised rounded-lg p-5 md:p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-ink">Cuéntanos qué pasa</label>
            <textarea required value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Ej. Suena al frenar y la luz delantera parpadea"
              rows={3}
              className={inputCls + ' resize-none'}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink">Día y hora que prefieres</label>
            <input type="datetime-local" value={form.scheduledAt}
              onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
              className={inputCls}
            />
          </div>
        </div>

        {error && <p role="alert" className="text-brand-600 text-sm text-center font-medium">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full text-[17px]">
          {loading ? 'Agendando…' : 'Agendar servicio'}
        </button>
      </form>
    </div>
  );
}
