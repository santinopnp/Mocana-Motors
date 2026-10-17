import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import './design-system/tokens.css';
import './design-system/bundle.css';

// Los componentes del sistema de diseño usan window.React
(window as unknown as { React: typeof React }).React = React;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
