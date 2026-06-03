// Types for the T1D Insulin Calculator App

export interface MedicalSettings {
  // Insulin Sensitivity Factor (mg/dL per 1 unit of insulin)
  isf: number;
  // Carb Ratio - grams of carbs covered by 1 unit of insulin
  carbRatio: number;
  // Target blood glucose (mg/dL)
  targetBG: number;
  // User's name (optional)
  userName: string;
  // Whether settings have been configured
  isConfigured: boolean;
}

export interface FoodPortion {
  id: string;
  name: string; // e.g., "حبة", "كوب", "طبق"
  grams: number; // grams for this portion
}

export interface Food {
  id: string;
  name: string;
  category: string;
  carbsPer100g: number;
  portions: FoodPortion[];
  notes?: string;
  createdAt: number;
}

export interface CustomUnit {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
}

export interface MealItem {
  id: string;
  foodId: string;
  foodName: string;
  portionId: string;
  portionName: string;
  grams: number;
  carbs: number;
}

export interface InsulinDose {
  total: number;
  carbsDose: number;
  correctionDose: number;
  totalCarbs: number;
  currentBG: number;
  warning?: string;
  timestamp: number;
}

export interface AppData {
  version: string;
  settings: MedicalSettings;
  foods: Food[];
  customUnits: CustomUnit[];
  history: InsulinDose[];
  exportDate?: number;
}

// Default data
export const DEFAULT_DATA: AppData = {
  version: "1.0.0",
  settings: {
    isf: 50,
    carbRatio: 10,
    targetBG: 100,
    userName: "",
    isConfigured: false,
  },
  foods: [
    {
      id: "default-1",
      name: "أرز أبيض (مطبوخ)",
      category: "نشويات",
      carbsPer100g: 28,
      portions: [
        { id: "p1", name: "طبق صغير", grams: 150 },
        { id: "p2", name: "طبق كبير", grams: 250 },
        { id: "p3", name: "كوب", grams: 80 },
      ],
      createdAt: Date.now(),
    },
    {
      id: "default-2",
      name: "خبز عربي",
      category: "نشويات",
      carbsPer100g: 50,
      portions: [
        { id: "p1", name: "رغيف كامل", grams: 80 },
        { id: "p2", name: "نصف رغيف", grams: 40 },
        { id: "p3", name: "ربع رغيف", grams: 20 },
      ],
      createdAt: Date.now(),
    },
    {
      id: "default-3",
      name: "تمر",
      category: "فواكه",
      carbsPer100g: 75,
      portions: [
        { id: "p1", name: "حبة", grams: 8 },
        { id: "p2", name: "ثلاث حبات", grams: 24 },
      ],
      createdAt: Date.now(),
    },
    {
      id: "default-4",
      name: "حليب كامل الدسم",
      category: "ألبان",
      carbsPer100g: 5,
      portions: [
        { id: "p1", name: "كوب", grams: 240 },
        { id: "p2", name: "نصف كوب", grams: 120 },
      ],
      createdAt: Date.now(),
    },
  ],
  customUnits: [
    { id: "u1", name: "ملعقة كبيرة", description: "15 غرام تقريباً", createdAt: Date.now() },
    { id: "u2", name: "ملعقة صغيرة", description: "5 غرام تقريباً", createdAt: Date.now() },
    { id: "u3", name: "قطعة", description: "قطعة واحدة", createdAt: Date.now() },
  ],
  history: [],
};
