import { useState } from 'react';
import axios from 'axios';
import { WrenchScrewdriverIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const SERVICE_TYPES = [
  { value: 'oil_change',            label: 'Cambio de aceite' },
  { value: 'maintenance',           label: 'Mantenimiento preventivo' },
  { value: 'repair',                label: 'Reparación' },
  { value: 'technical_inspection',  label: 'Revisión técnica' },
  { value: 'customization',         label: 'Personalización' },
  { value: 'other',                 label: 'Otro' },
];

export default function ServicePage() {
  const [form, setForm]     = useState({ motoPlate: '', motoBrand: '', motoModel: '', motoYear: '', serviceType: 'maintenance', description: '', scheduledAt: '' });
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
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">¡Servicio agendado!</h2>
        <p className="text-gray-500">Te enviaremos una confirmación por email con los detalles.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <WrenchScrewdriverIcon className="h-8 w-8 text-brand-500" />
        <div>
          <h1 className="text-3xl font-black">Taller Mocana Motors</h1>
          <p className="text-gray-500 text-sm">Agenda tu servicio — te contactaremos para confirmar</p>
        </div>
      </div>

      <form onSubmit={submit} className="card space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Placa *</label>
            <input required value={form.motoPlate} onChange={(e) => setForm({ ...form, motoPlate: e.target.value })}
              placeholder="ABC123"
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400 uppercase"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Marca</label>
            <input value={form.motoBrand} onChange={(e) => setForm({ ...form, motoBrand: e.target.value })}
              placeholder="Honda, Yamaha, Suzuki..."
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Modelo</label>
            <input value={form.motoModel} onChange={(e) => setForm({ ...form, motoModel: e.target.value })}
              placeholder="CB190R, FZ25..."
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Año</label>
            <input type="number" value={form.motoYear} onChange={(e) => setForm({ ...form, motoYear: e.target.value })}
              placeholder="2022"
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Tipo de servicio *</label>
          <select required value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
          >
            {SERVICE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Descripción *</label>
          <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe el problema o servicio requerido..."
            rows={3}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400 resize-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Fecha preferida</label>
          <input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Agendando…' : 'Agendar servicio'}
        </button>
      </form>
    </div>
  );
}
