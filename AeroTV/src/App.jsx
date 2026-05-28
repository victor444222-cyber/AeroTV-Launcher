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
  Palette
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
  const [streamingApps, setStreamingApps] = useState([
    { id: 1, name: 'YouTube', url: 'https://youtube.com', color: 'from-red-600 to-red-800' },
    { id: 2, name: 'YT Music', url: 'https://music.youtube.com', color: 'from-gray-800 to-black' },
    { id: 3, name: 'Flow', url: 'https://web.flow.com.ar', color: 'from-cyan-400 to-blue-600' },
    { id: 4, name: 'Netflix', url: 'https://netflix.com', color: 'from-red-700 to-black' },
    { id: 5, name: 'Spotify', url: 'https://open.spotify.com', color: 'from-green-500 to-green-700' },
    { id: 6, name: 'Crunchyroll', url: 'https://crunchyroll.com', color: 'from-orange-500 to-orange-700' }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newApp, setNewApp] = useState({ name: '', url: '', color: 'from-blue-500 to-blue-800' });
  const [aiQuery, setAiQuery] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [fileMetadata, setFileMetadata] = useState(null);
  const [analyzingFile, setAnalyzingFile] = useState(null);
  const [browserUrl, setBrowserUrl] = useState('');

  // --- LÓGICA DE APERTURA NATIVA ---
  const openStreamingApp = (app) => {
    try {
      const windowName = `stream_${app.id}`;
      const win = window.open(app.url, windowName, 'width=1280,height=720,scrollbars=yes,resizable=yes');
      if (win) {
        win.focus();
      } else {
        alert("El navegador bloqueó la ventana emergente. Por favor, permítelas para este sitio.");
      }
    } catch (e) {
      console.error("Error al abrir ventana:", e);
    }
  };

  const navigateBrowser = (e) => {
    e.preventDefault();
    let finalUrl = browserUrl.startsWith('http') ? browserUrl : `https://${browserUrl}`;
    window.open(finalUrl, '_blank', 'width=1000,height=600');
  };

  const fetchGemini = async (prompt, isJson = false) => {
    const apiKey = "";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    try {
      const res = await fetch(url, { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: isJson ? { responseMimeType: "application/json" } : {} }) });
      const data = await res.json();
      return data.candidates[0].content.parts[0].text;
    } catch { return null; }
  };

  const handleAskAI = async () => {
    if (!aiQuery) return;
    setIsAiLoading(true);
    const response = await fetchGemini(`Actúa como experto en cine. Recomienda 3 títulos para: "${aiQuery}".`);
    setAiRecommendation(response || "Error de conexión.");
    setIsAiLoading(false);
  };

  const handleAnalyzeFile = async (filename) => {
    setAnalyzingFile(filename);
    const response = await fetchGemini(`Analiza: "${filename}". Devuelve JSON: { "title": "...", "year": "...", "type": "...", "synopsis": "...", "quality": "..." }`, true);
    if (response) setFileMetadata({ ...JSON.parse(response), originalFile: filename });
    setAnalyzingFile(null);
  };

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

  const removeApp = (id) => setStreamingApps(streamingApps.filter(app => app.id !== id));

  const NavItem = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left font-semibold ${active ? 'aero-button text-white' : 'hover:bg-white/20 text-gray-100'}`}>
      {icon} <span>{label}</span>
    </button>
  );

  return (
    <>
      <style>{aeroStyles}</style>
      <div className="app-container flex h-screen w-full" data-theme={theme}>
        <div className="w-64 flex flex-col p-4 z-10">
          <div className="aero-glass flex-1 flex flex-col py-6 px-3">
            <h1 className="text-2xl font-bold px-4 mb-10">AeroTV</h1>
            <nav className="flex flex-col gap-2 flex-1">
              <NavItem icon={<Tv />} label="Inicio" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
              <NavItem icon={<MonitorPlay />} label="Streaming" active={activeTab === 'streaming'} onClick={() => setActiveTab('streaming')} />
              <NavItem icon={<Folder />} label="Media Local" active={activeTab === 'local'} onClick={() => setActiveTab('local')} />
              <NavItem icon={<Globe />} label="Navegador" active={activeTab === 'browser'} onClick={() => setActiveTab('browser')} />
            </nav>
            <div className="mt-auto pt-4 border-t border-white/20">
              <NavItem icon={<Settings />} label="Configuración" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'home' && (
            <div className="p-8">
              <div className="aero-glass p-8 mb-6">
                <h1 className="text-6xl font-bold">{currentTime.toLocaleTimeString()}</h1>
                <p className="text-xl opacity-90 mt-2">{currentTime.toLocaleDateString()}</p>
              </div>
              <div className="grid grid-cols-4 gap-6">
                {streamingApps.slice(0, 4).map(app => (
                  <div key={app.id} className="aero-card p-6 h-40 flex flex-col items-center justify-center cursor-pointer" onClick={() => openStreamingApp(app)}>
                    <Play size={40} />
                    <span className="font-bold mt-3">{app.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'streaming' && (
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Streaming Hub</h1>
                <button className="aero-button px-6 py-2" onClick={() => setShowAddModal(true)}>Agregar Servicio</button>
              </div>
              <div className="grid grid-cols-4 gap-6">
                {streamingApps.map(app => (
                  <div key={app.id} className="aero-card p-6 h-40 flex flex-col items-center justify-center cursor-pointer group" onClick={() => openStreamingApp(app)}>
                    <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); removeApp(app.id); }}><X size={16} /></button>
                    <Play size={40} />
                    <span className="font-bold mt-3">{app.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'local' && (
             <div className="p-8">
                <h1 className="text-4xl font-bold mb-8">Biblioteca Local</h1>
                <div className="grid grid-cols-4 gap-4">
                  {['Matrix.mkv', 'Inception.mp4', 'Office.avi'].map((file, i) => (
                     <div key={i} className="aero-card p-4">
                        <p className="truncate mb-4">{file}</p>
                        <button className="aero-button w-full py-2" onClick={() => handleAnalyzeFile(file)}>Analizar IA</button>
                     </div>
                  ))}
                </div>
             </div>
          )}

          {activeTab === 'browser' && (
            <div className="p-8 flex flex-col items-center justify-center h-full">
               <form onSubmit={navigateBrowser} className="w-full max-w-lg flex gap-2">
                  <input type="text" className="flex-1 bg-black/40 p-3 rounded" value={browserUrl} onChange={(e) => setBrowserUrl(e.target.value)} placeholder="URL..." />
                  <button type="submit" className="aero-button px-6">Ir</button>
               </form>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-8">
               <h1 className="text-4xl font-bold">Configuración</h1>
               <div className="grid grid-cols-4 gap-4 mt-6">
                  {['classic', 'nature', 'sunset', 'amethyst'].map(t => (
                     <button key={t} className="aero-card p-4" onClick={() => setTheme(t)}>{t.toUpperCase()}</button>
                  ))}
               </div>
            </div>
          )}
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="aero-glass p-8 w-96">
              <input type="text" className="w-full bg-black/40 p-2 mb-4" placeholder="Nombre" value={newApp.name} onChange={(e) => setNewApp({...newApp, name: e.target.value})} />
              <input type="text" className="w-full bg-black/40 p-2 mb-4" placeholder="URL" value={newApp.url} onChange={(e) => setNewApp({...newApp, url: e.target.value})} />
              <button className="aero-button w-full py-2" onClick={handleAddApp}>Agregar</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}