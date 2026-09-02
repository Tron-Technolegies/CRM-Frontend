import {
  Phone,
  Calendar,
  Clock,
  User,
  Link2,
  Pencil,
  AlertCircle,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import Modal from "../ui/Modal";
import { getCall } from "../../api/call";

const statusConfig = {
  scheduled: {
    style: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    dot: "bg-blue-500",
    label: "Scheduled",
  },
  "follow up": {
    style: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    dot: "bg-amber-500",
    label: "Follow Up",
  },
  completed: {
    style: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-500",
    label: "Completed",
  },
  missed: {
    style: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    dot: "bg-rose-500",
    label: "Missed",
  },
  cancelled: {
    style: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
    dot: "bg-slate-400",
    label: "Cancelled",
  },
};

const callTypeConfig = {
  inbound: {
    style: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
    dot: "bg-indigo-500",
    label: "Inbound (Received Call)",
  },
  outbound: {
    style: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
    dot: "bg-purple-500",
    label: "Outbound (Outgoing Call)",
  },
};

function normalize(value) {
  return (value || "").toString().trim().toLowerCase();
}

function Badge({ value, config }) {
  const key = normalize(value);

  const cfg =
    config[key] || {
      style: "bg-slate-100 text-slate-600",
      dot: "bg-slate-400",
      label: value,
    };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ${cfg.style}`}
    >
      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
      {cfg.label || value}
    </span>
  );
}

function Field({ label, icon: Icon, value }) {
  return (
    <div>
      <p className="flex items-center gap-2 text-xs text-gray-400 uppercase">
        {Icon && <Icon size={12} />}
        {label}
      </p>
      <p className="text-sm font-medium mt-1">{value || "—"}</p>
    </div>
  );
}

function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function relatedInfo(data) {
  if (!data) return { type: null, name: null };
  if (data.relatedLead) return { type: "Lead", name: data.relatedLead.name };
  if (data.relatedContact) return { type: "Contact", name: data.relatedContact.name };
  if (data.relatedDeal) return { type: "Deal", name: data.relatedDeal.name };
  if (data.relatedAccount) return { type: "Account", name: data.relatedAccount.name };
  return { type: null, name: null };
}

export default function CallViewModal({ open, onClose, onEdit, callId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!open || !callId) return;

    const thisRequestId = ++requestIdRef.current;

    const fetchCall = async () => {
      setLoading(true);
      setLoadError(null);
      setData(null);

      try {
        const response = await getCall(callId);

        if (thisRequestId !== requestIdRef.current) return;

        setData(response.data ?? response);
      } catch (err) {
        if (thisRequestId !== requestIdRef.current) return;

        console.error(err);
        setLoadError("Couldn't load this call. Please try again.");
      } finally {
        if (thisRequestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    };

    fetchCall();
  }, [open, callId]);

  if (!open) return null;

  const related = relatedInfo(data);

  return (
    <Modal
      open={open}
      title="Call Details"
      subtitle="Full details for this call"
      onClose={onClose}
      maxWidthClassName="max-w-2xl"
    >
      {loading && <p>Loading...</p>}

      {!loading && loadError && (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-700 text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          {loadError}
        </div>
      )}

      {!loading && data && (
        <div className="space-y-5">
          <div className="flex gap-4 p-5 rounded-2xl bg-blue-50">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
              <Phone size={24} />
            </div>

            <div>
              <h2 className="text-xl font-bold">{data.subject}</h2>

              {related.name && (
                <p className="text-sm text-gray-500">
                  {related.type}: {related.name}
                </p>
              )}

              <div className="flex gap-2 mt-3">
                <Badge value={data.status} config={statusConfig} />
                <Badge value={data.callType} config={callTypeConfig} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 p-5 border rounded-2xl">
            <Field label="Start Time" icon={Calendar} value={formatDateTime(data.startTime)} />
            <Field label="Duration" icon={Clock} value={data.duration ? `${data.duration} min` : null} />
            <Field label="Assigned To" icon={User} value={data.assignedTo} />
            <Field label="Related To" icon={Link2} value={related.name ? `${related.type}: ${related.name}` : null} />
          </div>

          <div className="p-5 border rounded-2xl">
            <p className="text-xs text-gray-400 uppercase mb-2">Notes</p>
            <p className="text-sm whitespace-pre-wrap">{data.notes || "—"}</p>
          </div>

          <div className="flex justify-end gap-3 border-t pt-4">
            <button onClick={onClose} className="px-5 py-2 border rounded-xl">
              Close
            </button>

            {onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(data);
                }}
                className="px-5 py-2 bg-blue-600 text-white rounded-xl flex gap-2"
              >
                <Pencil size={14} />
                Edit
              </button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}