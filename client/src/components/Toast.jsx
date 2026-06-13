import { useState, useEffect, useCallback } from "react";

let toastIdCounter = 0;
let addToastGlobal = null;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 3000) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type, exiting: false }]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, duration);
  }, []);

  useEffect(() => {
    addToastGlobal = addToast;
  }, [addToast]);

  return { toasts, addToast };
}

export function toast(message, type = "success") {
  if (addToastGlobal) addToastGlobal(message, type);
}

const borderColors = {
  success: "border-l-emerald-400",
  error: "border-l-rose-400",
  info: "border-l-blue-400",
};

const icons = {
  success: "✓",
  error: "✕",
  info: "ℹ",
};

export default function ToastContainer({ toasts }) {
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-5 py-3.5 bg-[#0f0f1e]/95 backdrop-blur-xl border border-white/8 rounded-xl shadow-2xl min-w-[280px] border-l-[3px] ${borderColors[t.type]} ${t.exiting ? "animate-slide-out-right" : "animate-slide-right"}`}
        >
          <span className="text-base shrink-0">{icons[t.type]}</span>
          <span className="text-sm font-medium text-slate-200">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
