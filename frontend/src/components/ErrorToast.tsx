import { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export default function ErrorToast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      id="error-toast"
      role="alert"
      className="toast-enter fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-start gap-3 px-4 py-3.5 rounded-xl glass-card border-red-500/30 bg-red-500/10 max-w-sm w-full mx-4 shadow-2xl"
    >
      <div className="flex-shrink-0 mt-0.5">
        <AlertTriangle className="w-4 h-4 text-red-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-red-300">Request Failed</p>
        <p className="text-xs text-red-400/80 mt-0.5 break-words">{message}</p>
      </div>
      <button
        id="toast-close-btn"
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
        aria-label="Dismiss error"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
