import { useEffect } from "react";
import { XIcon } from "../icons";
import { cn } from "../utils/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ open, onClose, title, children, maxWidth = "max-w-md" }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in">
      <div
        className="absolute inset-0 bg-sage-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full bg-cream-50 rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up max-h-[90vh] overflow-hidden flex flex-col",
          maxWidth
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-cream-200 bg-white/50">
          <h2 className="text-lg font-bold text-sage-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 -m-2 rounded-full hover:bg-cream-200 active:bg-cream-300 transition-colors"
            aria-label="إغلاق"
          >
            <XIcon className="w-5 h-5 text-sage-700" />
          </button>
        </div>
        <div className="overflow-y-auto scroll-hide p-5 flex-1">{children}</div>
      </div>
    </div>
  );
}
