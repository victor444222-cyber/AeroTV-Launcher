# 🏗️ Diagrama de Arquitectura - AeroTV Launcher

## Estructura de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                        App.jsx (Principal)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  StreamingErrorBoundary               │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │             AppContent (Component)              │  │  │
│  │  │                                                 │  │  │
│  │  │  Hooks utilizados:                             │  │  │
│  │  │  • useStreamingLauncher() → loadingId, open    │  │  │
│  │  │  • useToast() → {error, success, info}         │  │  │
│  │  │                                                 │  │  │
│  │  │  State:                                        │  │  │
│  │  │  • currentTime, activeTab, theme              │  │  │
│  │  │  • browserUrl                                 │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │                                                        │  │
│  │  Componentes Renderizados:                            │  │
│  │  • ToastContainer (notificaciones)                    │  │
│  │  • LoadingSpinner (mientras se carga)                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

                          ↓
                  ┌───────┴───────┬──────────────┐
                  ↓               ↓              ↓
         ┌────────────────┐ ┌────────────┐ ┌──────────────┐
         │  Hooks (Logic)  │ │ Components │ │   Utilities  │
         └────────────────┘ └────────────┘ └──────────────┘
```

---

## Flujo de Datos - Abrir una Aplicación de Streaming

```
Usuario hace click
    ↓
handleStreamingClick(app)
    ↓
openStreamingApp(app.url, app.id) [useStreamingLauncher]
    ├─ setLoadingId(app.id) → UI muestra spinner
    ├─ window.open(url, '_blank', ...)
    ├─ Verifica si win === null (bloqueado)
    ├─ Espera 500ms (para que spinner sea visible)
    └─ setLoadingId(null) → spinner desaparece
       ↓
    ┌──────────────────────┬───────────────────────┐
    ↓                      ↓
Éxito               Bloqueado por navegador
    ↓                      ↓
showSuccess()        showError()
    ↓                      ↓
