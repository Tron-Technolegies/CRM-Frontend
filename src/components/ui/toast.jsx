import { useCallback, useMemo, useState } from "react";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { ToastContext } from "./toastContext";

function iconForVariant(variant) {
  switch (variant) {
    case "success":
      return CheckCircle2;
    case "error":
      return TriangleAlert;
    default:
      return Info;
  }
}

function stylesForVariant(variant) {
  switch (variant) {
    case "success":
      return {
        ring: "border-emerald-200",
        icon: "text-emerald-600",
        title: "text-[#111827]",
        body: "text-[#64748B]",
      };
    case "error":
      return {
        ring: "border-red-200",
        icon: "text-red-600",
        title: "text-[#111827]",
        body: "text-[#64748B]",
      };
    default:
      return {
        ring: "border-slate-200",
        icon: "text-blue-600",
        title: "text-[#111827]",
        body: "text-[#64748B]",
      };
  }
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    ({ title, message, variant = "info", durationMs = 2500 }) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const toast = { id, title, message, variant };
      setToasts((prev) => [toast, ...prev].slice(0, 5));

      if (durationMs > 0) {
        window.setTimeout(() => removeToast(id), durationMs);
      }

      return id;
    },
    [removeToast],
  );

  const value = useMemo(() => ({ pushToast, removeToast }), [pushToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="fixed top-4 right-4 z-[60] space-y-3 w-[360px] max-w-[calc(100vw-2rem)]">
        {toasts.map((t) => {
          const Icon = iconForVariant(t.variant);
          const styles = stylesForVariant(t.variant);

          return (
            <div
              key={t.id}
              className={`bg-white border ${styles.ring} rounded-2xl shadow-lg p-4 flex gap-3`}
              role="status"
              aria-live="polite"
            >
              <div className="pt-0.5">
                <Icon size={18} className={styles.icon} />
              </div>

              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold ${styles.title}`}>{t.title}</p>
                {t.message && <p className={`text-sm ${styles.body} mt-0.5`}>{t.message}</p>}
              </div>

              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="w-8 h-8 rounded-xl grid place-items-center text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC] transition"
                aria-label="Dismiss toast"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
