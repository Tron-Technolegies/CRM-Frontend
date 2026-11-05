import { X } from "lucide-react";

export default function Modal({
  open,
  title,
  subtitle,
  onClose,
  children,
  maxWidthClassName = "max-w-2xl",
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="fixed inset-0 bg-black/40 cursor-pointer"
      />

      <div className="min-h-full p-2 sm:p-4 md:p-6 flex items-center justify-center">
        <div
          className={`w-full ${maxWidthClassName} bg-white rounded-2xl shadow-xl border border-[#E5E7EB] flex flex-col relative z-10 max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-3rem)] overflow-hidden`}
        >
          <div className="p-4 sm:p-6 border-b border-[#EEF2F7] flex items-start justify-between gap-3 shrink-0">
            <div className="min-w-0 flex-1">
              {title && <h2 className="text-lg sm:text-xl font-semibold text-[#111827] truncate">{title}</h2>}
              {subtitle && <p className="text-xs sm:text-sm text-[#64748B] mt-0.5 sm:mt-1">{subtitle}</p>}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border border-[#E5E7EB] grid place-items-center text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC] transition cursor-pointer shrink-0"
              aria-label="Close"
            >
              <X size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
