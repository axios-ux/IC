import { useState, useMemo } from "react";
import { Food, FoodPortion } from "../types";
import { PlusIcon, EditIcon, TrashIcon, SearchIcon, XIcon, CheckIcon } from "../icons";
import { Modal } from "./Modal";
import { cn } from "../utils/cn";

interface FoodsPageProps {
  foods: Food[];
  onAdd: (food: Food) => void;
  onUpdate: (food: Food) => void;
  onDelete: (id: string) => void;
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

const CATEGORIES = [
  "نشويات",
  "فواكه",
  "خضار",
  "ألبان",
  "بروتينات",
  "حلويات",
  "مشروبات",
  "أخرى",
];

export function FoodsPage({ foods, onAdd, onUpdate, onDelete, onToast }: FoodsPageProps) {
  const [search, setSearch] = useState("");
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const filteredFoods = useMemo(() => {
    let list = foods;
    if (filterCategory !== "all") {
      list = list.filter((f) => f.category === filterCategory);
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(s) ||
          f.category.toLowerCase().includes(s)
      );
    }
    return list.sort((a, b) => a.name.localeCompare(b.name, "ar"));
  }, [foods, search, filterCategory]);

  const handleDelete = (food: Food) => {
    if (confirm(`هل تريد حذف "${food.name}" من قائمة الأطعمة؟`)) {
      onDelete(food.id);
      onToast("تم الحذف بنجاح");
    }
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-sage-500 to-sage-600 rounded-3xl p-5 text-white shadow-lg shadow-sage-500/20">
        <h2 className="text-lg font-bold mb-1">مكتبة الأطعمة</h2>
        <p className="text-sm text-sage-100/90">
          سجّل الأطعمة التي تتناولها مع الكميات المخصصة لتسهيل حساب الوجبات
        </p>
        <div className="mt-3 text-xs text-sage-100 bg-white/10 rounded-xl px-3 py-2 inline-block">
          📦 {foods.length} صنف مسجل
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن صنف..."
          className="w-full pr-12 pl-4 py-3 bg-white border border-cream-200 rounded-2xl text-sage-900 placeholder-sage-400 focus:outline-none focus:border-sage-500 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-cream-200"
          >
            <XIcon className="w-4 h-4 text-sage-500" />
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto scroll-hide -mx-4 px-4 pb-1">
        <CategoryChip
          label="الكل"
          active={filterCategory === "all"}
          onClick={() => setFilterCategory("all")}
        />
        {CATEGORIES.map((cat) => (
          <CategoryChip
            key={cat}
            label={cat}
            active={filterCategory === cat}
            onClick={() => setFilterCategory(cat)}
          />
        ))}
      </div>

      {/* Food list */}
      <div className="space-y-2.5">
        {filteredFoods.length === 0 ? (
          <div className="bg-white border border-dashed border-cream-300 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-3">🍽️</div>
            <p className="text-sage-700 font-medium mb-1">لا توجد أصناف</p>
            <p className="text-sm text-sage-500">
              {search ? "جرب بحثاً آخر" : "ابدأ بإضافة أول صنف"}
            </p>
          </div>
        ) : (
          filteredFoods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              onEdit={() => setEditingFood(food)}
              onDelete={() => handleDelete(food)}
            />
          ))
        )}
      </div>

      {/* Add button */}
      <button
        onClick={() => setIsAdding(true)}
        className="w-full bg-sage-600 hover:bg-sage-700 active:bg-sage-800 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg shadow-sage-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 sticky bottom-2"
      >
        <PlusIcon className="w-5 h-5" />
        إضافة صنف جديد
      </button>

      {/* Food form modal */}
      <FoodFormModal
        open={isAdding || !!editingFood}
        food={editingFood}
        onClose={() => {
          setIsAdding(false);
          setEditingFood(null);
        }}
        onSave={(food) => {
          if (editingFood) {
            onUpdate(food);
            onToast("تم التحديث بنجاح");
          } else {
            onAdd(food);
            onToast("تم إضافة الصنف بنجاح");
          }
          setIsAdding(false);
          setEditingFood(null);
        }}
      />
    </div>
  );
}

function CategoryChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0",
        active
          ? "bg-sage-600 text-white shadow-md shadow-sage-500/30"
          : "bg-white text-sage-700 border border-cream-200 hover:bg-cream-100"
      )}
    >
      {label}
    </button>
  );
}

