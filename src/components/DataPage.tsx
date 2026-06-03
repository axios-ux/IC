import { useRef, useState } from "react";
import { AppData } from "../types";
import { ExportIcon, ImportIcon, WarningIcon, CheckIcon, ResetIcon, HistoryIcon } from "../icons";
import { exportData, importData } from "../storage";
import { formatDate } from "../calculator";

interface DataPageProps {
  data: AppData;
  onImport: (data: AppData) => void;
  onReset: () => void;
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export function DataPage({ data, onImport, onReset, onToast }: DataPageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);

  const handleExport = () => {
    try {
      exportData(data);
      onToast("تم تصدير النسخة الاحتياطية بنجاح");
    } catch (err) {
      console.error(err);
      onToast("فشل التصدير", "error");
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const imported = await importData(file);
      onImport(imported);
      onToast("تم استيراد البيانات بنجاح");
    } catch (err) {
      console.error(err);
      onToast("فشل الاستيراد. تأكد من صحة الملف", "error");
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleReset = () => {
    if (
      confirm(
        "هل أنت متأكد من رغبتك في مسح جميع البيانات؟\nهذا سيحذف كل الإعدادات والأطعمة والوحدات والسجل.\nلا يمكن التراجع عن هذا الإجراء!"
      )
    ) {
      if (confirm("تأكيد نهائي: سيتم حذف كل شيء والعودة للإعدادات الافتراضية. هل أنت متأكد؟")) {
        onReset();
        onToast("تم مسح جميع البيانات", "info");
      }
    }
  };

  const stats = [
    { label: "الأصناف", value: data.foods.length, icon: "🍎" },
    { label: "الوحدات", value: data.customUnits.length, icon: "📏" },
    { label: "عمليات الحساب", value: data.history.length, icon: "💉" },
  ];

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-sage-500 to-sage-600 rounded-3xl p-5 text-white shadow-lg shadow-sage-500/20">
        <h2 className="text-lg font-bold mb-1">إدارة البيانات</h2>
        <p className="text-sm text-sage-100/90">
          صدّر نسخة احتياطية من بياناتك أو استورد نسخة سابقة للحفاظ على معلوماتك آمنة
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl p-3 border border-cream-200 text-center"
          >
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-xl font-bold text-sage-800">{s.value}</p>
            <p className="text-[10px] text-sage-600">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Export */}
      <div className="bg-white rounded-2xl p-4 border border-cream-200">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 bg-sage-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <ExportIcon className="w-5 h-5 text-sage-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-sage-800 mb-1">تصدير البيانات</h3>
            <p className="text-xs text-sage-600 leading-relaxed">
              احفظ نسخة احتياطية من جميع بياناتك (الإعدادات، الأطعمة، الوحدات، السجل) في ملف JSON واحد يمكنك استعادته لاحقاً
            </p>
          </div>
        </div>
        <button
          onClick={handleExport}
          className="w-full bg-sage-600 hover:bg-sage-700 active:bg-sage-800 text-white font-semibold py-3 px-4 rounded-xl shadow-md shadow-sage-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
        >
          <ExportIcon className="w-4 h-4" />
          تصدير ملف JSON
        </button>
      </div>

      {/* Import */}
      <div className="bg-white rounded-2xl p-4 border border-cream-200">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 bg-sage-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <ImportIcon className="w-5 h-5 text-sage-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-sage-800 mb-1">استيراد البيانات</h3>
            <p className="text-xs text-sage-600 leading-relaxed">
              استعد بياناتك من ملف JSON محفوظ سابقاً. <strong className="text-coral-500">سيتم استبدال البيانات الحالية</strong>
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFile}
          className="hidden"
        />
        <button
          onClick={handleImportClick}
          disabled={importing}
          className="w-full bg-cream-200 hover:bg-cream-300 text-sage-700 font-semibold py-3 px-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          <ImportIcon className="w-4 h-4" />
          {importing ? "جاري الاستيراد..." : "اختر ملف JSON للاستيراد"}
        </button>
      </div>

      {/* History */}
      {data.history.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-cream-200">
          <div className="flex items-center gap-2 mb-3">
            <HistoryIcon className="w-5 h-5 text-sage-600" />
            <h3 className="text-sm font-bold text-sage-800">آخر الجرعات المحفوظة</h3>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto scroll-hide">
            {data.history.slice(0, 10).map((dose, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 bg-cream-100 rounded-xl text-sm"
              >
                <div>
                  <p className="font-bold text-sage-800">{dose.total} وحدة</p>
                  <p className="text-xs text-sage-600">
                    {dose.totalCarbs}غ كارب · سكر {dose.currentBG}
                  </p>
                </div>
                <p className="text-xs text-sage-500">{formatDate(dose.timestamp)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-sage-50 border border-sage-200 rounded-2xl p-4 text-xs text-sage-700 leading-relaxed">
        <h4 className="font-bold text-sage-800 mb-1.5 flex items-center gap-1.5">
          <CheckIcon className="w-4 h-4" />
          نصائح للحفاظ على بياناتك
        </h4>
        <ul className="space-y-1 pr-1">
          <li>• صدّر نسخة احتياطية بشكل دوري (أسبوعياً مثلاً)</li>
          <li>• احفظ ملف JSON في مكان آمن (السحابة، الكمبيوتر، الإيميل)</li>
          <li>• استورد النسخة عند الانتقال لجهاز جديد</li>
          <li>• التطبيق يعمل بالكامل دون اتصال بالإنترنت</li>
        </ul>
      </div>

      {/* Danger zone */}
      <div className="bg-coral-500/5 border border-coral-500/30 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <WarningIcon className="w-5 h-5 text-coral-500" />
          <h3 className="text-sm font-bold text-coral-600">منطقة الخطر</h3>
        </div>
        <p className="text-xs text-coral-600/80 mb-3 leading-relaxed">
          مسح جميع البيانات سيعيد التطبيق إلى إعداداته الافتراضية ويمحو كل ما أضفته. لا يمكن التراجع!
        </p>
        <button
          onClick={handleReset}
          className="w-full bg-coral-500 hover:bg-coral-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
        >
          <ResetIcon className="w-4 h-4" />
          مسح جميع البيانات
        </button>
      </div>
    </div>
  );
}
