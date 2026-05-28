import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Folder, 
  Globe, 
  Settings, 
  Play, 
  MonitorPlay,
  HardDrive
} from 'lucide-react';
import { useStreamingLauncher } from './hooks/useStreamingLauncher';
import { useToast } from './hooks/useToast';
import { StreamingErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer } from './components/Toast';
import { LoadingSpinner } from './components/LoadingSpinner';

const aeroStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;600;700&display=swap');

  :root, [data-theme="classic"] {
    --theme-bg-image: url('https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80');
    --btn-top-light: #7bc8f6; --btn-top-dark: #3ba4db; --btn-bot-light: #1588ca; --btn-bot-dark: #0b73af;
    --btn-border: #085a8c; --accent-color: #3ba4db; --glass-tint: rgba(255,255,255,0.3); --glass-border: rgba(255,255,255,0.5);
  }

  [data-theme="nature"] {
    --theme-bg-image: url('https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80');
    --btn-top-light: #86efac; --btn-top-dark: #4ade80; --btn-bot-light: #16a34a; --btn-bot-dark: #15803d;
    --btn-border: #14532d; --accent-color: #22c55e; --glass-tint: rgba(200,255,200,0.25); --glass-border: rgba(180,255,180,0.4);
  }

  [data-theme="sunset"] {
    --theme-bg-image: url('https://images.unsplash.com/photo-1610296669228-602fa827fc1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80');
    --btn-top-light: #fdba74; --btn-top-dark: #fb923c; --btn-bot-light: #ea580c; --btn-bot-dark: #c2410c;
    --btn-border: #7c2d12; --accent-color: #f97316; --glass-tint: rgba(255,200,180,0.25); --glass-border: rgba(255,200,180,0.4);
  }

  [data-theme="amethyst"] {
    --theme-bg-image: url('https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80');
    --btn-top-light: #d8b4fe; --btn-top-dark: #c084fc; --btn-bot-light: #9333ea; --btn-bot-dark: #6b21a8;
    --btn-border: #4c1d95; --accent-color: #a855f7; --glass-tint: rgba(220,200,255,0.25); --glass-border: rgba(220,200,255,0.4);
  }

  .app-container { background: var(--theme-bg-image) no-repeat center center fixed; background-size: cover; font-family: 'Segoe UI', sans-serif; color: #fff; overflow: hidden; }
  .aero-glass { background: linear-gradient(135deg, var(--glass-tint) 0%, rgba(0,0,0,0.1) 100%); backdrop-filter: blur(12px); border: 1px solid var(--glass-border); border-radius: 16px; box-shadow: 0 8px 32px 0 rgba(0,0,0,0.4); }
  .aero-button { background: linear-gradient(to bottom, var(--btn-top-light) 0%, var(--btn-top-dark) 49%, var(--btn-bot-light) 50%, var(--btn-bot-dark) 100%); border: 1px solid var(--btn-border); border-radius: 12px; transition: all 0.2s; }
  .aero-button:hover { opacity: 0.95; transform: translateY(-2px); }
  .aero-button:disabled { opacity: 0.6; cursor: not-allowed; }
  .aero-card { background: linear-gradient(135deg, rgba(20, 30, 40, 0.7) 0%, rgba(10, 15, 20, 0.8) 100%); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 16px; transition: all 0.3s; }
  .aero-card:hover { transform: translateY(-5px) scale(1.02); border-color: var(--accent-color); }
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  .animate-slideIn { animation: slideIn 0.3s ease-out; }
`;

/**
 * Componente principal de la aplicación.
 * Refactorizado para usar hooks personalizados y manejo modular de estado.
 */
function AppContent() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState('classic');
  const [browserUrl, setBrowserUrl] = useState('');
  
  const { loadingId, openStreamingApp, isLoading } = useStreamingLauncher();
  const { toasts, removeToast, error: showError, success: showSuccess } = useToast();

  const [streamingApps] = useState([
    { id: 1, name: 'YouTube Premium', url: 'https://youtube.com' },
    { id: 2, name: 'YT Music', url: 'https://music.youtube.com' },
    { id: 3, name: 'Flow (Personal)', url: 'https://web.flow.com.ar' },
    { id: 4, name: 'Netflix', url: 'https://netflix.com' },
    { id: 5, name: 'Spotify', url: 'https://open.spotify.com' },
    { id: 6, name: 'Crunchyroll', url: 'https://crunchyroll.com' }
  ]);

  /**
   * Maneja el click en un app de streaming.
   * Muestra notificación en caso de error.
   */
  const handleStreamingClick = async (app) => {
    try {
      await openStreamingApp(app.url, app.id);
      showSuccess(`Abriendo ${app.name}...`, 2000);
    } catch (err) {
      showError(err.message || 'Error desconocido al abrir la aplicación');
    }
  };

  /**
   * Maneja la navegación del navegador personalizado.
   */
  const handleBrowserNavigation = (e) => {
    e.preventDefault();
    if (!browserUrl.trim()) {
      showError('Por favor, ingresa una URL válida');
      return;
    }
    
    try {
      const finalUrl = browserUrl.startsWith('http') 
        ? browserUrl 
        : `https://${browserUrl}`;
      
      const win = window.open(finalUrl, '_blank', 'noopener,noreferrer');
      if (!win || win.closed) {
        throw new Error('POPUP_BLOCKED');
      }
      
      setBrowserUrl('');
      showSuccess('Navegador abierto correctamente', 2000);
    } catch (err) {
      if (err.message === 'POPUP_BLOCKED') {
        showError('El navegador bloqueó la ventana emergente. Habilítalas en la configuración.');
      } else {
        showError('Error al abrir el navegador: ' + err.message);
      }
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <style>{aeroStyles}</style>
      <div className="app-container flex h-screen w-full" data-theme={theme}>
        {/* Sidebar */}
        <div className="w-64 flex flex-col p-4 z-10">
          <div className="aero-glass flex-1 flex flex-col py-6 px-3">
            <h1 className="text-2xl font-bold px-4 mb-10 text-white shadow-sm">AeroTV</h1>
            <nav className="flex flex-col gap-2 flex-1">
              <button 
                onClick={() => setActiveTab('home')} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left font-semibold ${activeTab === 'home' ? 'aero-button' : 'hover:bg-white/20'}`}
              >
                <Tv /> Inicio
              </button>
              <button 
                onClick={() => setActiveTab('streaming')} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left font-semibold ${activeTab === 'streaming' ? 'aero-button' : 'hover:bg-white/20'}`}
              >
                <MonitorPlay /> Streaming
              </button>
              <button 
                onClick={() => setActiveTab('browser')} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left font-semibold ${activeTab === 'browser' ? 'aero-button' : 'hover:bg-white/20'}`}
              >
                <Globe /> Navegador
              </button>
            </nav>
            <button 
              onClick={() => setActiveTab('settings')} 
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/20"
            >
              <Settings /> Configuración
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Tab: Home */}
          {activeTab === 'home' && (
            <div className="space-y-8">
              <div className="aero-glass p-8 flex items-center justify-between">
                <div>
                  <h1 className="text-6xl font-bold">{currentTime.toLocaleTimeString()}</h1>
                  <p className="text-xl opacity-90">Jueves, 28 de mayo de 2026</p>
                </div>
                <div className="aero-card p-6 w-64 text-center">
                  <HardDrive className="mx-auto mb-2" /> 
                  <p>Media Local</p>
                  <p className="text-sm opacity-70">1.2 TB disponibles</p>
                </div>
              </div>
              <h2 className="text-2xl font-bold">Accesos Directos</h2>
              <div className="grid grid-cols-4 gap-6">
                {streamingApps.slice(0, 4).map(app => (
                  <button
                    key={app.id}
                    onClick={() => handleStreamingClick(app)}
                    disabled={isLoading(app.id)}
                    className="aero-card p-6 flex flex-col items-center cursor-pointer hover:scale-105 transition-all disabled:opacity-70"
                  >
                    {isLoading(app.id) ? (
                      <LoadingSpinner size="lg" className="mb-4 text-white" />
                    ) : (
                      <Play size={40} className="mb-4" />
                    )}
                    <span className="text-sm font-medium">{app.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Streaming */}
          {activeTab === 'streaming' && (
            <div className="grid grid-cols-3 gap-6">
              {streamingApps.map(app => (
                <button
                  key={app.id}
                  onClick={() => handleStreamingClick(app)}
                  disabled={isLoading(app.id)}
                  className="aero-card p-8 cursor-pointer hover:bg-white/10 transition-all text-center disabled:opacity-70"
                >
                  {isLoading(app.id) ? (
                    <LoadingSpinner size="lg" className="mx-auto mb-4 text-white" />
                  ) : (
                    <MonitorPlay size={48} className="mx-auto mb-4" />
                  )}
                  <h3 className="font-bold text-sm">{app.name}</h3>
                </button>
              ))}
            </div>
          )}

          {/* Tab: Browser */}
          {activeTab === 'browser' && (
            <form onSubmit={handleBrowserNavigation} className="aero-glass p-10 flex flex-col gap-4 max-w-lg">
              <label className="block">
                <span className="block text-sm font-semibold mb-2">Ingresa una URL:</span>
                <input 
                  type="text" 
                  className="w-full bg-black/30 p-4 rounded-xl border border-white/20 focus:border-white/40 focus:outline-none transition-colors" 
                  placeholder="https://ejemplo.com" 
                  value={browserUrl} 
                  onChange={(e) => setBrowserUrl(e.target.value)} 
                />
              </label>
              <button 
                type="submit" 
                className="aero-button py-4 font-semibold hover:scale-105 transition-all"
              >
                Abrir en Navegador
              </button>
            </form>
          )}

          {/* Tab: Settings */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Temas</h2>
                <div className="grid grid-cols-2 gap-4 max-w-lg">
                  {['classic', 'nature', 'sunset', 'amethyst'].map(t => (
                    <button 
                      key={t} 
                      onClick={() => setTheme(t)} 
                      className={`aero-card p-6 capitalize font-semibold transition-all ${theme === t ? 'ring-2 ring-white' : ''}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}

/**
 * Componente principal exportado con ErrorBoundary.
 */
export default function App() {
  return (
    <StreamingErrorBoundary>
      <AppContent />
    </StreamingErrorBoundary>
  );
}