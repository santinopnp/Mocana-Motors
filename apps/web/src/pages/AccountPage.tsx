import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Badge, Button, Icon, IconButton, SegmentedControl, formatCOP, type BadgeTone } from '../design-system/ui';

const STATUS: Record<string, { label: string; tone: BadgeTone }> = {
  pending:     { label: 'Pendiente',  tone: 'warning' },
  confirmed:   { label: 'Confirmado', tone: 'success' },
  processing:  { label: 'En proceso', tone: 'info' },
  shipped:     { label: 'Enviado',    tone: 'info' },
  delivered:   { label: 'Entregado',  tone: 'success' },
  cancelled:   { label: 'Cancelado',  tone: 'neutral' },
  scheduled:   { label: 'Agendado',   tone: 'warning' },
  in_progress: { label: 'En taller',  tone: 'info' },
  ready:       { label: 'Lista para entregar', tone: 'success' },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] || { label: status, tone: 'neutral' as BadgeTone };
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders]               = useState<any[]>([]);
  const [serviceOrders, setServiceOrders] = useState<any[]>([]);
  const [tab, setTab] = useState<'orders' | 'service'>('orders');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    axios.get('/api/orders').then(({ data }) => setOrders(data)).catch(() => {});
    axios.get('/api/service-orders').then(({ data }) => setServiceOrders(data)).catch(() => {});
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="mx-auto max-w-read">
      <div className="bg-asphalt px-4 pt-6 pb-5 tablet:rounded-b-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-brand text-brand-on flex items-center justify-center font-display text-2xl shrink-0">
            {user.first_name?.[0] || user.email[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="t-title text-asphalt-on truncate">{user.first_name} {user.last_name}</p>
            <p className="t-body-sm text-asphalt-muted truncate">{user.email}</p>
          </div>
          <IconButton icon="arrow-right" label="Cerrar sesión" variant="on-dark" onClick={logout} />
        </div>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4">
        <SegmentedControl
          label="Historial"
          value={tab}
          onChange={setTab}
          options={[{ value: 'orders', label: 'Mis pedidos' }, { value: 'service', label: 'Taller' }]}
        />

        {tab === 'orders' && (
          orders.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center gap-3">
              <span className="text-line-strong"><Icon name="cart" size={48} /></span>
              <p className="text-ink-muted">Aún no tienes pedidos.</p>
              <Button to="/shop">Ver catálogo</Button>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {orders.map((o) => (
                <li key={o.id} className="card flex items-center gap-3">
                  <div className="flex-1">
                    <p className="t-code text-ink">{o.order_number}</p>
                    <p className="t-caption text-ink-muted mt-0.5">{new Date(o.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <p className="font-bold tabular-nums text-ink">{formatCOP(o.total)}</p>
                    <StatusBadge status={o.status} />
                  </div>
                </li>
              ))}
            </ul>
          )
        )}

        {tab === 'service' && (
          serviceOrders.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center gap-3">
              <span className="text-line-strong"><Icon name="wrench" size={48} /></span>
              <p className="text-ink-muted">Aún no tienes servicios de taller.</p>
              <Button to="/service" iconStart="calendar">Agendar servicio</Button>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {serviceOrders.map((so) => (
                <li key={so.id} className="card flex items-center gap-3">
                  <div className="flex-1">
                    <p className="t-code text-ink">{so.service_number}</p>
                    <p className="t-caption text-ink-muted mt-0.5"><span className="font-mono">{so.moto_plate}</span> · {so.service_type}</p>
                  </div>
                  <StatusBadge status={so.status} />
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );
}
