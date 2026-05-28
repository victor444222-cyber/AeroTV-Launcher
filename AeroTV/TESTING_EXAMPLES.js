// Ejemplos de pruebas unitarias para los hooks refactorizados
// Estos ejemplos usan Vitest + React Testing Library

// ============================================
// Test para useStreamingLauncher
// ============================================

import { renderHook, act } from '@testing-library/react';
import { useStreamingLauncher } from '../hooks/useStreamingLauncher';

describe('useStreamingLauncher', () => {
  beforeEach(() => {
    // Mock window.open
    global.window.open = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('debería establecer loadingId al abrir aplicación', async () => {
    const { result } = renderHook(() => useStreamingLauncher());

    global.window.open.mockReturnValue({ closed: false });

    await act(async () => {
      await result.current.openStreamingApp('https://netflix.com', 4);
    });

    // loadingId debería volver a null después de completarse
    expect(result.current.loadingId).toBeNull();
  });

  test('debería lanzar error si la ventana es bloqueada', async () => {
    const { result } = renderHook(() => useStreamingLauncher());

    global.window.open.mockReturnValue(null); // Ventana bloqueada

    await act(async () => {
      try {
        await result.current.openStreamingApp('https://netflix.com', 4);
      } catch (error) {
        expect(error.code).toBe('POPUP_BLOCKED');
        expect(error.message).toContain('navegador bloqueó');
      }
    });
  });

  test('debería indicar que está cargando correctamente', async () => {
    const { result } = renderHook(() => useStreamingLauncher());

    global.window.open.mockReturnValue({ closed: false });

    const promise = act(async () => {
      await result.current.openStreamingApp('https://youtube.com', 1);
    });

    // Durante la carga, isLoading debería retornar true para el appId
    expect(result.current.isLoading(1)).toBe(true);
    expect(result.current.isLoading(2)).toBe(false);

    await promise;

    // Después, debería retornar false
    expect(result.current.isLoading(1)).toBe(false);
  });
});

// ============================================
// Test para useToast
// ============================================

import { useToast } from '../hooks/useToast';

describe('useToast', () => {
  test('debería agregar notificación de error', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.error('Error de prueba');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe('error');
    expect(result.current.toasts[0].message).toBe('Error de prueba');
  });

  test('debería agregar notificación de éxito', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Operación exitosa');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe('success');
  });

  test('debería remover toast por ID', () => {
    const { result } = renderHook(() => useToast());

    let toastId;
    act(() => {
      toastId = result.current.addToast('Mensaje', 'info');
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.removeToast(toastId);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  test('debería permitir múltiples toasts simultáneos', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.error('Error 1');
      result.current.success('Success 1');
      result.current.info('Info 1');
    });

    expect(result.current.toasts).toHaveLength(3);
  });
});

// ============================================
// Test para ErrorBoundary
// ============================================

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StreamingErrorBoundary } from '../components/ErrorBoundary';

describe('StreamingErrorBoundary', () => {
  // Componente que lanza error para pruebas
  const ThrowError = () => {
    throw new Error('Error de prueba en componente');
  };

  test('debería capturar error y mostrar UI', () => {
    render(
      <StreamingErrorBoundary>
        <ThrowError />
      </StreamingErrorBoundary>
    );

    expect(screen.getByText('Error en el Lanzador')).toBeInTheDocument();
    expect(screen.getByText(/algo salió mal/i)).toBeInTheDocument();
  });

  test('debería mostrar mensaje de error', () => {
    render(
      <StreamingErrorBoundary>
        <ThrowError />
      </StreamingErrorBoundary>
    );

    expect(screen.getByText('Error de prueba en componente')).toBeInTheDocument();
  });

  test('debería permitir reintentar', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <StreamingErrorBoundary>
        <ThrowError />
      </StreamingErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /reintentar/i });
    await user.click(button);

    // Aquí podrías re-renderizar con un componente que no lance error
    rerender(
      <StreamingErrorBoundary>
        <div>Contenido recuperado</div>
      </StreamingErrorBoundary>
    );

    expect(screen.getByText('Contenido recuperado')).toBeInTheDocument();
  });
});

// ============================================
// Test de Integración: App.jsx
// ============================================

import App from '../App';

describe('App - Integración', () => {
  test('debería mostrar spinner al hacer click en app de streaming', async () => {
    const user = userEvent.setup();
    
    global.window.open = vi.fn().mockReturnValue({ closed: false });

    render(<App />);

    // Navegar a tab streaming
    const streamingBtn = screen.getByText(/streaming/i);
    await user.click(streamingBtn);

    // Hacer click en primera app
    const appBtn = screen.getAllByRole('button').find(btn => 
      btn.textContent.includes('YouTube')
    );

    await user.click(appBtn);

    // El spinner debería aparecer
    const spinner = appBtn.querySelector('svg');
    expect(spinner).toHaveClass('animate-spin');
  });

  test('debería mostrar toast de error si popup es bloqueado', async () => {
    const user = userEvent.setup();
    
    global.window.open = vi.fn().mockReturnValue(null);

    render(<App />);

    const streamingBtn = screen.getByText(/streaming/i);
    await user.click(streamingBtn);

    const appBtn = screen.getAllByRole('button')[0];
    await user.click(appBtn);

    // Esperar a que aparezca el toast de error
    await screen.findByText(/navegador bloqueó/i);
    expect(screen.getByText(/navegador bloqueó/i)).toBeInTheDocument();
  });
});

// ============================================
// Notas sobre Testing
// ============================================

/*
CONFIGURACIÓN RECOMENDADA (vite.config.js):

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
  },
});

SETUP (src/test/setup.js):

import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

DEPENDENCIAS DEV:

"@testing-library/react": "^15.0.0",
"@testing-library/user-event": "^15.0.0",
"vitest": "^1.0.0",
"jsdom": "^24.0.0"
*/
