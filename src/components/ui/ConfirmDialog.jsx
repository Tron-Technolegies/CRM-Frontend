import Modal from "./Modal";
import Spinner from "./Spinner";

export default function ConfirmDialog({
  open,
  title = "Confirm",
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      title={title}
      subtitle={description}
      onClose={loading ? undefined : onCancel}
      maxWidthClassName="max-w-md"
    >
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="h-10 sm:h-11 px-5 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] hover:bg-gray-50 transition cursor-pointer disabled:opacity-60"
        >
          {cancelText}
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={`h-10 sm:h-11 px-5 rounded-xl text-sm font-medium text-white transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 ${
            danger ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading && <Spinner size={16} className="text-white" />}
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
