import { useMemo, useState } from 'react';
import axios from 'axios';
import { Alert, Button, Chip, Icon, SectionHeader, TextField, TimeSlots, type IconName } from '../design-system/ui';

const SERVICE_TYPES: { value: string; label: string; icon: IconName }[] = [
  { value: 'oil_change',           label: 'Cambio de aceite',         icon: 'oil' },
  { value: 'maintenance',          label: 'Mantenimiento preventivo', icon: 'toolbox' },
  { value: 'repair',               label: 'Reparación',               icon: 'wrench' },
  { value: 'technical_inspection', label: 'Revisión técnica',         icon: 'search' },
  { value: 'customization',        label: 'Personalización',          icon: 'tag' },
  { value: 'other',                label: 'Otro',                     icon: 'chat' },
];

// Horario de referencia para elegir una hora preferida; el taller la confirma.
const HOURS = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
const WEEKDAYS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

function hourLabel(hhmm: string) {
  const h = Number(hhmm.slice(0, 2));
  return `${h > 12 ? h - 12 : h}:00 ${h < 12 ? 'a. m.' : 'p. m.'}`;
}

function nextDays(n: number) {
  const out: { id: string; weekday: string; date: string; disabled?: boolean }[] = [];
  const d = new Date();
  for (let i = 1; out.length < n; i++) {
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
    const id = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
    out.push({ id, weekday: WEEKDAYS[day.getDay()], date: String(day.getDate()), disabled: day.getDay() === 0 });
  }
  return out;
}

export default function ServicePage() {
  const [form, setForm]       = useState({ motoPlate: '', motoBrand: '', motoModel: '', motoYear: '', serviceType: 'maintenance', description: '' });
  const [day, setDay]         = useState<string>();
  const [time, setTime]       = useState<string>();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const days = useMemo(() => nextDays(10), []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const scheduledAt = day && time ? `${day}T${time}` : undefined;
      await axios.post('/api/service-orders', { ...form, scheduledAt, motoYear: Number(form.motoYear) || undefined });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'No pudimos agendar tu servicio. Revisa los datos e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-8 text-center gap-3">
        <span className="w-16 h-16 rounded-lg bg-success-soft text-success flex items-center justify-center"><Icon name="check" size={36} /></span>
        <h1 className="t-display-md text-ink">Servicio agendado</h1>
        <p className="text-ink-muted">Te contactamos para confirmar el día y la hora.</p>
        <Button variant="secondary" to="/account">Ver mis servicios</Button>
      </div>
    );
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="mx-auto max-w-read px-4 py-6 flex flex-col gap-6">
      <SectionHeader as="h1" eyebrow="Servicio técnico" title="Agenda tu servicio" />

      <form onSubmit={submit} className="flex flex-col gap-6">
        <fieldset className="card flex flex-col gap-4">
          <legend className="mm-eyebrow float-left mb-1">Tu moto</legend>
          <div className="grid grid-cols-2 gap-3 clear-left">
            <TextField label="Placa" required value={form.motoPlate} placeholder="ABC12D"
              onChange={(e) => setForm({ ...form, motoPlate: e.target.value.toUpperCase() })}
              className="[&_.mm-input]:font-mono [&_.mm-input]:uppercase" />
            <TextField label="Año" type="number" inputMode="numeric" value={form.motoYear} placeholder="2022" onChange={set('motoYear')} />
            <TextField label="Marca" value={form.motoBrand} placeholder="Honda, Yamaha…" onChange={set('motoBrand')} />
            <TextField label="Modelo" value={form.motoModel} placeholder="CB190R, FZ25…" onChange={set('motoModel')} />
          </div>
        </fieldset>

        <fieldset className="card flex flex-col gap-3">
          <legend className="mm-eyebrow float-left mb-1">Tipo de servicio *</legend>
          <div className="flex flex-wrap gap-2 clear-left">
            {SERVICE_TYPES.map((t) => (
              <Chip key={t.value} icon={t.icon} selected={form.serviceType === t.value}
                onClick={() => setForm({ ...form, serviceType: t.value })}>
                {t.label}
              </Chip>
            ))}
          </div>
          <TextField label="¿Qué le pasa a tu moto?" required multiline rows={3}
            value={form.description}
            placeholder="Describe el ruido, la falla o el servicio que necesitas"
            onChange={set('description')} />
        </fieldset>

        <div className="card flex flex-col gap-3">
          <p className="mm-eyebrow">Fecha preferida</p>
          <TimeSlots
            days={days}
            slots={HOURS.map((h) => ({ time: hourLabel(h) }))}
            day={day}
            time={time && hourLabel(time)}
            onDayChange={setDay}
            onTimeChange={(label) => setTime(HOURS.find((h) => hourLabel(h) === label))}
          />
          {day && time && (
            <p className="t-body-sm text-ink-muted">Elegiste {days.find((d) => d.id === day)?.weekday} {days.find((d) => d.id === day)?.date}, {hourLabel(time)}. El taller la confirma.</p>
          )}
        </div>

        {error && <Alert tone="danger" title="No se agendó">{error}</Alert>}

        <Button type="submit" block loading={loading} iconStart="calendar">
          {loading ? 'Agendando…' : 'Agendar servicio'}
        </Button>
      </form>
    </div>
  );
}
