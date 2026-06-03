import { MedicalSettings, MealItem, InsulinDose } from "./types";

// Calculate insulin dose based on carbs, current BG, and medical settings
export function calculateDose(
  items: MealItem[],
  currentBG: number,
  settings: MedicalSettings
): InsulinDose {
  const totalCarbs = items.reduce((sum, item) => sum + item.carbs, 0);

  // Carbs dose: total carbs / carb ratio
  const carbsDose = settings.carbRatio > 0 ? totalCarbs / settings.carbRatio : 0;

  // Correction dose: (current BG - target) / ISF
  // Only positive if BG is above target
  const bgDifference = currentBG - settings.targetBG;
  const correctionDose = bgDifference > 0 && settings.isf > 0 ? bgDifference / settings.isf : 0;

  // Total dose
  const total = Math.max(0, carbsDose + correctionDose);

  // Warnings
  let warning: string | undefined;
  if (currentBG < 70) {
    warning = "⚠️ مستوى السكر منخفض. يجب تناول كربوهيدرات سريعة أولاً وعدم إعطاء الإنسولين.";
  } else if (currentBG < 80) {
    warning = "⚠️ مستوى السكر منخفض قليلاً. يُنصح بتناول سكريات سريعة قبل الإنسولين.";
  } else if (currentBG > 250) {
    warning = "⚠️ مستوى السكر مرتفع جداً. تحقق من الكيتونات وراجع الطبيب إذا لزم الأمر.";
  } else if (currentBG > 180) {
    warning = "⚠️ مستوى السكر مرتفع. قد تحتاج لتصحيح إضافي وراقب الأعراض.";
  }

  return {
    total: Math.round(total * 10) / 10,
    carbsDose: Math.round(carbsDose * 10) / 10,
    correctionDose: Math.round(correctionDose * 10) / 10,
    totalCarbs: Math.round(totalCarbs * 10) / 10,
    currentBG,
    warning,
    timestamp: Date.now(),
  };
}

// Calculate carbs for a specific food and portion
export function calculateFoodCarbs(carbsPer100g: number, grams: number): number {
  return (carbsPer100g * grams) / 100;
}

// Get BG status info
export function getBGStatus(bg: number): {
  label: string;
  color: string;
  bgClass: string;
  textClass: string;
} {
  if (bg < 70) return { label: "منخفض جداً", color: "coral", bgClass: "bg-coral-500/15", textClass: "text-coral-600" };
  if (bg < 80) return { label: "منخفض", color: "coral", bgClass: "bg-coral-400/15", textClass: "text-coral-500" };
  if (bg <= 140) return { label: "ممتاز", color: "sage", bgClass: "bg-sage-500/15", textClass: "text-sage-600" };
  if (bg <= 180) return { label: "مرتفع قليلاً", color: "gold", bgClass: "bg-gold-500/15", textClass: "text-gold-600" };
  if (bg <= 250) return { label: "مرتفع", color: "coral", bgClass: "bg-coral-400/15", textClass: "text-coral-500" };
  return { label: "مرتفع جداً", color: "coral", bgClass: "bg-coral-500/20", textClass: "text-coral-600" };
}

// Format date in Arabic
export function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
