import { Component, ErrorInfo, ReactNode } from "react";
import { reportClientError } from "../../lib/telemetry";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    reportClientError(error, errorInfo.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
          <div className="max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <p className="text-sm font-semibold text-error-600">Something went wrong</p>
            <h1 className="mt-2 text-xl font-semibold">We hit a snag</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              An unexpected error occurred. Please try refreshing the page. If the problem persists, contact support with the steps that led here.
            </p>
            {this.state.error && (
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-500" aria-live="polite">
                {this.state.error.message}
              </p>
            )}
            <button
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              type="button"
              onClick={this.handleRetry}
            >
              Refresh page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