function FoodCard({ food, onEdit, onDelete }: { food: Food; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-cream-200 hover:border-sage-300 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-sage-900 truncate">{food.name}</h3>
            <span className="text-[10px] bg-sage-100 text-sage-700 px-2 py-0.5 rounded-full flex-shrink-0">
              {food.category}
            </span>
          </div>
          <p className="text-xs text-sage-600 mb-2">
            {food.carbsPer100g} غم كربوهيدرات / 100 غم
          </p>
          {food.portions.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {food.portions.map((p) => (
                <span
                  key={p.id}
                  className="text-[10px] bg-cream-200 text-sage-700 px-2 py-1 rounded-lg"
                >
                  {p.name} · {p.grams}غ
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 flex-shrink-0">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg hover:bg-sage-50 text-sage-600 active:bg-sage-100"
            aria-label="تعديل"
          >
            <EditIcon className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg hover:bg-coral-500/10 text-coral-500 active:bg-coral-500/20"
            aria-label="حذف"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface FoodFormModalProps {
  open: boolean;
  food: Food | null;
  onClose: () => void;
  onSave: (food: Food) => void;
}

function FoodFormModal({ open, food, onClose, onSave }: FoodFormModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("نشويات");
  const [carbsPer100g, setCarbsPer100g] = useState("");
  const [notes, setNotes] = useState("");
  const [portions, setPortions] = useState<FoodPortion[]>([]);
  const [newPortionName, setNewPortionName] = useState("");
  const [newPortionGrams, setNewPortionGrams] = useState("");

  // Reset form when modal opens/closes or food changes
  useMemo(() => {
    if (open) {
      if (food) {
        setName(food.name);
        setCategory(food.category);
        setCarbsPer100g(food.carbsPer100g.toString());
        setNotes(food.notes || "");
        setPortions(food.portions);
      } else {
        setName("");
        setCategory("نشويات");
        setCarbsPer100g("");
        setNotes("");
        setPortions([]);
      }
      setNewPortionName("");
      setNewPortionGrams("");
    }
  }, [open, food]);

  const addPortion = () => {
    if (!newPortionName.trim() || !newPortionGrams) return;
    const grams = parseFloat(newPortionGrams);
    if (grams <= 0) return;
    setPortions([
      ...portions,
      {
        id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: newPortionName.trim(),
        grams,
      },
    ]);
    setNewPortionName("");
    setNewPortionGrams("");
  };

  const removePortion = (id: string) => {
    setPortions(portions.filter((p) => p.id !== id));
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("يرجى إدخال اسم الصنف");
      return;
    }
    const carbs = parseFloat(carbsPer100g);
    if (!carbs || carbs < 0) {
      alert("يرجى إدخال كمية كربوهيدرات صحيحة");
      return;
    }
    const payload: Food = {
      id: food?.id || `f-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: name.trim(),
      category,
      carbsPer100g: carbs,
      portions,
      notes: notes.trim() || undefined,
      createdAt: food?.createdAt || Date.now(),
    };
    onSave(payload);
  };

  return (
    <Modal open={open} onClose={onClose} title={food ? "تعديل الصنف" : "إضافة صنف جديد"}>
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-sage-800 mb-1.5">اسم الصنف</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: أرز، خبز، تفاح..."
            className="w-full px-4 py-3 bg-cream-100 border border-cream-300 rounded-xl text-sage-900 placeholder-sage-400 focus:outline-none focus:border-sage-500 focus:bg-white"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-sage-800 mb-1.5">الفئة</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 bg-cream-100 border border-cream-300 rounded-xl text-sage-900 focus:outline-none focus:border-sage-500 focus:bg-white"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Carbs per 100g */}
        <div>
          <label className="block text-sm font-semibold text-sage-800 mb-1.5">
            الكربوهيدرات لكل 100 غرام
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={carbsPer100g}
            onChange={(e) => setCarbsPer100g(e.target.value)}
            placeholder="25"
            className="w-full px-4 py-3 bg-cream-100 border border-cream-300 rounded-xl text-sage-900 placeholder-sage-400 focus:outline-none focus:border-sage-500 focus:bg-white"
          />
        </div>

        {/* Portions */}
        <div>
          <label className="block text-sm font-semibold text-sage-800 mb-1.5">
            وحدات قياس مخصصة للصنف
          </label>
          <p className="text-xs text-sage-600 mb-2">
            أضف الوحدات التي تستخدمها عادةً (طبق، حبة، كوب...) مع وزنها بالغرام
          </p>
          <div className="space-y-2 mb-2">
            {portions.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2 bg-sage-50 px-3 py-2 rounded-xl"
              >
                <span className="flex-1 text-sm text-sage-800">
                  <strong>{p.name}</strong> · {p.grams} غم
                </span>
                <button
                  onClick={() => removePortion(p.id)}
                  className="p-1 rounded-lg hover:bg-coral-500/10 text-coral-500"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newPortionName}
              onChange={(e) => setNewPortionName(e.target.value)}
              placeholder="الاسم (طبق، حبة...)"
              className="flex-1 px-3 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-sage-900 placeholder-sage-400 text-sm focus:outline-none focus:border-sage-500"
            />
            <input
              type="number"
              inputMode="decimal"
              value={newPortionGrams}
              onChange={(e) => setNewPortionGrams(e.target.value)}
              placeholder="غرام"
              className="w-20 px-3 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-sage-900 placeholder-sage-400 text-sm text-center focus:outline-none focus:border-sage-500"
            />
            <button
              onClick={addPortion}
              className="px-3 bg-sage-500 hover:bg-sage-600 text-white rounded-xl active:scale-95"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-sage-800 mb-1.5">ملاحظات (اختياري)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="أي ملاحظات..."
            className="w-full px-4 py-3 bg-cream-100 border border-cream-300 rounded-xl text-sage-900 placeholder-sage-400 focus:outline-none focus:border-sage-500 focus:bg-white resize-none"
          />
        </div>

        {/* Save */}
        <button
          onClick={handleSubmit}
          className="w-full bg-sage-600 hover:bg-sage-700 active:bg-sage-800 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-lg shadow-sage-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <CheckIcon className="w-5 h-5" />
          {food ? "حفظ التعديلات" : "إضافة الصنف"}
        </button>
      </div>
    </Modal>
  );
}
