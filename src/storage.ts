import { AppData, DEFAULT_DATA } from "./types";

const STORAGE_KEY = "t1d-insulin-calculator-data-v1";

// Load data from localStorage
export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveData(DEFAULT_DATA);
      return { ...DEFAULT_DATA };
    }
    const parsed = JSON.parse(raw) as AppData;
    // Merge with defaults to ensure all fields exist
    return {
      ...DEFAULT_DATA,
      ...parsed,
      settings: { ...DEFAULT_DATA.settings, ...parsed.settings },
      foods: parsed.foods || [],
      customUnits: parsed.customUnits || [],
      history: parsed.history || [],
    };
  } catch (err) {
    console.error("Error loading data:", err);
    return { ...DEFAULT_DATA };
  }
}

// Save data to localStorage
export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Error saving data:", err);
    alert("حدث خطأ في حفظ البيانات. قد تكون الذاكرة ممتلئة.");
  }
}

// Export data as downloadable JSON file
export function exportData(data: AppData): void {
  const exportPayload: AppData = {
    ...data,
    exportDate: Date.now(),
  };
  const json = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const date = new Date().toISOString().split("T")[0];
  a.href = url;
  a.download = `t1d-insulin-backup-${date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import data from JSON file
export function importData(file: File): Promise<AppData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text) as AppData;
        // Validate basic structure
        if (!parsed.settings || !Array.isArray(parsed.foods)) {
          throw new Error("ملف غير صالح");
        }
        const merged: AppData = {
          ...DEFAULT_DATA,
          ...parsed,
          settings: { ...DEFAULT_DATA.settings, ...parsed.settings },
          foods: parsed.foods || [],
          customUnits: parsed.customUnits || [],
          history: parsed.history || [],
        };
        saveData(merged);
        resolve(merged);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("فشل قراءة الملف"));
    reader.readAsText(file);
  });
}

// Generate a unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
