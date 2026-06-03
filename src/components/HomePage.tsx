import { AppData, MedicalSettings } from "../types";
import { CalcIcon, FoodIcon, SettingsIcon, HeartIcon, SyringeIcon, DropIcon, ChevronLeftIcon } from "../icons";
import { formatDate } from "../calculator";

interface HomePageProps {
  data: AppData;
  settings: MedicalSettings;
  onNavigate: (tab: "calculator" | "foods" | "settings" | "data") => void;
}

export function HomePage({ data, settings, onNavigate }: HomePageProps) {
  const lastDose = data.history[0];
  const todayDoses = data.history.filter(
    (d) => new Date(d.timestamp).toDateString() === new Date().toDateString()
  );

  const stats = [
    { label: "الأصناف", value: data.foods.length, color: "from-sage-400 to-sage-500" },
    { label: "الوحدات", value: data.customUnits.length, color: "from-gold-400 to-gold-500" },
    { label: "اليوم", value: todayDoses.length, color: "from-sage-500 to-sage-600" },
  ];

  return (
    <div className="space-y-4 pb-4">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sage-500 via-sage-600 to-sage-700 rounded-3xl p-6 text-white shadow-2xl shadow-sage-500/30">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <HeartIcon className="w-5 h-5 text-sage-200" />
            <p className="text-sm text-sage-100">مرحباً {settings.userName || "بك"}</p>
          </div>
          <h1 className="text-2xl font-bold mb-2 leading-tight">حاسبة الإنسولين الذكية</h1>
          <p className="text-sm text-sage-100/90 leading-relaxed mb-4">
            أداة دقيقة وموثوقة لحساب جرعات الإنسولين بناءً على وجباتك ومستوى السكر
          </p>
          <div className="flex items-center gap-2 text-xs bg-white/10 rounded-xl px-3 py-2 inline-block">
            <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse-soft" />
            <span>يعمل دون اتصال بالإنترنت</span>
          </div>
        </div>
      </div>

      {/* Quick action */}
      <button
        onClick={() => onNavigate("calculator")}
        className="w-full bg-white rounded-2xl p-5 border border-cream-200 hover:border-sage-300 active:scale-[0.99] transition-all shadow-sm hover:shadow-md group"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-sage-500 to-sage-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-sage-500/30 flex-shrink-0">
            <CalcIcon className="w-6 h-6" />
          </div>
          <div className="flex-1 text-right">
            <p className="font-bold text-sage-900 mb-0.5">ابدأ حساب جرعة جديدة</p>
            <p className="text-xs text-sage-600">أضف وجبتك وأدخل مستوى السكر</p>
          </div>
          <ChevronLeftIcon className="w-5 h-5 text-sage-400 group-hover:text-sage-600 transition-colors" />
        </div>
      </button>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2.5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl p-3 border border-cream-200 text-center"
          >
            <p className={`text-2xl font-bold bg-gradient-to-br ${s.color} bg-clip-text text-transparent`}>
              {s.value}
            </p>
            <p className="text-[10px] text-sage-600 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Medical settings summary */}
      <div className="bg-white rounded-2xl p-4 border border-cream-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-sage-800 flex items-center gap-1.5">
            <DropIcon className="w-4 h-4 text-sage-600" />
            المعايير الطبية
          </h3>
          <button
            onClick={() => onNavigate("settings")}
            className="text-xs text-sage-600 hover:text-sage-700 font-medium"
          >
            تعديل ←
          </button>
        </div>
        {settings.isConfigured ? (
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-sage-50 rounded-xl p-2.5">
              <p className="text-[10px] text-sage-600 mb-0.5">معامل الحساسية</p>
              <p className="text-base font-bold text-sage-800">{settings.isf}</p>
            </div>
            <div className="bg-sage-50 rounded-xl p-2.5">
              <p className="text-[10px] text-sage-600 mb-0.5">معامل الكارب</p>
              <p className="text-base font-bold text-sage-800">1:{settings.carbRatio}</p>
            </div>
            <div className="bg-sage-50 rounded-xl p-2.5">
              <p className="text-[10px] text-sage-600 mb-0.5">السكر المستهدف</p>
              <p className="text-base font-bold text-sage-800">{settings.targetBG}</p>
            </div>
          </div>
        ) : (
          <div className="bg-gold-500/10 border border-gold-500/30 rounded-xl p-3 text-center">
            <p className="text-sm text-gold-600 font-medium mb-2">لم يتم إعداد المعايير بعد</p>
            <button
              onClick={() => onNavigate("settings")}
              className="text-xs bg-sage-600 hover:bg-sage-700 text-white px-4 py-1.5 rounded-lg font-medium"
            >
              إعداد المعايير الآن
            </button>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-2.5">
        <QuickLinkCard
          icon={<FoodIcon className="w-5 h-5" />}
          label="الأطعمة"
          sublabel={`${data.foods.length} صنف`}
          onClick={() => onNavigate("foods")}
        />
        <QuickLinkCard
          icon={<SettingsIcon className="w-5 h-5" />}
          label="الوحدات"
          sublabel={`${data.customUnits.length} وحدة`}
          onClick={() => onNavigate("data")}
        />
      </div>

      {/* Last dose */}
      {lastDose && (
        <div className="bg-white rounded-2xl p-4 border border-cream-200">
          <h3 className="text-sm font-bold text-sage-800 mb-3 flex items-center gap-1.5">
            <SyringeIcon className="w-4 h-4 text-sage-600" />
            آخر جرعة محفوظة
          </h3>
          <div className="bg-sage-50 rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-sage-800">
                {lastDose.total} <span className="text-sm font-medium text-sage-600">وحدة</span>
              </p>
              <p className="text-xs text-sage-600 mt-0.5">
                {lastDose.totalCarbs}غ كارب · سكر {lastDose.currentBG}
              </p>
            </div>
            <p className="text-xs text-sage-500">{formatDate(lastDose.timestamp)}</p>
          </div>
        </div>
      )}

      {/* Footer note */}
      <p className="text-center text-[10px] text-sage-500 pt-2 leading-relaxed">
        ⚕️ هذا التطبيق أداة مساعدة ولا يغني عن استشارة الطبيب المعالج
      </p>
    </div>
  );
}

function QuickLinkCard({
  icon,
  label,
  sublabel,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl p-4 border border-cream-200 hover:border-sage-300 active:scale-[0.98] transition-all text-right"
    >
      <div className="w-9 h-9 bg-sage-100 rounded-xl flex items-center justify-center text-sage-600 mb-2">
        {icon}
      </div>
      <p className="font-semibold text-sage-900 text-sm">{label}</p>
      <p className="text-xs text-sage-600">{sublabel}</p>
    </button>
  );
}
