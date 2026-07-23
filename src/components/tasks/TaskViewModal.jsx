import { Calendar, Flag, Link, Tag, Users, Pencil, CheckCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Modal from "../ui/Modal";
import { getTask } from "../../api/task";

const priorityConfig = {
  High:   { style: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",    dot: "bg-rose-500",  label: "High Priority" },
  Medium: { style: "bg-amber-50 text-amber-700 ring-1 ring-amber-200", dot: "bg-amber-500", label: "Medium Priority" },
  Low:    { style: "bg-green-50 text-green-700 ring-1 ring-green-200", dot: "bg-green-500", label: "Low Priority" },
};

const statusConfig = {
  Pending:       { style: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",      dot: "bg-slate-400" },
  "In Progress": { style: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",          dot: "bg-blue-500" },
  Completed:     { style: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
  Cancelled:     { style: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",          dot: "bg-rose-500" },
};

function Badge({ value, config }) {
  const cfg = config[value] || { style: "bg-slate-100 text-slate-600 ring-1 ring-slate-200", dot: "bg-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${cfg.style}`}>
      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />{cfg.label || value}
    </span>
  );
}

function Field({ label, icon: Icon, value }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">
        {Icon && <Icon size={10} />}{label}
      </p>
      <p className={`text-sm font-medium leading-snug ${value ? "text-[#111827]" : "text-[#D1D5DB]"}`}>
        {value || "—"}
      </p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-2xl border border-[#EAECF0] bg-[#FAFAFA] p-5 space-y-4">
      <p className="text-[10px] font-bold text-[#B0B7C3] uppercase tracking-[0.12em]">{title}</p>
      {children}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-28 rounded-2xl bg-[#F0F2F5]" />
      <div className="h-36 rounded-2xl bg-[#F0F2F5]" />
      <div className="h-24 rounded-2xl bg-[#F0F2F5]" />
    </div>
  );
}

function ErrorState({ onClose }) {
  return (
    <div className="py-12 flex flex-col items-center gap-3 text-center">
      <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center">
        <span className="text-rose-500 text-xl font-bold">!</span>
      </div>
      <p className="text-sm font-medium text-[#111827]">Failed to load task</p>
      <p className="text-xs text-[#9CA3AF]">Check your connection or try again.</p>
      <button type="button" onClick={onClose} className="mt-2 h-9 px-5 rounded-xl border border-[#E5E7EB] text-sm text-[#374151] font-medium hover:bg-[#F9FAFB] transition">Close</button>
    </div>
  );
}

export default function TaskViewModal({ open, onClose, onEdit, taskId = null }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!open || !taskId) return;

    const thisRequestId = ++requestIdRef.current;

    setLoading(true);
    setData(null);
    setError(false);

    getTask(taskId)
      .then((d) => {
        if (thisRequestId !== requestIdRef.current) return;
        setData(d);
      })
      .catch((err) => {
        if (thisRequestId !== requestIdRef.current) return;
        console.error("Failed to load task:", err);
        setError(true);
      })
      .finally(() => {
        if (thisRequestId === requestIdRef.current) setLoading(false);
      });
  }, [open, taskId]);

  return (
    <Modal open={open} title="Task Details" subtitle="Full details for this task" onClose={onClose} maxWidthClassName="max-w-2xl">
      {loading && <Skeleton />}
      {error && <ErrorState onClose={onClose} />}
      {!loading && !error && data && (
        <>
          <div className="space-y-3">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-[#FFFBF0] to-white border border-[#FDE68A]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-md">
                <CheckCircle size={28} className="text-white" />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="text-xl font-bold text-[#0F172A] leading-tight">{data.title || "Untitled Task"}</h3>
                {data.relatedTo && <p className="text-sm text-[#6B7280] mt-0.5 font-medium">Related to: {data.relatedTo}</p>}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge value={data.status} config={statusConfig} />
                  <Badge value={data.priority} config={priorityConfig} />
                  {data.assignedTo && data.assignedTo !== "—" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 ring-1 ring-slate-200">
                      <Users size={11} />{data.assignedTo}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Section title="Task Details">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                <Field label="Status" icon={Tag} value={data.status} />
                <Field label="Priority" icon={Flag} value={data.priority} />
                <Field label="Assigned To" icon={Users} value={data.assignedTo} />
                <Field label="Related To" icon={Link} value={data.relatedTo} />
                <Field label="Due Date" icon={Calendar} value={data.dueDate} />
              </div>
            </Section>

            {data.description && (
              <Section title="Description">
                <p className="text-sm text-[#374151] leading-relaxed">{data.description}</p>
              </Section>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-[#F0F2F5] flex items-center justify-between">
            <p className="text-xs text-[#9CA3AF]">Due {data.dueDate || "—"}</p>
            <div className="flex items-center gap-2.5">
              <button type="button" onClick={onClose} className="h-10 px-5 rounded-xl border border-[#E5E7EB] text-sm text-[#374151] font-medium hover:bg-[#F9FAFB] transition">Close</button>
              {onEdit && (
                <button type="button" onClick={() => { onClose(); onEdit(data); }} className="h-10 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] transition text-white text-sm font-semibold flex items-center gap-2 shadow-sm">
                  <Pencil size={13} />Edit Task
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}