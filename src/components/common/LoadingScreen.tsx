interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Loading" }: LoadingScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 text-gray-700 dark:bg-gray-900 dark:text-gray-200">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-brand-500" aria-hidden />
        <p className="text-sm font-medium" role="status">
          {message}...
        </p>
      </div>
    </div>
  );
}
