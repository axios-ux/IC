import { HomeIcon, CalcIcon, FoodIcon, SettingsIcon } from "../icons";
import { cn } from "../utils/cn";

export type Tab = "home" | "calculator" | "foods" | "settings";

interface BottomNavProps {
  current: Tab;
  onChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: typeof HomeIcon }[] = [
  { id: "home", label: "الرئيسية", icon: HomeIcon },
  { id: "calculator", label: "الحاسبة", icon: CalcIcon },
  { id: "foods", label: "الأطعمة", icon: FoodIcon },
  { id: "settings", label: "الإعدادات", icon: SettingsIcon },
];

export function BottomNav({ current, onChange }: BottomNavProps) {
  return (
    <nav className="bg-white/95 backdrop-blur-md border-t border-cream-200 px-2 pt-1.5 pb-2 safe-bottom shadow-lg shadow-sage-900/5">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = current === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "flex-1 flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-xl transition-all active:scale-95",
                isActive ? "text-sage-700" : "text-sage-500 hover:text-sage-600"
              )}
            >
              <div
                className={cn(
                  "p-1.5 rounded-xl transition-all",
                  isActive ? "bg-sage-100" : "bg-transparent"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive && "stroke-[2.2]")} />
              </div>
              <span className={cn("text-[10px] font-medium", isActive && "font-bold")}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
