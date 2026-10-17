import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert, Button, Logo, TextField } from '../design-system/ui';

export default function LoginPage() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('El correo o la contraseña no coinciden.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-4 py-10">
      <div className="text-center mb-8 flex flex-col items-center gap-4">
        <Logo variant="emblem" tone="light" height={72} />
        <div>
          <h1 className="t-display-lg text-ink">Ingresa</h1>
          <p className="t-body-sm text-ink-muted mt-1">Revisa tus pedidos y el estado de tu moto.</p>
        </div>
      </div>

      <form onSubmit={submit} className="w-full max-w-sm flex flex-col gap-4">
        <TextField label="Correo" type="email" required autoComplete="email" iconStart="user"
          value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" />
        <TextField label="Contraseña" type="password" required autoComplete="current-password"
          value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && <Alert tone="danger" title="No pudimos ingresar">{error}</Alert>}

        <Button type="submit" block loading={loading}>{loading ? 'Ingresando…' : 'Ingresar'}</Button>

        <p className="text-center t-body-sm text-ink-muted">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-brand-ink font-semibold underline underline-offset-2">Regístrate</Link>
        </p>
      </form>
    </div>
  );
}
