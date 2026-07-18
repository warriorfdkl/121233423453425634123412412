import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { AppStateProvider } from './context/AppStateContext';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* basename — тот же подпуть, что и base сборки: на GitHub Pages сайт
        живёт в /имя-репозитория/, и без этого роутер не узнаёт свои же
        маршруты. Локально BASE_URL === '/', поведение не меняется. */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </BrowserRouter>
  </StrictMode>,
);
