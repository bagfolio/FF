import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from './button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorCount: 0,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    
    // Update state with error details
    this.setState(prevState => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-pattern-hexagon opacity-5"></div>
          
          {/* Error content */}
          <div className="relative z-10 max-w-2xl w-full">
            <div className="glass-morph-dark rounded-2xl p-8 md:p-12 text-center space-y-6">
              {/* Error icon with glow */}
              <div className="inline-flex p-4 rounded-full glass-morph-dark">
                <AlertTriangle className="w-16 h-16 text-yellow-500 drop-shadow-glow animate-pulse-slow" />
              </div>

              {/* Error title */}
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bebas text-white">
                  Oops! Algo deu errado
                </h1>
                <p className="text-gray-400 text-lg">
                  Encontramos um erro inesperado. Não se preocupe, já estamos trabalhando nisso!
                </p>
              </div>

              {/* Error details (development only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="glass-morph rounded-lg p-4 text-left space-y-2 max-h-48 overflow-auto">
                  <div className="flex items-center gap-2 text-red-400 font-semibold">
                    <Bug className="w-4 h-4" />
                    <span className="text-sm">Detalhes do erro:</span>
                  </div>
                  <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="text-xs text-gray-400 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}

              {/* Error count warning */}
              {this.state.errorCount > 2 && (
                <div className="glass-morph-yellow rounded-lg p-3 text-sm text-yellow-200">
                  <p>
                    Este erro ocorreu {this.state.errorCount} vezes. 
                    Considere recarregar a página completamente.
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button
                  onClick={this.handleReset}
                  className="glass-morph hover:glass-morph-green transition-all duration-300 text-white border-green-500/20"
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>
                
                <Button
                  onClick={this.handleReload}
                  className="glass-morph hover:glass-morph-yellow transition-all duration-300 text-white border-yellow-500/20"
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Recarregar Página
                </Button>
                
                <Button
                  onClick={this.handleGoHome}
                  className="glass-morph hover:glass-morph-blue transition-all duration-300 text-white border-blue-500/20"
                  variant="outline"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Ir para Início
                </Button>
              </div>

              {/* Support message */}
              <div className="pt-4 text-sm text-gray-500">
                <p>
                  Se o problema persistir, entre em contato com o suporte: {' '}
                  <a 
                    href="mailto:suporte@revela.com" 
                    className="text-green-400 hover:text-green-300 underline transition-colors"
                  >
                    suporte@revela.com
                  </a>
                </p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-yellow-500/10 rounded-full blur-xl animate-pulse-slow"></div>
            <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-green-500/10 rounded-full blur-xl animate-pulse-slow animation-delay-1000"></div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Convenience wrapper for functional components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  return (props: P) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  );
}

// Hook to trigger error boundary (for testing)
export function useErrorHandler() {
  return (error: Error) => {
    throw error;
  };
}