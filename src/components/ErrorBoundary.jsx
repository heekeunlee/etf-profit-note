import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("ErrorBoundary caught an error", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
                    <div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong.</h2>
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100 mb-6">
                            <p className="font-mono text-sm text-red-800 break-words">
                                {this.state.error && this.state.error.toString()}
                            </p>
                        </div>
                        <details className="text-xs text-gray-500 cursor-pointer">
                            <summary className="mb-2 font-medium hover:text-gray-700">Error Stack Trace</summary>
                            <pre className="whitespace-pre-wrap bg-gray-50 p-2 rounded overflow-x-auto">
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
