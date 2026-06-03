import { useState, useMemo } from "react";
import { CustomUnit } from "../types";
import { PlusIcon, EditIcon, TrashIcon, CheckIcon } from "../icons";
import { Modal } from "./Modal";

interface UnitsPageProps {
  units: CustomUnit[];
  onAdd: (unit: CustomUnit) => void;
  onUpdate: (unit: CustomUnit) => void;
  onDelete: (id: string) => void;
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export function UnitsPage({ units, onAdd, onUpdate, onDelete, onToast }: UnitsPageProps) {
  const [editingUnit, setEditingUnit] = useState<CustomUnit | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleDelete = (unit: CustomUnit) => {
    if (confirm(`هل تريد حذف وحدة "${unit.name}"؟`)) {
      onDelete(unit.id);
      onToast("تم الحذف بنجاح");
    }
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-sage-500 to-sage-600 rounded-3xl p-5 text-white shadow-lg shadow-sage-500/20">
        <h2 className="text-lg font-bold mb-1">وحدات القياس المخصصة</h2>
        <p className="text-sm text-sage-100/90">
          أنشئ وحدات قياس خاصة بك (ملعقة، قطعة، نصف خبزة...) لتستخدمها عند بناء الوجبات
        </p>
        <div className="mt-3 text-xs text-sage-100 bg-white/10 rounded-xl px-3 py-2 inline-block">
          📏 {units.length} وحدة مسجلة
        </div>
      </div>

      {/* Examples */}
      <div className="bg-cream-200/50 border border-cream-300 rounded-2xl p-4">
        <h3 className="text-sm font-bold text-sage-800 mb-2">💡 أمثلة على الوحدات المخصصة</h3>
        <div className="flex flex-wrap gap-2">
          {["ملعقة كبيرة", "ملعقة صغيرة", "قطعة", "نصف قطعة", "كوب", "كوب صغير", "طبق", "نصف خبزة", "حبة"].map((ex) => (
            <span
              key={ex}
              className="text-xs bg-white text-sage-700 px-3 py-1.5 rounded-full border border-cream-300"
            >
              {ex}
            </span>
          ))}
        </div>
      </div>

      {/* Units list */}
      <div className="space-y-2.5">
        {units.length === 0 ? (
          <div className="bg-white border border-dashed border-cream-300 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-3">📏</div>
            <p className="text-sage-700 font-medium mb-1">لا توجد وحدات</p>
            <p className="text-sm text-sage-500">ابدأ بإضافة أول وحدة قياس</p>
          </div>
        ) : (
          units.map((unit) => (
            <UnitCard
              key={unit.id}
              unit={unit}
              onEdit={() => setEditingUnit(unit)}
              onDelete={() => handleDelete(unit)}
            />
          ))
        )}
      </div>

      {/* Add button */}
      <button
        onClick={() => setIsAdding(true)}
        className="w-full bg-sage-600 hover:bg-sage-700 active:bg-sage-800 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg shadow-sage-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <PlusIcon className="w-5 h-5" />
        إضافة وحدة جديدة
      </button>

      {/* Form modal */}
      <UnitFormModal
        open={isAdding || !!editingUnit}
        unit={editingUnit}
        onClose={() => {
          setIsAdding(false);
          setEditingUnit(null);
        }}
        onSave={(unit) => {
          if (editingUnit) {
            onUpdate(unit);
            onToast("تم التحديث بنجاح");
          } else {
            onAdd(unit);
            onToast("تم إضافة الوحدة بنجاح");
          }
          setIsAdding(false);
          setEditingUnit(null);
        }}
      />
    </div>
  );
}

function UnitCard({ unit, onEdit, onDelete }: { unit: CustomUnit; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-cream-200 flex items-center gap-3 hover:border-sage-300 transition-colors">
      <div className="w-10 h-10 bg-sage-100 rounded-xl flex items-center justify-center text-sage-600 flex-shrink-0">
        <span className="text-lg font-bold">{unit.name.charAt(0)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sage-900">{unit.name}</h3>
        {unit.description && (
          <p className="text-xs text-sage-600 truncate">{unit.description}</p>
        )}
      </div>
      <div className="flex gap-1 flex-shrink-0">
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
  );
}

interface UnitFormModalProps {
  open: boolean;
  unit: CustomUnit | null;
  onClose: () => void;
  onSave: (unit: CustomUnit) => void;
}

function UnitFormModal({ open, unit, onClose, onSave }: UnitFormModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useMemo(() => {
    if (open) {
      setName(unit?.name || "");
      setDescription(unit?.description || "");
    }
  }, [open, unit]);

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("يرجى إدخال اسم الوحدة");
      return;
    }
    onSave({
      id: unit?.id || `u-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: name.trim(),
      description: description.trim() || undefined,
      createdAt: unit?.createdAt || Date.now(),
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={unit ? "تعديل الوحدة" : "إضافة وحدة جديدة"}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-sage-800 mb-1.5">اسم الوحدة</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: ملعقة كبيرة، قطعة، نصف خبزة..."
            className="w-full px-4 py-3 bg-cream-100 border border-cream-300 rounded-xl text-sage-900 placeholder-sage-400 focus:outline-none focus:border-sage-500 focus:bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-sage-800 mb-1.5">وصف (اختياري)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="مثال: 15 غرام تقريباً"
            className="w-full px-4 py-3 bg-cream-100 border border-cream-300 rounded-xl text-sage-900 placeholder-sage-400 focus:outline-none focus:border-sage-500 focus:bg-white"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-sage-600 hover:bg-sage-700 active:bg-sage-800 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-lg shadow-sage-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <CheckIcon className="w-5 h-5" />
          {unit ? "حفظ التعديلات" : "إضافة الوحدة"}
        </button>
      </div>
    </Modal>
  );
}
