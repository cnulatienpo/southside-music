import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

declare global {
  interface Window {
    __CHELA__?: boolean;
  }
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

window.__CHELA__ = true;

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
