import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Music, 
  Folder, 
  Globe, 
  Settings, 
  Plus, 
  X, 
  Play, 
  CloudRain,
  MonitorPlay,
  HardDrive,
  Sparkles,
  MessageSquare,
  Loader2,
  ArrowLeft,
  Maximize,
  Minimize,
  Palette
} from 'lucide-react';

const aeroStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;600;700&display=swap');

  :root, [data-theme="classic"] {
    --theme-bg-image: url('https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80');
    --btn-top-light: #7bc8f6;
    --btn-top-dark: #3ba4db;
    --btn-bot-light: #1588ca;
    --btn-bot-dark: #0b73af;
    --btn-border: #085a8c;
    --btn-hover-top-light: #98defc;
    --btn-hover-top-dark: #51b5e8;
    --btn-hover-bot-light: #209ce2;
    --btn-hover-bot-dark: #1289c9;
    --accent-color: #3ba4db;
    --glass-tint: rgba(255,255,255,0.3);
    --glass-border: rgba(255,255,255,0.5);
  }

  [data-theme="nature"] {
    --theme-bg-image: url('https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80');
    --btn-top-light: #86efac;
    --btn-top-dark: #4ade80;
    --btn-bot-light: #16a34a;
    --btn-bot-dark: #15803d;
    --btn-border: #14532d;
    --btn-hover-top-light: #bbf7d0;
    --btn-hover-top-dark: #86efac;
    --btn-hover-bot-light: #22c55e;
    --btn-hover-bot-dark: #16a34a;
    --accent-color: #22c55e;
    --glass-tint: rgba(200,255,200,0.25);
    --glass-border: rgba(180,255,180,0.4);
  }

  [data-theme="sunset"] {
    --theme-bg-image: url('https://images.unsplash.com/photo-1610296669228-602fa827fc1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80');
    --btn-top-light: #fdba74;
    --btn-top-dark: #fb923c;
    --btn-bot-light: #ea580c;
    --btn-bot-dark: #c2410c;
    --btn-border: #7c2d12;
    --btn-hover-top-light: #fed7aa;
    --btn-hover-top-dark: #fdba74;
    --btn-hover-bot-light: #f97316;
    --btn-hover-bot-dark: #ea580c;
    --accent-color: #f97316;
    --glass-tint: rgba(255,200,180,0.25);
    --glass-border: rgba(255,200,180,0.4);
  }

  [data-theme="amethyst"] {
    --theme-bg-image: url('https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80');
    --btn-top-light: #d8b4fe;
    --btn-top-dark: #c084fc;
    --btn-bot-light: #9333ea;
    --btn-bot-dark: #6b21a8;
    --btn-border: #4c1d95;
    --btn-hover-top-light: #e9d5ff;
    --btn-hover-top-dark: #d8b4fe;
    --btn-hover-bot-light: #a855f7;
    --btn-hover-bot-dark: #9333ea;
    --accent-color: #a855f7;
    --glass-tint: rgba(220,200,255,0.25);
    --glass-border: rgba(220,200,255,0.4);
  }

  .app-container {
    background: var(--theme-bg-image) no-repeat center center fixed;
    background-size: cover;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #fff;
    overflow: hidden;
    transition: background 0.5s ease-in-out;
  }

  .aero-glass {
    background: linear-gradient(135deg, var(--glass-tint) 0%, rgba(0,0,0,0.1) 100%);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--glass-border);
    box-shadow: 
      0 8px 32px 0 rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255,255,255,0.5),
      inset 0 -1px 0 rgba(0,0,0,0.2);
    border-radius: 16px;
  }

  .aero-button {
    background: linear-gradient(to bottom, var(--btn-top-light) 0%, var(--btn-top-dark) 49%, var(--btn-bot-light) 50%, var(--btn-bot-dark) 100%);
    border: 1px solid var(--btn-border);
    box-shadow: 
      inset 0 1px 2px rgba(255,255,255,0.8), 
      inset 0 -2px 5px rgba(0,0,0,0.2),
      0 4px 6px rgba(0,0,0,0.4);
    color: white;
    text-shadow: 0 1px 2px rgba(0,0,0,0.6);
    border-radius: 12px;
    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
  }

  .aero-button::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 50%;
    background: linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(255,255,255,0));
    border-radius: 12px 12px 0 0;
  }

  .aero-button:hover {
    transform: scale(1.05);
    background: linear-gradient(to bottom, var(--btn-hover-top-light) 0%, var(--btn-hover-top-dark) 49%, var(--btn-hover-bot-light) 50%, var(--btn-hover-bot-dark) 100%);
    box-shadow: 
      inset 0 1px 2px rgba(255,255,255,0.9), 
      0 6px 12px rgba(0,0,0,0.3);
  }

  .aero-button:active {
    transform: scale(0.98);
    background: linear-gradient(to bottom, var(--btn-bot-dark) 0%, var(--btn-bot-light) 49%, var(--btn-top-dark) 50%, var(--btn-top-light) 100%);
  }

  .aero-card {
    background: linear-gradient(135deg, rgba(20, 30, 40, 0.7) 0%, rgba(10, 15, 20, 0.8) 100%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 10px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
    border-radius: 16px;
    transition: all 0.3s ease;
  }

  .aero-card:hover {
    transform: translateY(-5px) scale(1.02);
    border-color: var(--accent-color);
    box-shadow: 0 15px 30px rgba(0,0,0,0.6), 0 0 20px var(--accent-color), inset 0 1px 0 rgba(255,255,255,0.3);
  }

  ::-webkit-scrollbar {
    width: 12px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.2);
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(to right, var(--btn-top-dark), var(--btn-bot-dark));
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.3);
  }
