import { HeartIcon } from "../icons";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-cream-200 safe-top">
      <div className="px-5 py-3 flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-sage-500 to-sage-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-sage-500/30 flex-shrink-0">
          <HeartIcon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-sage-900 truncate">{title}</h1>
          {subtitle && <p className="text-xs text-sage-600 truncate">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
}
