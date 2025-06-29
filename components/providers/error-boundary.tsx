'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <ErrorFallback
            error={this.state.error}
            resetError={() => this.setState({ hasError: false })}
          />
        )
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  resetError: () => void;
}

function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const router = useRouter();

  const handleReset = () => {
    resetError();
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="panel-game-show max-w-md w-full p-6 text-center">
        <div className="text-6xl mb-4">🎰</div>
        <h1 className="text-2xl font-bold text-game-show text-red-bright mb-2">
          GAME ERROR!
        </h1>
        <p className="text-muted mb-6">
          Something went wrong. The wheel of fortune has stopped spinning.
        </p>
        {error && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-muted hover:text-yellow-bright">
              Error details
            </summary>
            <pre className="mt-2 text-xs bg-black/20 p-2 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
        <button
          onClick={handleReset}
          className="btn-game-show text-white px-6 py-2"
        >
          RETURN HOME
        </button>
      </div>
    </div>
  );
}