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
  .aero-card { background: linear-gradient(135deg, rgba(20, 30, 40, 0.7) 0%, rgba(10, 15, 20, 0.8) 100%); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 16px; transition: all 0.3s; }
  .aero-card:hover { transform: translateY(-5px) scale(1.02); border-color: var(--accent-color); }
`;

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState('classic');
  const [streamingApps] = useState([
    { id: 1, name: 'YouTube Premium', url: 'https://youtube.com' },
    { id: 2, name: 'YT Music', url: 'https://music.youtube.com' },
    { id: 3, name: 'Flow (Personal)', url: 'https://web.flow.com.ar' },
    { id: 4, name: 'Netflix', url: 'https://netflix.com' },
    { id: 5, name: 'Spotify', url: 'https://open.spotify.com' },
    { id: 6, name: 'Crunchyroll', url: 'https://crunchyroll.com' }
  ]);
  const [browserUrl, setBrowserUrl] = useState('');

  const openStreamingApp = (url) => {
    try {
      const win = window.open(url, `_blank`, 'noopener,noreferrer');
      if (!win) alert("El navegador bloqueó la ventana emergente. Habilítalas para continuar.");
    } catch (e) {
      console.error("Error al lanzar streaming:", e);
    }
  };

  const navigateBrowser = (e) => {
    e.preventDefault();
    if (!browserUrl) return;
    const finalUrl = browserUrl.startsWith('http') ? browserUrl : `https://${browserUrl}`;
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <style>{aeroStyles}</style>
      <div className="app-container flex h-screen w-full" data-theme={theme}>
        <div className="w-64 flex flex-col p-4 z-10">
          <div className="aero-glass flex-1 flex flex-col py-6 px-3">
            <h1 className="text-2xl font-bold px-4 mb-10 text-white shadow-sm">AeroTV</h1>
            <nav className="flex flex-col gap-2 flex-1">
              <button onClick={() => setActiveTab('home')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left font-semibold ${activeTab === 'home' ? 'aero-button' : 'hover:bg-white/20'}`}><Tv/> Inicio</button>
              <button onClick={() => setActiveTab('streaming')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left font-semibold ${activeTab === 'streaming' ? 'aero-button' : 'hover:bg-white/20'}`}><MonitorPlay/> Streaming</button>
              <button onClick={() => setActiveTab('browser')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left font-semibold ${activeTab === 'browser' ? 'aero-button' : 'hover:bg-white/20'}`}><Globe/> Navegador</button>
            </nav>
            <button onClick={() => setActiveTab('settings')} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/20"><Settings/> Configuración</button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'home' && (
            <div className="space-y-8">
              <div className="aero-glass p-8 flex items-center justify-between">
                <div>
                  <h1 className="text-6xl font-bold">{currentTime.toLocaleTimeString()}</h1>
                  <p className="text-xl opacity-90">Jueves, 28 de mayo de 2026</p>
                </div>
                <div className="aero-card p-6 w-64 text-center"><HardDrive className="mx-auto mb-2" /> <p>Media Local</p><p className="text-sm opacity-70">1.2 TB disponibles</p></div>
              </div>
              <h2 className="text-2xl font-bold">Accesos Directos</h2>
              <div className="grid grid-cols-4 gap-6">
                {streamingApps.slice(0, 4).map(app => (
                  <div key={app.id} onClick={() => openStreamingApp(app.url)} className="aero-card p-6 flex flex-col items-center cursor-pointer hover:scale-105 transition-all">
                    <Play size={40} className="mb-4" /> <span>{app.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'streaming' && (
             <div className="grid grid-cols-3 gap-6">
               {streamingApps.map(app => (
                 <div key={app.id} onClick={() => openStreamingApp(app.url)} className="aero-card p-8 cursor-pointer hover:bg-white/10 transition-all text-center">
                   <MonitorPlay size={48} className="mx-auto mb-4" />
                   <h3 className="font-bold">{app.name}</h3>
                 </div>
               ))}
             </div>
          )}

          {activeTab === 'browser' && (
             <form onSubmit={navigateBrowser} className="aero-glass p-10 flex flex-col gap-4">
                <input type="text" className="bg-black/30 p-4 rounded-xl border border-white/20" placeholder="https://..." value={browserUrl} onChange={(e) => setBrowserUrl(e.target.value)} />
                <button type="submit" className="aero-button py-4">Abrir en Navegador</button>
             </form>
          )}

          {activeTab === 'settings' && (
            <div className="grid grid-cols-2 gap-4">
              {['classic', 'nature', 'sunset', 'amethyst'].map(t => (
                <button key={t} onClick={() => setTheme(t)} className="aero-card p-6 capitalize">{t}</button>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}