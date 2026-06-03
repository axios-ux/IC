import { useState, useEffect } from "react";
import { CheckIcon, InfoIcon, WarningIcon } from "../icons";
import { MedicalSettings } from "../types";
import { cn } from "../utils/cn";

interface SettingsPageProps {
  settings: MedicalSettings;
  onSave: (s: MedicalSettings) => void;
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export function SettingsPage({ settings, onSave, onToast }: SettingsPageProps) {
  const [name, setName] = useState(settings.userName);
  const [isf, setIsf] = useState(settings.isf.toString());
  const [carbRatio, setCarbRatio] = useState(settings.carbRatio.toString());
  const [targetBG, setTargetBG] = useState(settings.targetBG.toString());
  const [showInfo, setShowInfo] = useState<string | null>(null);

  useEffect(() => {
    setName(settings.userName);
    setIsf(settings.isf.toString());
    setCarbRatio(settings.carbRatio.toString());
    setTargetBG(settings.targetBG.toString());
  }, [settings]);

  const handleSave = () => {
    const isfNum = parseFloat(isf);
    const ratioNum = parseFloat(carbRatio);
    const targetNum = parseFloat(targetBG);

    if (!isfNum || isfNum <= 0) {
      onToast("يرجى إدخال معامل حساسية صحيح", "error");
      return;
    }
    if (!ratioNum || ratioNum <= 0) {
      onToast("يرجى إدخال معامل كربوهيدرات صحيح", "error");
      return;
    }
    if (!targetNum || targetNum < 50 || targetNum > 200) {
      onToast("يرجى إدخال هدف سكر معقول (50-200)", "error");
      return;
    }

    onSave({
      userName: name.trim(),
      isf: isfNum,
      carbRatio: ratioNum,
      targetBG: targetNum,
      isConfigured: true,
    });
    onToast("تم حفظ الإعدادات بنجاح");
  };

  const InfoCard = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <div className="mt-2">
      <button
        onClick={() => setShowInfo(showInfo === id ? null : id)}
        className="flex items-center gap-1.5 text-xs text-sage-600 hover:text-sage-700"
      >
        <InfoIcon className="w-3.5 h-3.5" />
        {showInfo === id ? "إخفاء الشرح" : title}
      </button>
      {showInfo === id && (
        <div className="mt-2 p-3 bg-sage-50 border border-sage-200 rounded-xl text-xs text-sage-800 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-5 pb-4">
      {/* Welcome banner */}
      <div className="bg-gradient-to-br from-sage-500 to-sage-600 rounded-3xl p-5 text-white shadow-lg shadow-sage-500/20">
        <h2 className="text-lg font-bold mb-1">
          {settings.userName ? `أهلاً ${settings.userName}` : "أهلاً بك"}
        </h2>
        <p className="text-sm text-sage-100/90 leading-relaxed">
          قم بتعبئة المعايير الطبية بدقة بعد استشارة طبيبك المعالج. هذه القيم أساسية لدقة الحسابات.
        </p>
      </div>

      {/* Name */}
      <div className="bg-white rounded-2xl p-4 border border-cream-200">
        <label className="block text-sm font-semibold text-sage-800 mb-2">الاسم (اختياري)</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسمك"
          className="w-full px-4 py-3 bg-cream-100 border border-cream-300 rounded-xl text-sage-900 placeholder-sage-400 focus:outline-none focus:border-sage-500 focus:bg-white transition-colors"
        />
      </div>

      {/* ISF */}
      <div className="bg-white rounded-2xl p-4 border border-cream-200">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-sage-800 mb-1">
              معامل حساسية الإنسولين (ISF)
            </label>
            <p className="text-xs text-sage-600">كم ينخفض السكر (ملغ/دل) لكل وحدة إنسولين</p>
          </div>
          <div className="w-24 flex-shrink-0">
            <input
              type="number"
              inputMode="decimal"
              value={isf}
              onChange={(e) => setIsf(e.target.value)}
              className="w-full px-3 py-2.5 bg-cream-100 border-2 border-cream-300 rounded-xl text-sage-900 text-center font-bold text-lg focus:outline-none focus:border-sage-500 focus:bg-white transition-colors"
            />
            <p className="text-[10px] text-sage-500 text-center mt-1">ملغ/دل</p>
          </div>
        </div>
        <InfoCard id="isf" title="ما هو معامل الحساسية؟">
          هو مقدار انخفاض السكر في الدم (بـ ملغ/دل) عند إعطاء وحدة واحدة من الإنسولين.
          <br />
          <strong className="text-sage-900">مثال:</strong> إذا كان معامل الحساسية 50، فإن كل وحدة إنسولين تخفض السكر بمقدار 50 ملغ/دل.
          <br />
          يحدده الطبيب المعالج بناءً على احتياجاتك الفردية.
        </InfoCard>
      </div>

      {/* Carb Ratio */}
      <div className="bg-white rounded-2xl p-4 border border-cream-200">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-sage-800 mb-1">
              معامل الكربوهيدرات (Carb Ratio)
            </label>
            <p className="text-xs text-sage-600">كم غرام كربوهيدرات تغطيها وحدة إنسولين واحدة</p>
          </div>
          <div className="w-24 flex-shrink-0">
            <input
              type="number"
              inputMode="decimal"
              value={carbRatio}
              onChange={(e) => setCarbRatio(e.target.value)}
              className="w-full px-3 py-2.5 bg-cream-100 border-2 border-cream-300 rounded-xl text-sage-900 text-center font-bold text-lg focus:outline-none focus:border-sage-500 focus:bg-white transition-colors"
            />
            <p className="text-[10px] text-sage-500 text-center mt-1">غرام</p>
          </div>
        </div>
        <InfoCard id="ratio" title="ما هو معامل الكربوهيدرات؟">
          هو عدد غرامات الكربوهيدرات التي يمكن لوحدة واحدة من الإنسولين تغطيتها.
          <br />
          <strong className="text-sage-900">مثال:</strong> إذا كان معامل الكربوهيدرات 10، فإن وحدة واحدة من الإنسولين تغطي 10 غرامات من الكربوهيدرات.
          <br />
          قد يختلف من وجبة لأخرى (إفطار، غداء، عشاء) حسب توصية الطبيب.
        </InfoCard>
      </div>

      {/* Target BG */}
      <div className="bg-white rounded-2xl p-4 border border-cream-200">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-sage-800 mb-1">
              مستوى السكر المستهدف
            </label>
            <p className="text-xs text-sage-600">المستوى الذي تريد أن يكون عليه سكر الدم</p>
          </div>
          <div className="w-24 flex-shrink-0">
            <input
              type="number"
              inputMode="decimal"
              value={targetBG}
              onChange={(e) => setTargetBG(e.target.value)}
              className="w-full px-3 py-2.5 bg-cream-100 border-2 border-cream-300 rounded-xl text-sage-900 text-center font-bold text-lg focus:outline-none focus:border-sage-500 focus:bg-white transition-colors"
            />
            <p className="text-[10px] text-sage-500 text-center mt-1">ملغ/دل</p>
          </div>
        </div>
        <InfoCard id="target" title="ما هو مستوى السكر المستهدف؟">
          هو مستوى السكر في الدم الذي تهدف للوصول إليه. القيمة الافتراضية 100 ملغ/دل.
          <br />
          عادةً ما يتراوح بين 80-130 ملغ/دل قبل الوجبات، وأقل من 180 ملغ/دل بعد الوجبات بساعتين.
          <br />
          استشر طبيبك لتحديد القيمة المناسبة لك.
        </InfoCard>
      </div>

      {/* Warning */}
      <div className="bg-gold-500/10 border border-gold-500/30 rounded-2xl p-4 flex gap-3">
        <WarningIcon className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-gold-600 leading-relaxed">
          <strong className="block mb-1">تنبيه طبي مهم</strong>
          هذه المعايير يجب تحديدها بالتعاون مع طبيبك المعالج أو أخصائي الغدد الصماء. التطبيق أداة مساعدة ولا يغني عن المتابعة الطبية المنتظمة.
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        className={cn(
          "w-full bg-sage-600 hover:bg-sage-700 active:bg-sage-800 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg shadow-sage-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        )}
      >
        <CheckIcon className="w-5 h-5" />
        حفظ الإعدادات
      </button>
    </div>
  );
}
