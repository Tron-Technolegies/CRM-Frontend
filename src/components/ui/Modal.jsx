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
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 cursor-pointer"
      />

      <div className="absolute inset-0 p-4 sm:p-6 flex items-center justify-center overflow-y-auto">
        <div
          className={`w-full ${maxWidthClassName} bg-white rounded-2xl shadow-xl border border-[#E5E7EB] flex flex-col max-h-[calc(100vh-3rem)]`}
        >
          <div className="p-6 border-b border-[#EEF2F7] flex items-start justify-between gap-4 shrink-0">
            <div className="min-w-0">
              {title && <h2 className="text-xl font-semibold text-[#111827]">{title}</h2>}
              {subtitle && <p className="text-sm text-[#64748B] mt-1">{subtitle}</p>}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-xl border border-[#E5E7EB] grid place-items-center text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC] transition cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
