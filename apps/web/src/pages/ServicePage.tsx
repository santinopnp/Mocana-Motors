import { useMemo, useState } from 'react';
import axios from 'axios';
import { Alert, Button, Chip, SectionHeader, TextField, TimeSlots } from '../design-system';

const SERVICE_TYPES = [
  { value: 'oil_change',           label: 'Cambio de aceite' },
  { value: 'maintenance',          label: 'Mantenimiento preventivo' },
  { value: 'repair',               label: 'Reparación' },
  { value: 'technical_inspection', label: 'Revisión técnica' },
  { value: 'customization',        label: 'Personalización' },
  { value: 'other',                label: 'Otro' },
];

const TIMES = ['8:00 a. m.', '9:00 a. m.', '10:00 a. m.', '11:00 a. m.', '2:00 p. m.', '3:00 p. m.', '4:00 p. m.', '5:00 p. m.'];

// Próximos 5 días hábiles (lunes a sábado)
function nextDays(n = 5) {
  const out: { id: string; weekday: string; date: string }[] = [];
  const d = new Date();
  while (out.length < n) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0) continue;
    out.push({
      id: d.toISOString().slice(0, 10),
      weekday: d.toLocaleDateString('es-CO', { weekday: 'short' }).replace('.', ''),
      date: String(d.getDate()),
    });
  }
  return out;
}

function toISO(day: string, time: string) {
  const [hm, ampm] = time.split(' ');
  let [h, m] = hm.split(':').map(Number);
  if (ampm.startsWith('p') && h !== 12) h += 12;
  return `${day}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export default function ServicePage() {
  const days = useMemo(() => nextDays(), []);
  const [form, setForm]       = useState({ motoPlate: '', motoBrand: '', motoModel: '', motoYear: '', serviceType: 'maintenance', description: '' });
  const [day, setDay]         = useState(days[0].id);
  const [time, setTime]       = useState(TIMES[1]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/service-orders', { ...form, motoYear: Number(form.motoYear) || undefined, scheduledAt: toISO(day, time) });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Revisa tu conexión e inténtalo otra vez.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="page max-w-read py-16">
        <Alert tone="success" title="Servicio agendado">Te escribimos por WhatsApp para confirmar el día y la hora.</Alert>
      </div>
    );
  }

  return (
    <div className="page max-w-read py-8 flex flex-col gap-6">
      <SectionHeader as="h1" eyebrow="Servicio técnico y taller" title="Agenda tu servicio" />
      <p className="m-0 text-ink-muted">Escoge qué necesita tu moto y la hora que te sirve. Te confirmamos por WhatsApp.</p>

      <form onSubmit={submit} className="flex flex-col gap-6">
        <fieldset className="card m-0 border-0 flex flex-col gap-4">
          <legend className="float-left p-0 text-lg font-semibold">¿Qué necesita tu moto?</legend>
          <div className="flex flex-wrap gap-2">
            {SERVICE_TYPES.map((t) => (
              <Chip key={t.value} selected={form.serviceType === t.value} onClick={() => setForm({ ...form, serviceType: t.value })}>{t.label}</Chip>
            ))}
          </div>
        </fieldset>

        <fieldset className="card m-0 border-0 flex flex-col gap-4">
          <legend className="float-left p-0 text-lg font-semibold">Tu moto</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField label="Placa" required value={form.motoPlate} placeholder="ABC12D"
              onChange={(e) => setForm({ ...form, motoPlate: e.target.value.toUpperCase() })} />
            <TextField label="Año" inputMode="numeric" value={form.motoYear} onChange={set('motoYear')} placeholder="2022" />
            <TextField label="Marca" value={form.motoBrand} onChange={set('motoBrand')} placeholder="Honda, Yamaha…" />
            <TextField label="Modelo" value={form.motoModel} onChange={set('motoModel')} placeholder="CB190R, FZ25…" />
          </div>
          <div className="mm-field">
            <label htmlFor="descripcion" className="mm-field-label">Cuéntanos qué pasa<span className="mm-req" aria-hidden="true"> *</span></label>
            <div className="mm-control">
              <textarea id="descripcion" required rows={3} className="mm-input py-3" value={form.description} onChange={set('description')}
                placeholder="Ej. Suena al frenar y la luz delantera parpadea" />
            </div>
          </div>
        </fieldset>

        <fieldset className="card m-0 border-0 flex flex-col gap-4">
          <legend className="float-left p-0 text-lg font-semibold">Día y hora</legend>
          <TimeSlots days={days} slots={TIMES.map((t) => ({ time: t }))} day={day} time={time} onDayChange={setDay} onTimeChange={setTime} />
        </fieldset>

        {error && <Alert tone="danger" title="No pudimos agendar tu servicio">{error}</Alert>}

        <Button type="submit" variant="primary" block loading={loading}>Agendar servicio</Button>
      </form>
    </div>
  );
}
