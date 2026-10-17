import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Los componentes del sistema de diseño renderizan <a href>; esto los enruta dentro de la app
// sin recargar la página (y sin perder el carrito).
export default function SpaLinks() {
  const navigate = useNavigate();
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.('a');
      const href = a?.getAttribute('href');
      if (!a || !href || !href.startsWith('/') || href.startsWith('//') || a.target || a.hasAttribute('download')) return;
      e.preventDefault();
      navigate(href);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [navigate]);
  return null;
}
