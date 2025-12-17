import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error to console in development
        console.error('Error caught by boundary:', error, errorInfo);

        // In production, you could send this to an error reporting service
        // like Sentry, LogRocket, etc.
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background px-6">
                    <div className="max-w-md w-full text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                                <AlertTriangle className="w-10 h-10 text-destructive" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                                Oops! Something went wrong
                            </h1>
                            <p className="text-muted-foreground">
                                We encountered an unexpected error. Don't worry, it's not your fault!
                            </p>
                        </div>

                        {this.state.error && (
                            <div className="text-left">
                                <details className="glass-card p-4 rounded-lg cursor-pointer">
                                    <summary className="text-sm font-mono text-muted-foreground">
                                        Error Details
                                    </summary>
                                    <pre className="mt-3 text-xs text-destructive overflow-auto">
                                        {this.state.error.toString()}
                                    </pre>
                                </details>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="px-6 py-3 bg-gradient-cyber text-primary-foreground rounded-full font-medium hover:shadow-neon transition-all"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="px-6 py-3 glass rounded-full font-medium hover:bg-secondary/80 transition-all"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
