import { useState, useEffect, useCallback } from "react";
import { AppData, Food, CustomUnit, InsulinDose, MedicalSettings } from "./types";
import { loadData, saveData } from "./storage";
import { Header } from "./components/Header";
import { BottomNav, Tab } from "./components/BottomNav";
import { HomePage } from "./components/HomePage";
import { CalculatorPage } from "./components/CalculatorPage";
import { FoodsPage } from "./components/FoodsPage";
import { UnitsPage } from "./components/UnitsPage";
import { SettingsPage } from "./components/SettingsPage";
import { DataPage } from "./components/DataPage";
import { Toast, ToastType } from "./components/Toast";

export default function App() {
  const [data, setData] = useState<AppData>(() => loadData());
  const [tab, setTab] = useState<Tab>("home");
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);

  // Persist data whenever it changes
  useEffect(() => {
    saveData(data);
  }, [data]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    setToast({ msg: message, type });
  }, []);

  // ---- Settings ----
  const updateSettings = (settings: MedicalSettings) => {
    setData((prev) => ({ ...prev, settings }));
  };

  // ---- Foods ----
  const addFood = (food: Food) => {
    setData((prev) => ({ ...prev, foods: [...prev.foods, food] }));
  };
  const updateFood = (food: Food) => {
    setData((prev) => ({
      ...prev,
      foods: prev.foods.map((f) => (f.id === food.id ? food : f)),
    }));
  };
  const deleteFood = (id: string) => {
    setData((prev) => ({ ...prev, foods: prev.foods.filter((f) => f.id !== id) }));
  };

  // ---- Custom Units ----
  const addUnit = (unit: CustomUnit) => {
    setData((prev) => ({ ...prev, customUnits: [...prev.customUnits, unit] }));
  };
  const updateUnit = (unit: CustomUnit) => {
    setData((prev) => ({
      ...prev,
      customUnits: prev.customUnits.map((u) => (u.id === unit.id ? unit : u)),
    }));
  };
  const deleteUnit = (id: string) => {
    setData((prev) => ({ ...prev, customUnits: prev.customUnits.filter((u) => u.id !== id) }));
  };

  // ---- History ----
  const saveDose = (dose: InsulinDose) => {
    setData((prev) => ({ ...prev, history: [dose, ...prev.history].slice(0, 50) }));
  };

  // ---- Data Management ----
  const importNewData = (newData: AppData) => {
    setData(newData);
  };

  const resetAll = () => {
    // Clear localStorage and reset to defaults
    localStorage.removeItem("t1d-insulin-calculator-data-v1");
    const defaults = loadData();
    setData(defaults);
  };

  const renderPage = () => {
    switch (tab) {
      case "home":
        return (
          <HomePage
            data={data}
            settings={data.settings}
            onNavigate={(t) => setTab(t as Tab)}
          />
        );
      case "calculator":
        return (
          <CalculatorPage
            foods={data.foods}
            settings={data.settings}
            onSaveDose={saveDose}
            onToast={showToast}
          />
        );
      case "foods":
        return (
          <div className="space-y-5">
            <FoodsPage
              foods={data.foods}
              onAdd={addFood}
              onUpdate={updateFood}
              onDelete={deleteFood}
              onToast={showToast}
            />
            <div className="border-t-2 border-cream-200 pt-2">
              <h2 className="text-base font-bold text-sage-800 mb-3 px-1">وحدات القياس</h2>
              <UnitsPage
                units={data.customUnits}
                onAdd={addUnit}
                onUpdate={updateUnit}
                onDelete={deleteUnit}
                onToast={showToast}
              />
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-5">
            <SettingsPage
              settings={data.settings}
              onSave={updateSettings}
              onToast={showToast}
            />
            <div className="border-t-2 border-cream-200 pt-2">
              <DataPage
                data={data}
                onImport={importNewData}
                onReset={resetAll}
                onToast={showToast}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const headerInfo: Record<Tab, { title: string; subtitle: string }> = {
    home: { title: "حاسبة الإنسولين الذكية", subtitle: "إدارة شاملة للسكري من النوع الأول" },
    calculator: { title: "حاسبة الجرعة", subtitle: "احسب جرعة الإنسولين بدقة" },
    foods: { title: "الأطعمة والوحدات", subtitle: "إدارة مكتبة طعامك ووحداتك" },
    settings: { title: "الإعدادات والبيانات", subtitle: "المعايير الطبية والنسخ الاحتياطي" },
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-cream-200 via-cream-100 to-cream-200">
      {/* Mobile-app frame */}
      <div className="w-full max-w-md min-h-screen bg-cream-100 shadow-2xl shadow-sage-900/10 flex flex-col relative">
        <Header title={headerInfo[tab].title} subtitle={headerInfo[tab].subtitle} />

        <main className="flex-1 overflow-y-auto scroll-hide px-4 pt-4 pb-24">
          <div key={tab} className="animate-fade-in">
            {renderPage()}
          </div>
        </main>

        <div className="sticky bottom-0">
          <BottomNav current={tab} onChange={setTab} />
        </div>

        {toast && (
          <Toast
            message={toast.msg}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}