`;

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState('classic'); 

  const [activeStream, setActiveStream] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const [streamingApps, setStreamingApps] = useState([
    { id: 1, name: 'YouTube Premium', url: 'https://youtube.com', color: 'from-red-600 to-red-800' },
    { id: 2, name: 'YT Music', url: 'https://music.youtube.com', color: 'from-gray-800 to-black' },
    { id: 3, name: 'Flow (Personal)', url: 'https://web.flow.com.ar', color: 'from-cyan-400 to-blue-600' },
    { id: 4, name: 'Netflix', url: 'https://netflix.com', color: 'from-red-700 to-black' },
    { id: 5, name: 'Spotify', url: 'https://open.spotify.com', color: 'from-green-500 to-green-700' },
    { id: 6, name: 'Crunchyroll', url: 'https://crunchyroll.com', color: 'from-orange-500 to-orange-700' }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newApp, setNewApp] = useState({ name: '', url: '', color: 'from-blue-500 to-blue-800' });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddApp = () => {
    if (newApp.name && newApp.url) {
      setStreamingApps([...streamingApps, { ...newApp, id: Date.now() }]);
      setShowAddModal(false);
      setNewApp({ name: '', url: '', color: 'from-blue-500 to-blue-800' });
    }
  };

  const removeApp = (id) => {
    setStreamingApps(streamingApps.filter(app => app.id !== id));
  };

  const navigateBrowser = (e) => {
    e.preventDefault();
    let finalUrl = searchInput;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    setActiveStream({ name: 'Navegador Libre', url: finalUrl, color: 'from-gray-500 to-gray-800' });
  };

  const renderHome = () => (
    <div className="p-8 h-full flex flex-col gap-6 overflow-y-auto">
      <div className="grid grid-cols-3 gap-6">
        <div className="aero-glass p-6 col-span-2 flex justify-between items-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-white/20 transition-all"></div>
          <div>
            <h1 className="text-6xl font-bold tracking-tighter drop-shadow-lg">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </h1>
            <p className="text-xl text-white font-semibold drop-shadow mt-2 opacity-90">
              {currentTime.toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="text-right flex flex-col items-end">
            <CloudRain size={48} className="text-white drop-shadow-md mb-2 opacity-90" />
            <h2 className="text-3xl font-bold drop-shadow">18°C</h2>
            <p className="text-white opacity-80">Rosario, Santa Fe</p>
          </div>
        </div>

        <div className="aero-glass p-6 flex flex-col justify-center items-center cursor-pointer hover:bg-white/20 transition-all" onClick={() => setActiveTab('local')}>
          <HardDrive size={48} className="text-white drop-shadow-lg mb-4 opacity-90" />
          <h3 className="text-xl font-bold drop-shadow">Media Local</h3>
          <p className="text-sm text-center text-gray-200 mt-2">1.2 TB Disponibles</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-4 drop-shadow-md flex items-center gap-2">
        <MonitorPlay /> Accesos Directos
      </h2>
      
      <div className="grid grid-cols-4 gap-6">
        {streamingApps.slice(0, 4).map(app => (
          <div key={app.id} className="aero-card p-6 h-40 flex flex-col items-center justify-center cursor-pointer relative group" onClick={() => setActiveStream(app)}>
            <div className={`absolute inset-0 opacity-40 bg-gradient-to-br ${app.color} rounded-2xl group-hover:opacity-60 transition-opacity`}></div>
            <Play size={40} className="mb-3 relative z-10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            <span className="font-bold text-lg relative z-10 text-center drop-shadow-md">{app.name}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStreaming = () => (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold drop-shadow-lg flex items-center gap-3">
          <Tv size={36} className="text-white opacity-90" /> 
          Streaming Hub
        </h1>
        <button className="aero-button px-6 py-2 flex items-center gap-2" onClick={() => setShowAddModal(true)}>
          <Plus size={20} /> Agregar Servicio
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-y-auto pr-4 pb-20">
        {streamingApps.map(app => (
          <div key={app.id} className="aero-card p-0 h-48 flex flex-col relative group overflow-hidden">
            <div className={`absolute inset-0 opacity-50 bg-gradient-to-br ${app.color} transition-opacity group-hover:opacity-80`}></div>
            <button 
              className="absolute top-2 right-2 z-20 bg-red-500/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 shadow-lg"
              onClick={(e) => { e.stopPropagation(); removeApp(app.id); }}
            >
              <X size={16} />
            </button>
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 cursor-pointer" 
                 onClick={() => setActiveStream(app)}>
              <Play size={48} className="mb-4 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] transform group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-center drop-shadow-lg">{app.name}</h3>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="aero-glass p-8 w-96 max-w-full border border-white/50">
            <h2 className="text-2xl font-bold mb-6 drop-shadow-md">Nuevo Servicio</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Nombre</label>
                <input type="text" className="w-full bg-black/40 border border-white/20 rounded p-2 text-white outline-none focus:border-white/50" value={newApp.name} onChange={(e) => setNewApp({...newApp, name: e.target.value})}/>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">URL</label>
                <input type="text" className="w-full bg-black/40 border border-white/20 rounded p-2 text-white outline-none focus:border-white/50" value={newApp.url} onChange={(e) => setNewApp({...newApp, url: e.target.value})}/>
              </div>
              <div className="flex gap-4 mt-6">
                <button className="aero-button flex-1 py-2" onClick={handleAddApp}>Guardar</button>
                <button className="bg-gray-600/50 hover:bg-gray-600 border border-gray-500 rounded flex-1 py-2 transition-colors" onClick={() => setShowAddModal(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderLocalMedia = () => {
    const localFiles = ['The.Matrix.1080p.mkv', 'Interstellar_IMAX.mp4', 'The.Office.S01E01.avi', 'Evangelion.1080p.mkv'];

    return (
      <div className="p-8 h-full flex flex-col">
        <div className="flex items-center gap-4 mb-8">
          <Folder size={36} className="text-white drop-shadow-md opacity-90" />
          <div>
            <h1 className="text-4xl font-bold drop-shadow-lg">Biblioteca Local</h1>
            <p className="text-gray-200">Próximamente: Integración con VLC nativo mediante Tauri</p>
          </div>
        </div>
        <div className="aero-glass flex-1 p-6 flex flex-col gap-4 overflow-hidden relative">
          <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-4 gap-4 pr-2">
            {localFiles.map((file, i) => (
              <div key={i} className="bg-black/40 border border-white/10 rounded-lg p-3 hover:bg-white/10 cursor-pointer group flex flex-col">
                <div className="aspect-video bg-gray-800 rounded mb-3 flex items-center justify-center"><Play size={32} className="text-white/50 group-hover:text-white" /></div>
                <h4 className="text-sm font-semibold truncate">{file}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderBrowser = () => (
    <div className="p-4 h-full flex flex-col gap-4">
      <div className="aero-glass p-5 flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto border-white/30">
        <Globe size={80} className="mb-6 opacity-80" />
        <h2 className="text-3xl font-bold mb-4 drop-shadow-md">Navegador Libre Integrado</h2>
        <form onSubmit={navigateBrowser} className="flex gap-2 w-full">
          <input type="text" className="flex-1 bg-black/50 border border-white/30 rounded-xl px-5 py-3 text-white outline-none font-mono text-lg" placeholder="Ej: https://duckduckgo.com" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          <button type="submit" className="aero-button px-8 py-3 text-lg font-bold">Navegar</button>
        </form>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="p-8 h-full flex flex-col gap-6">
      <h1 className="text-4xl font-bold drop-shadow-lg flex items-center gap-3"><Settings size={36} className="text-white opacity-90" /> Configuración</h1>
      <div className="aero-glass p-8 flex flex-col gap-6">
        <h2 className="text-2xl font-bold border-b border-white/20 pb-4 flex items-center gap-2"><Palette size={24}/> Temas Visuales</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className={`aero-card p-4 flex flex-col items-center gap-3 border-2 ${theme === 'classic' ? 'border-blue-400 scale-105' : 'border-transparent'}`} onClick={() => setTheme('classic')}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-blue-300 to-blue-700 shadow-inner"></div><span className="font-bold">Aero Clásico</span>
          </button>
          <button className={`aero-card p-4 flex flex-col items-center gap-3 border-2 ${theme === 'nature' ? 'border-green-400 scale-105' : 'border-transparent'}`} onClick={() => setTheme('nature')}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-green-300 to-green-700 shadow-inner"></div><span className="font-bold">Naturaleza</span>
          </button>
          <button className={`aero-card p-4 flex flex-col items-center gap-3 border-2 ${theme === 'sunset' ? 'border-orange-400 scale-105' : 'border-transparent'}`} onClick={() => setTheme('sunset')}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-orange-300 to-red-700 shadow-inner"></div><span className="font-bold">Atardecer</span>
          </button>
          <button className={`aero-card p-4 flex flex-col items-center gap-3 border-2 ${theme === 'amethyst' ? 'border-purple-400 scale-105' : 'border-transparent'}`} onClick={() => setTheme('amethyst')}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-purple-300 to-purple-800 shadow-inner"></div><span className="font-bold">Amatista</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderStreamViewer = () => (
    <div className={`flex flex-col w-full h-full transition-all duration-300 ${isFullscreen ? 'absolute inset-0 z-50 bg-black' : 'p-4'}`}>
      {!isFullscreen && (
        <div className="aero-glass mb-4 p-3 flex justify-between items-center shadow-lg border-white/40">
          <button className="aero-button px-4 py-2 flex items-center gap-2 font-semibold" onClick={() => setActiveStream(null)}><ArrowLeft size={20} /> Volver</button>
          <h2 className="text-2xl font-bold tracking-wide drop-shadow-md flex items-center gap-2"><MonitorPlay size={24}/> {activeStream.name}</h2>
          <button className="aero-button px-4 py-2 flex items-center gap-2 font-semibold" onClick={() => setIsFullscreen(true)}><Maximize size={20} /> Pantalla Completa</button>
        </div>
      )}
      {isFullscreen && (
        <button className="absolute top-4 right-4 z-[60] p-3 bg-black/60 text-white rounded-full hover:bg-black/90 transition-colors backdrop-blur-md border border-white/20 shadow-2xl group" onClick={() => setIsFullscreen(false)}>
          <Minimize size={24} className="group-hover:scale-110 transition-transform"/>
        </button>
      )}
      <div className={`flex-1 relative overflow-hidden bg-[#0f0f0f] flex items-center justify-center ${isFullscreen ? '' : 'aero-glass p-1 rounded-2xl shadow-inner border-white/30'}`}>
         <iframe src={activeStream.url} className={`w-full h-full border-0 relative z-10 ${isFullscreen ? '' : 'rounded-xl'}`} title={activeStream.name} sandbox="allow-same-origin allow-scripts allow-forms"></iframe>
      </div>
    </div>
  );

  return (
    <>
      <style>{aeroStyles}</style>
      <div className="app-container flex h-screen w-full" data-theme={theme}>
        {activeStream ? renderStreamViewer() : (
          <>
            <div className="w-64 flex flex-col p-4 z-10">
              <div className="aero-glass flex-1 flex flex-col py-6 px-3 shadow-2xl border-white/30">
                <div className="flex items-center gap-3 px-4 mb-10 drop-shadow-md">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-white/80 to-white/20 p-[1px] shadow-lg">
                    <div className="w-full h-full bg-black/30 rounded-full backdrop-blur-sm flex items-center justify-center">
                       <Tv size={20} className="text-white drop-shadow-md"/>
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-lg">AeroTV</h1>
                </div>
                <nav className="flex flex-col gap-2 flex-1">
                  <NavItem icon={<Tv />} label="Inicio" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
                  <NavItem icon={<MonitorPlay />} label="Streaming" active={activeTab === 'streaming'} onClick={() => setActiveTab('streaming')} />
                  <NavItem icon={<Folder />} label="Media Local" active={activeTab === 'local'} onClick={() => setActiveTab('local')} />
                  <NavItem icon={<Globe />} label="Navegador Libre" active={activeTab === 'browser'} onClick={() => setActiveTab('browser')} />
                </nav>
                <div className="mt-auto border-t border-white/20 pt-4">
                  <NavItem icon={<Settings />} label="Configuración" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                </div>
              </div>
            </div>
            <div className="flex-1 relative z-0">
              {activeTab === 'home' && renderHome()}
              {activeTab === 'streaming' && renderStreaming()}
              {activeTab === 'local' && renderLocalMedia()}
              {activeTab === 'browser' && renderBrowser()}
              {activeTab === 'settings' && renderSettings()}
            </div>
          </>
        )}
      </div>
    </>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left font-semibold text-shadow-sm ${active ? 'aero-button shadow-lg text-white font-bold' : 'hover:bg-white/20 text-gray-100 hover:text-white border border-transparent hover:border-white/30'}`}>
      <span className={active ? 'drop-shadow-md scale-110 transition-transform' : 'opacity-90'}>{icon}</span>
      <span className={active ? 'drop-shadow-md' : ''}>{label}</span>
    </button>
  );
}