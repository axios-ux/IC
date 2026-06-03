import { useEffect } from "react";
import { CheckIcon, WarningIcon, XIcon } from "../icons";
import { cn } from "../utils/cn";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = "success", onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  const styles = {
    success: "bg-sage-600 text-white",
    error: "bg-coral-600 text-white",
    warning: "bg-gold-500 text-white",
    info: "bg-sage-700 text-white",
  };

  const Icon = type === "success" ? CheckIcon : type === "error" || type === "warning" ? WarningIcon : CheckIcon;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-slide-up safe-top">
      <div
        className={cn(
          "flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl min-w-[280px] max-w-[90vw]",
          styles[type]
        )}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium flex-1 text-right">{message}</span>
        <button
          onClick={onClose}
          className="p-1 -m-1 rounded-full hover:bg-white/20 transition-colors flex-shrink-0"
        >
          <XIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
