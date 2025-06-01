
import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Re0App } from './re0-app.tsx';

createRoot(document.getElementById('re0')!).render(
  <StrictMode>
    <Re0App/>
  </StrictMode>,
);
