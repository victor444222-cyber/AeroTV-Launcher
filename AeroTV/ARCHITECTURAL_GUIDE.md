# AeroTV Launcher - Guía Arquitectónica

## 📋 Resumen de Refactorización

El componente `App.jsx` ha sido refactorizado siguiendo principios SOLID y patrones de React modernos. La solución elimina dependencias externas manteniendo funcionalidad rica.

---

## 🏗️ Estructura de Componentes

```
src/
├── App.jsx                          # Componente principal (limpio y modular)
├── components/
│   ├── Toast.jsx                    # Sistema de notificaciones sin dependencias
│   ├── ErrorBoundary.jsx            # Error boundary específico para streaming
│   └── LoadingSpinner.jsx           # Spinner de carga reutilizable
└── hooks/
    ├── useStreamingLauncher.js      # Hook para abrir ventanas + detectar bloqueos
    └── useToast.js                  # Hook para gestionar toasts
```

---

## 🎯 Cambios Principales

### 1. **Hook `useStreamingLauncher`**
**Ubicación:** `src/hooks/useStreamingLauncher.js`

**Responsabilidades:**
- Gestiona el estado de carga (`loadingId`)
- Abre ventanas emergentes con validación de bloqueos
- Detecta si el navegador bloqueó la ventana mediante `window.open()`
- Lanza errores estructurados para manejo coherente

**Uso:**
```javascript
const { loadingId, openStreamingApp, isLoading } = useStreamingLauncher();

await openStreamingApp(url, appId);
```

**Ventajas:**
- ✅ Lógica centralizada y reutilizable
- ✅ Fácil de testear en aislamiento
- ✅ Separación de concerns clara

---

### 2. **Hook `useToast`**
**Ubicación:** `src/hooks/useToast.js`

**Responsabilidades:**
- Gestiona cola de notificaciones
- Proporciona métodos para mostrar: `error()`, `success()`, `info()`
- Auto-elimina toasts después de timeout configurable

**Uso:**
```javascript
const { toasts, removeToast, error, success, info } = useToast();

success('Ventana abierta correctamente');
error('El navegador bloqueó la ventana');
```

**Ventajas:**
- ✅ Sin dependencias externas (react-toastify)
- ✅ API simple e intuitiva
- ✅ Totalmente controlable

---

### 3. **ErrorBoundary Específico**
**Ubicación:** `src/components/ErrorBoundary.jsx`

**Características:**
- Captura errores en todo el árbol de componentes
- UI elegante con instrucciones claras
- Botón para reintentar
- Ideal para errores en lanzamiento de streaming

**Uso:**
```javascript
<StreamingErrorBoundary>
  <AppContent />
</StreamingErrorBoundary>
```

**Mejoras sobre `alert()`:**
- ✅ UI integrada (no intrusiva)
- ✅ Mejor UX
- ✅ Preparado para integración con servicios de monitoreo

---

### 4. **Sistema Toast**
**Ubicación:** `src/components/Toast.jsx`

**Características:**
- 3 tipos: `error`, `success`, `info`
- Animación de entrada suave
- Auto-cierre configurable
- Botón para cerrar manual
- Estilos glassmorphism

**Uso:**
```javascript
<ToastContainer toasts={toasts} removeToast={removeToast} />
```

**Estilos:**
- 🔴 Error: Rojo con icono de alerta
- 🟢 Success: Verde con icono de checkmark
- 🔵 Info: Azul con icono de info

---

### 5. **LoadingSpinner**
**Ubicación:** `src/components/LoadingSpinner.jsx`

**Características:**
- Tamaños: `sm`, `md`, `lg`, `xl`
- SVG nativo (sin dependencias de imagen)
- Animación smooth
- Clase CSS `animate-spin`

**Uso:**
```javascript
{isLoading(appId) ? (
  <LoadingSpinner size="lg" className="text-white" />
) : (
  <PlayIcon size={40} />
)}
```

---

## 🔄 Flujo de Datos

### Caso: Usuario abre una aplicación de streaming

```
1. Usuario hace click en app
   ↓
2. handleStreamingClick() inicia
   ↓
3. openStreamingApp(url, appId) comienza
   └─ setLoadingId(appId) → botón muestra spinner
   ↓
4. window.open() se ejecuta
   ├─ ✅ Ventana abierta → showSuccess()
   └─ ❌ Bloqueada → showError()
   ↓
5. setLoadingId(null) → botón vuelve a normal
   ↓
6. Toast aparece en esquina inferior derecha
   (auto-desaparece en 4 segundos)
```

---

## 🚀 Mejoras de Rendimiento

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Estado innecesario** | ✅ Componente monolítico | ✅ Lógica extraída a hooks |
| **Re-renders** | ❌ Toda la app en cada cambio | ✅ Solo componentes afectados |
| **Dependencias** | ❌ Alert() global | ✅ Sistema modular |
| **Testabilidad** | ❌ Difícil de testear | ✅ Hooks testables aisladamente |

---

## 📦 Dependencias

**Sin cambios en `package.json`**
- React 19.1.0 ✅
- Lucide-react 1.17.0 ✅
- TailwindCSS 4.3.0 ✅

**Cero dependencias nuevas** 🎉

---

## 🧪 Ejemplos de Manejo de Errores

### Caso 1: Navegador bloqueó popup
```javascript
// Error capturado automáticamente
await openStreamingApp('https://netflix.com', 4);
// → Toast rojo: "El navegador bloqueó la ventana emergente..."
```

### Caso 2: URL inválida en navegador
```javascript
if (!browserUrl.trim()) {
  showError('Por favor, ingresa una URL válida');
}
```

### Caso 3: Error en componente
```javascript
// ErrorBoundary captura y muestra UI elegante
// Usuario puede hacer click en "Reintentar"
```

---

## 🔧 Extensión Futura

### Agregar analytics:
```javascript
// En useStreamingLauncher.js
const openStreamingApp = useCallback(async (url, appId) => {
  trackEvent('app_opened', { appId, url });
  // ... resto del código
}, []);
```

### Integrar servicio de monitoreo:
```javascript
// En ErrorBoundary.jsx
componentDidCatch(error, errorInfo) {
  logToSentry(error, errorInfo); // ← Agregar aquí
}
```

### Persistir preferencias de tema:
```javascript
// En App.jsx
useEffect(() => {
  localStorage.setItem('theme', theme);
}, [theme]);
```

---

## ✨ Checklist de Validación

- ✅ Spinner visible durante carga
- ✅ Toasts sin dependencias externas
- ✅ ErrorBoundary captura errores
- ✅ Detección automática de popups bloqueados
- ✅ Componente App limpio y legible
- ✅ Hooks reutilizables
- ✅ Cero dependencias nuevas
- ✅ Estilos consistentes con Aero Glass
- ✅ Comentarios JSDoc en funciones
