import { useState, useMemo } from "react";
import { Food, MealItem, InsulinDose, MedicalSettings } from "../types";
import { PlusIcon, TrashIcon, SyringeIcon, DropIcon, WarningIcon, CheckIcon, XIcon, SearchIcon } from "../icons";
import { calculateDose, calculateFoodCarbs, getBGStatus } from "../calculator";
import { cn } from "../utils/cn";

interface CalculatorPageProps {
  foods: Food[];
  settings: MedicalSettings;
  onSaveDose: (dose: InsulinDose) => void;
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export function CalculatorPage({ foods, settings, onSaveDose, onToast }: CalculatorPageProps) {
  const [items, setItems] = useState<MealItem[]>([]);
  const [currentBG, setCurrentBG] = useState<string>("");
  const [showFoodPicker, setShowFoodPicker] = useState(false);
  const [showCustomAdd, setShowCustomAdd] = useState(false);
  const [search, setSearch] = useState("");

  const totalCarbs = useMemo(
    () => items.reduce((sum, item) => sum + item.carbs, 0),
    [items]
  );

  const dose = useMemo<InsulinDose | null>(() => {
    const bg = parseFloat(currentBG);
    if (!items.length || isNaN(bg) || bg <= 0 || !settings.isConfigured) return null;
    return calculateDose(items, bg, settings);
  }, [items, currentBG, settings]);

  const bgStatus = useMemo(() => {
    const bg = parseFloat(currentBG);
    if (isNaN(bg) || bg <= 0) return null;
    return getBGStatus(bg);
  }, [currentBG]);

  const addItem = (item: MealItem) => {
    setItems([...items, item]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const clearMeal = () => {
    setItems([]);
    setCurrentBG("");
    onToast("تم مسح الوجبة");
  };

  const saveDose = () => {
    if (dose) {
      onSaveDose(dose);
      onToast("تم حفظ الجرعة في السجل");
    }
  };

  const canCalculate = items.length > 0 && currentBG && parseFloat(currentBG) > 0;
  const isReady = canCalculate && settings.isConfigured;

  return (
    <div className="space-y-4 pb-4">
      {/* Header / status */}
      <div className="bg-gradient-to-br from-sage-500 to-sage-600 rounded-3xl p-5 text-white shadow-lg shadow-sage-500/20">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold">حاسبة الجرعة</h2>
          <SyringeIcon className="w-6 h-6 text-sage-200" />
        </div>
        <p className="text-sm text-sage-100/90">
          أضف أصناف وجبتك وأدخل مستوى السكر الحالي للحصول على الجرعة بدقة
        </p>
        {!settings.isConfigured && (
          <div className="mt-3 bg-gold-500/20 border border-gold-500/40 rounded-xl p-3 text-xs text-white flex items-start gap-2">
            <WarningIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>يجب إعداد المعايير الطبية في الإعدادات أولاً للحصول على نتائج دقيقة</span>
          </div>
        )}
      </div>

      {/* Meal items */}
      <div className="bg-white rounded-2xl p-4 border border-cream-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-sage-800">🍽️ أصناف الوجبة</h3>
          {items.length > 0 && (
            <button
              onClick={clearMeal}
              className="text-xs text-coral-500 hover:text-coral-600 font-medium"
            >
              مسح الكل
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="py-6 text-center text-sage-500">
            <p className="text-sm">لم تتم إضافة أي صنف بعد</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 bg-cream-100 px-3 py-2.5 rounded-xl"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-sage-900 truncate">
                    {item.foodName}
                  </p>
                  <p className="text-xs text-sage-600">
                    {item.portionName} · {item.grams}غ · <strong className="text-sage-800">{item.carbs.toFixed(1)}</strong> غم كارب
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 rounded-lg hover:bg-coral-500/10 text-coral-500 flex-shrink-0"
                  aria-label="حذف"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="pt-2 border-t border-cream-200 flex justify-between items-center">
              <span className="text-sm font-semibold text-sage-800">إجمالي الكربوهيدرات</span>
              <span className="text-lg font-bold text-sage-700">{totalCarbs.toFixed(1)} غم</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            onClick={() => setShowFoodPicker(true)}
            className="bg-sage-500 hover:bg-sage-600 active:bg-sage-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-1.5 text-sm active:scale-95 transition-all"
          >
            <PlusIcon className="w-4 h-4" />
            من المكتبة
          </button>
          <button
            onClick={() => setShowCustomAdd(true)}
            className="bg-cream-200 hover:bg-cream-300 text-sage-700 py-3 rounded-xl font-medium flex items-center justify-center gap-1.5 text-sm active:scale-95 transition-all"
          >
            <PlusIcon className="w-4 h-4" />
            كارب سريع
          </button>
        </div>
      </div>

      {/* BG Input - MANDATORY */}
      <div className="bg-white rounded-2xl p-4 border-2 border-coral-500/30">
        <div className="flex items-center gap-2 mb-2">
          <DropIcon className="w-5 h-5 text-coral-500" />
          <h3 className="text-sm font-bold text-sage-800">مستوى السكر الحالي (إجباري)</h3>
        </div>
        <p className="text-xs text-sage-600 mb-3">
          أدخل قراءة سكر الدم الحالية بـ ملغ/دل (mg/dL)
        </p>
        <div className="relative">
          <input
            type="number"
            inputMode="decimal"
            value={currentBG}
            onChange={(e) => setCurrentBG(e.target.value)}
            placeholder="120"
            className="w-full px-4 py-4 bg-cream-100 border-2 border-cream-300 rounded-xl text-sage-900 placeholder-sage-400 text-2xl font-bold text-center focus:outline-none focus:border-coral-500 focus:bg-white transition-colors"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-sage-600 font-medium">
            ملغ/دل
          </span>
        </div>
        {bgStatus && (
          <div
            className={cn(
              "mt-3 px-3 py-2 rounded-xl text-sm font-medium text-center",
              bgStatus.bgClass,
              bgStatus.textClass
            )}
          >
            {bgStatus.label}
          </div>
        )}
      </div>

      {/* Result */}
      {isReady && dose && (
        <div className="animate-slide-up">
          {/* Warning */}
          {dose.warning && (
            <div className="bg-coral-500/10 border-2 border-coral-500/40 rounded-2xl p-4 mb-3 flex gap-3">
              <WarningIcon className="w-5 h-5 text-coral-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-coral-600 leading-relaxed">{dose.warning}</div>
            </div>
          )}

          {/* Main dose */}
          <div
            className={cn(
              "rounded-3xl p-6 text-center shadow-2xl",
              dose.total > 0
                ? "bg-gradient-to-br from-sage-500 to-sage-700 text-white shadow-sage-500/30"
                : "bg-gradient-to-br from-sage-300 to-sage-400 text-white"
            )}
          >
            <p className="text-sm text-white/80 mb-1">الجرعة المقترحة</p>
            <div className="text-6xl font-bold my-2">
              {dose.total}
              <span className="text-2xl font-medium text-white/80 mr-1">وحدة</span>
            </div>
            <SyringeIcon className="w-8 h-8 mx-auto my-2 text-white/80" />
            <div className="grid grid-cols-2 gap-3 mt-4 text-right">
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-xs text-white/70">جرعة الكارب</p>
                <p className="text-lg font-bold">{dose.carbsDose} وحدة</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-xs text-white/70">جرعة التصحيح</p>
                <p className="text-lg font-bold">{dose.correctionDose} وحدة</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl p-4 border border-cream-200 mt-3 space-y-2">
            <DetailRow label="إجمالي الكربوهيدرات" value={`${dose.totalCarbs} غم`} />
            <DetailRow label="مستوى السكر الحالي" value={`${dose.currentBG} ملغ/دل`} />
            <DetailRow label="السكر المستهدف" value={`${settings.targetBG} ملغ/دل`} />
            <DetailRow label="معامل الحساسية (ISF)" value={`${settings.isf} ملغ/دل`} />
            <DetailRow label="معامل الكارب" value={`1:${settings.carbRatio}`} />
          </div>

          {/* Save button */}
          <button
            onClick={saveDose}
            className="w-full mt-3 bg-sage-600 hover:bg-sage-700 active:bg-sage-800 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-lg shadow-sage-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <CheckIcon className="w-5 h-5" />
            حفظ الجرعة في السجل
          </button>
        </div>
      )}

      {/* Helper text when not ready */}
      {!isReady && (
        <div className="bg-cream-200/50 border border-cream-300 rounded-2xl p-4 text-center text-sm text-sage-700">
          {!settings.isConfigured
            ? "⚙️ أكمل المعايير الطبية في الإعدادات أولاً"
            : items.length === 0
            ? "🍽️ أضف صنفاً واحداً على الأقل للوجبة"
            : "💉 أدخل مستوى السكر الحالي لحساب الجرعة"}
        </div>
      )}

      {/* Food picker modal */}
      {showFoodPicker && (
        <FoodPickerModal
          foods={foods}
          search={search}
          setSearch={setSearch}
          onClose={() => {
            setShowFoodPicker(false);
            setSearch("");
          }}
          onSelect={(item) => {
            addItem(item);
            setShowFoodPicker(false);
            setSearch("");
          }}
        />
      )}

      {/* Custom add modal */}
      {showCustomAdd && (
        <CustomAddModal
          onClose={() => setShowCustomAdd(false)}
          onAdd={(item) => {
            addItem(item);
            setShowCustomAdd(false);
          }}
        />
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-sm text-sage-600">{label}</span>
      <span className="text-sm font-bold text-sage-900">{value}</span>
    </div>
  );
}

interface FoodPickerModalProps {
  foods: Food[];
  search: string;
  setSearch: (s: string) => void;
  onClose: () => void;
  onSelect: (item: MealItem) => void;
}

function FoodPickerModal({ foods, search, setSearch, onClose, onSelect }: FoodPickerModalProps) {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return foods.sort((a, b) => a.name.localeCompare(b.name, "ar"));
    const s = search.toLowerCase();
    return foods
      .filter((f) => f.name.toLowerCase().includes(s) || f.category.toLowerCase().includes(s))
      .sort((a, b) => a.name.localeCompare(b.name, "ar"));
  }, [foods, search]);

  if (selectedFood) {
    return (
      <PortionPickerModal
        food={selectedFood}
        onClose={() => setSelectedFood(null)}
        onSelect={(portion, quantity) => {
          const carbs = calculateFoodCarbs(selectedFood.carbsPer100g, portion.grams * quantity);
          const item: MealItem = {
            id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            foodId: selectedFood.id,
            foodName: selectedFood.name,
            portionId: portion.id,
            portionName: quantity === 1 ? portion.name : `${quantity}× ${portion.name}`,
            grams: portion.grams * quantity,
            carbs,
          };
          onSelect(item);
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-sage-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-cream-50 rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-cream-200 bg-white/50">
          <h2 className="text-lg font-bold text-sage-800">اختر صنفاً</h2>
          <button onClick={onClose} className="p-2 -m-2 rounded-full hover:bg-cream-200">
            <XIcon className="w-5 h-5 text-sage-700" />
          </button>
        </div>
        <div className="p-4 border-b border-cream-200 bg-white/30">
          <div className="relative">
            <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن صنف..."
              autoFocus
              className="w-full pr-10 pl-4 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-sage-900 placeholder-sage-400 text-sm focus:outline-none focus:border-sage-500"
            />
          </div>
        </div>
        <div className="overflow-y-auto scroll-hide p-3 flex-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sage-500 text-sm">
              لا توجد نتائج. أضف الصنف من صفحة الأطعمة أولاً.
            </div>
          ) : (
            <div className="space-y-1.5">
              {filtered.map((food) => (
                <button
                  key={food.id}
                  onClick={() => setSelectedFood(food)}
                  className="w-full text-right p-3 bg-white hover:bg-sage-50 active:bg-sage-100 rounded-xl border border-cream-200 hover:border-sage-300 transition-all"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sage-900 truncate">{food.name}</p>
                      <p className="text-xs text-sage-600">
                        {food.carbsPer100g} غم / 100غ · {food.portions.length} وحدة
                      </p>
                    </div>
                    <span className="text-[10px] bg-sage-100 text-sage-700 px-2 py-0.5 rounded-full flex-shrink-0">
                      {food.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface PortionPickerModalProps {
  food: Food;
  onClose: () => void;
  onSelect: (portion: Food["portions"][0], quantity: number) => void;
}

function PortionPickerModal({ food, onClose, onSelect }: PortionPickerModalProps) {
  const [selectedPortion, setSelectedPortion] = useState<Food["portions"][0] | null>(
    food.portions[0] || null
  );
  const [quantity, setQuantity] = useState("1");
  const [customGrams, setCustomGrams] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const carbs = useMemo(() => {
    if (useCustom && customGrams) {
      return calculateFoodCarbs(food.carbsPer100g, parseFloat(customGrams));
    }
    if (selectedPortion) {
      const q = parseFloat(quantity) || 1;
      return calculateFoodCarbs(food.carbsPer100g, selectedPortion.grams * q);
    }
    return 0;
  }, [useCustom, customGrams, selectedPortion, quantity, food.carbsPer100g]);

  const handleConfirm = () => {
    if (useCustom && customGrams) {
      const grams = parseFloat(customGrams);
      const customPortion = { id: "custom", name: `${grams} غم`, grams };
      onSelect(customPortion, 1);
    } else if (selectedPortion) {
      const q = parseFloat(quantity) || 1;
      onSelect(selectedPortion, q);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-sage-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-cream-50 rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-cream-200 bg-white/50">
          <div>
            <h2 className="text-lg font-bold text-sage-800">{food.name}</h2>
            <p className="text-xs text-sage-600">{food.carbsPer100g} غم كارب / 100 غم</p>
          </div>
          <button onClick={onClose} className="p-2 -m-2 rounded-full hover:bg-cream-200">
            <XIcon className="w-5 h-5 text-sage-700" />
          </button>
        </div>
        <div className="overflow-y-auto scroll-hide p-4 flex-1 space-y-3">
          {food.portions.length > 0 && (
            <>
              <div>
                <label className="block text-sm font-semibold text-sage-800 mb-2">اختر وحدة</label>
                <div className="grid grid-cols-2 gap-2">
                  {food.portions.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPortion(p);
                        setUseCustom(false);
                      }}
                      className={cn(
                        "p-2.5 rounded-xl text-right text-sm transition-all border-2",
                        selectedPortion?.id === p.id && !useCustom
                          ? "bg-sage-500 text-white border-sage-500"
                          : "bg-white text-sage-700 border-cream-200 hover:border-sage-300"
                      )}
                    >
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-xs opacity-80">{p.grams} غم</p>
                    </button>
                  ))}
                </div>
              </div>

              {selectedPortion && (
                <div>
                  <label className="block text-sm font-semibold text-sage-800 mb-1.5">الكمية</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="0.25"
                    step="0.25"
                    className="w-full px-4 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-sage-900 text-center text-lg font-bold focus:outline-none focus:border-sage-500"
                  />
                </div>
              )}
            </>
          )}

          <div className="border-t border-cream-200 pt-3">
            <button
              onClick={() => setUseCustom(!useCustom)}
              className="text-sm text-sage-600 hover:text-sage-700 font-medium"
            >
              {useCustom ? "← العودة للوحدات" : "+ إدخال وزن مخصص (غرام)"}
            </button>
            {useCustom && (
              <input
                type="number"
                inputMode="decimal"
                value={customGrams}
                onChange={(e) => setCustomGrams(e.target.value)}
                placeholder="100"
                className="w-full mt-2 px-4 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-sage-900 text-center text-lg font-bold focus:outline-none focus:border-sage-500"
              />
            )}
          </div>

          <div className="bg-sage-50 border border-sage-200 rounded-xl p-3 text-center">
            <p className="text-xs text-sage-600 mb-1">إجمالي الكربوهيدرات</p>
            <p className="text-2xl font-bold text-sage-800">{carbs.toFixed(1)} غم</p>
          </div>
        </div>
        <div className="p-4 border-t border-cream-200 bg-white/50">
          <button
            onClick={handleConfirm}
            disabled={carbs <= 0}
            className="w-full bg-sage-600 hover:bg-sage-700 active:bg-sage-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-2xl shadow-lg shadow-sage-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <CheckIcon className="w-5 h-5" />
            إضافة للوجبة
          </button>
        </div>
      </div>
    </div>
  );
}

interface CustomAddModalProps {
  onClose: () => void;
  onAdd: (item: MealItem) => void;
}

function CustomAddModal({ onClose, onAdd }: CustomAddModalProps) {
  const [name, setName] = useState("");
  const [carbs, setCarbs] = useState("");

  const handleAdd = () => {
    if (!name.trim()) {
      alert("يرجى إدخال اسم الصنف");
      return;
    }
    const c = parseFloat(carbs);
    if (!c || c <= 0) {
      alert("يرجى إدخال كمية كربوهيدرات صحيحة");
      return;
    }
    const item: MealItem = {
      id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      foodId: "custom",
      foodName: name.trim(),
      portionId: "custom",
      portionName: "كارب سريع",
      grams: 0,
      carbs: c,
    };
    onAdd(item);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-sage-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-cream-50 rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-cream-200 bg-white/50">
          <h2 className="text-lg font-bold text-sage-800">إدخال كارب سريع</h2>
          <button onClick={onClose} className="p-2 -m-2 rounded-full hover:bg-cream-200">
            <XIcon className="w-5 h-5 text-sage-700" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-xs text-sage-600 bg-sage-50 border border-sage-200 rounded-xl p-3">
            استخدم هذا الخيار عند عدم توفر الصنف في المكتبة. أدخل الاسم وكمية الكربوهيدرات مباشرة.
          </p>
          <div>
            <label className="block text-sm font-semibold text-sage-800 mb-1.5">اسم الصنف</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: عصير، حلوى..."
              className="w-full px-4 py-3 bg-cream-100 border border-cream-300 rounded-xl text-sage-900 placeholder-sage-400 focus:outline-none focus:border-sage-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-sage-800 mb-1.5">الكربوهيدرات (غرام)</label>
            <input
              type="number"
              inputMode="decimal"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              placeholder="30"
              autoFocus
              className="w-full px-4 py-3 bg-cream-100 border-2 border-cream-300 rounded-xl text-sage-900 placeholder-sage-400 text-2xl font-bold text-center focus:outline-none focus:border-sage-500 focus:bg-white"
            />
          </div>
          <button
            onClick={handleAdd}
            className="w-full bg-sage-600 hover:bg-sage-700 active:bg-sage-800 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-lg shadow-sage-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <CheckIcon className="w-5 h-5" />
            إضافة للوجبة
          </button>
        </div>
      </div>
    </div>
  );
}
