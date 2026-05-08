import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Polyfill crypto.randomUUID for old Android WebViews (pre-Chromium / Android 7 stock WebView)
// that don't expose it even in a secure context.
if (typeof crypto !== 'undefined' && typeof crypto.randomUUID !== 'function') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (crypto as any).randomUUID = (): ReturnType<typeof crypto.randomUUID> => {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant RFC 4122
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0'));
    return `${hex.slice(0,4).join('')}-${hex.slice(4,6).join('')}-${hex.slice(6,8).join('')}-${hex.slice(8,10).join('')}-${hex.slice(10).join('')}` as ReturnType<typeof crypto.randomUUID>;
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
