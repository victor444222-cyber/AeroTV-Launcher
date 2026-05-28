import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Error Boundary para capturar errores en el árbol de componentes.
 * Específicamente optimizado para el lanzador de streaming.
 */
export class StreamingErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Aquí podrías enviar logs a un servicio de monitoreo
    // logErrorToService(error, errorInfo);
  }

  resetError = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-900/20 to-red-950/20">
          <div className="aero-glass p-8 max-w-md text-center rounded-2xl">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
            <h1 className="text-2xl font-bold mb-2 text-red-200">
              Error en el Lanzador
            </h1>
            <p className="text-white/70 mb-4">
              Algo salió mal. Por favor, intenta de nuevo.
            </p>
            <p className="text-xs text-red-300/50 mb-6 font-mono break-all max-h-24 overflow-auto">
              {this.state.error?.message}
            </p>
            <button
              onClick={this.resetError}
              className="aero-button px-6 py-3 font-semibold hover:scale-105 transition-all"
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