Toast verde         Toast rojo (4s auto-close)
```

---

## Componentes e Interfaces

### 1. Hook: `useStreamingLauncher`

```
┌─────────────────────────────────────────────────┐
│        useStreamingLauncher()                    │
├─────────────────────────────────────────────────┤
│ Input:  (url: string, appId: number)            │
│                                                 │
│ State:  [loadingId, setLoadingId]              │
│                                                 │
│ Return: {                                       │
│   loadingId: number | null,                     │
│   openStreamingApp: async (url, id) => void,   │
│   isLoading: (id) => boolean                    │
│ }                                               │
└─────────────────────────────────────────────────┘
```

### 2. Hook: `useToast`

```
┌─────────────────────────────────────────────────┐
│        useToast()                               │
├─────────────────────────────────────────────────┤
│ State:  [toasts, setToasts]                    │
│                                                 │
│ Return: {                                       │
│   toasts: Toast[],                              │
│   addToast: (msg, type, autoClose) => id,      │
│   removeToast: (id) => void,                    │
│   error: (msg, autoClose?) => id,              │
│   success: (msg, autoClose?) => id,            │
│   info: (msg, autoClose?) => id                │
│ }                                               │
└─────────────────────────────────────────────────┘
```

### 3. Component: `Toast`

```
┌──────────────────────────────────────────────────┐
│  Toast                                            │
├──────────────────────────────────────────────────┤
│  Props:                                          │
│  • message: string                              │
│  • type: 'error' | 'success' | 'info'          │
│  • onClose: () => void                         │
│  • autoClose: number (ms)                      │
│                                                 │
│  Visual:  [Icon] Message [X Close Button]       │
│  Auto-desaparece en autoClose ms                │
│  Animación: slideIn desde derecha               │
└──────────────────────────────────────────────────┘
```

### 4. Component: `ErrorBoundary`

```
┌──────────────────────────────────────────────────┐
│  StreamingErrorBoundary                         │
├──────────────────────────────────────────────────┤
│  Captura:  Errores en árbol de componentes       │
│                                                 │
│  Muestra:  UI elegante con:                     │
│  • Icono de error                               │
│  • Mensaje descriptivo                         │
│  • Error stack trace (desarrollador)           │
│  • Botón "Reintentar"                          │
│                                                 │
│  Extensible: Agregar logErrorToService()       │
└──────────────────────────────────────────────────┘
```

### 5. Component: `LoadingSpinner`

```
┌──────────────────────────────────────────────────┐
│  LoadingSpinner                                 │
├──────────────────────────────────────────────────┤
│  Props:                                         │
│  • size: 'sm' | 'md' | 'lg' | 'xl'            │
│  • className?: string                          │
│                                                 │
│  Render:  SVG animado (animate-spin)           │
│  Uso:     Mostrar mientras isLoading(appId)    │
└──────────────────────────────────────────────────┘
```

---

## Tabla de Dependencias

| Módulo | Importa | Tipo |
|--------|---------|------|
| `App.jsx` | `useStreamingLauncher` | Hook |
| `App.jsx` | `useToast` | Hook |
| `App.jsx` | `StreamingErrorBoundary` | Component |
| `App.jsx` | `ToastContainer` | Component |
| `App.jsx` | `LoadingSpinner` | Component |
| `ErrorBoundary.jsx` | `lucide-react` | Icon |
| `Toast.jsx` | `lucide-react` | Icons |
| `Toast.jsx` | `ToastContainer` | Export |

**Cero dependencias circulares** ✅

---

## Estados y Transiciones

### Estado de Aplicación (App.jsx)
```
┌──────────────────┐
│  HOME TAB        │
├──────────────────┤
│ • currentTime    │
│ • streamingApps  │
│ • loadingId      │ ← de useStreamingLauncher
│ • toasts[]       │ ← de useToast
│ • theme          │
└──────────────────┘
```

### Estado de Loading
```
loadingId = null
    ↓ [Usuario hace click en app #4]
loadingId = 4  [Spinner visible]
    ↓ [Espera 500ms + window.open completa]
loadingId = null [Spinner desaparece]
```

### Estado de Toasts
```
toasts = []
    ↓ [showError() llamado]
toasts = [{ id, message, type: 'error', ... }]
    ↓ [4000ms después]
toasts = [] [Auto-remove]
```

---

## Flujo de Errores

```
┌─────────────────────────────────────────┐
│ Usuario hace click en aplicación        │
└────────────┬────────────────────────────┘
             ↓
    ┌────────────────────────┐
    │ try { openStreamingApp │
    └────────────┬───────────┘
                 ↓
    ┌────────────────────────────────────┐
    │ window.open() retorna null/false?  │
    └────────┬─────────────────────────┬─┘
             ↓                         ↓
        ✅ Éxito              ❌ Bloqueado
             ↓                         ↓
      showSuccess()          throw new Error('POPUP_BLOCKED')
             ↓                         ↓
      Toast verde ✓          catch(err) → showError()
      (auto close)                     ↓
                           Toast rojo ✗ (auto close)
```

---

## Guía de Integración Futura

### Agregar monitoreo de errores:
```javascript
// En ErrorBoundary.jsx
componentDidCatch(error, errorInfo) {
  Sentry.captureException(error); // ← Una línea
  this.setState({ error, errorInfo });
}
```

### Agregar persistencia:
```javascript
// En App.jsx useEffect
useEffect(() => {
  localStorage.setItem('theme', theme);
  localStorage.setItem('lastTab', activeTab);
}, [theme, activeTab]);
```

### Agregar analytics:
```javascript
// En useStreamingLauncher.js
const openStreamingApp = useCallback(async (url, appId) => {
  analytics.trackEvent('app_opened', { appId }); // ← Una línea
  // ... resto del código
}, []);
```

---

## Conclusión

La arquitectura es:
- **Modular**: Cada concepto en su propio archivo
- **Extensible**: Fácil agregar nuevas features
- **Testeable**: Hooks aislables del UI
- **Mantenible**: Separación clara de concerns
- **Escalable**: Preparada para crecimiento
