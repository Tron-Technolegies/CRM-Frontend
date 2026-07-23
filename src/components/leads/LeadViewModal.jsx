import {
  Building2,
  Calendar,
  Mail,
  Phone,
  Tag,
  Users,
  Pencil,
  ArrowRightLeft,
  AlertCircle
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import Modal from "../ui/Modal";

import { getLead } from "../../api/lead";


const priorityConfig = {
  High: {
    style: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    dot: "bg-rose-500",
    label: "High Priority"
  },
  Medium: {
    style: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    dot: "bg-amber-500",
    label: "Medium Priority"
  },
  Low: {
    style: "bg-green-50 text-green-700 ring-1 ring-green-200",
    dot: "bg-green-500",
    label: "Low Priority"
  },
};


const statusConfig = {
  new: {
    style: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    dot: "bg-blue-500",
    label: "New"
  },
  contacted: {
    style: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    dot: "bg-amber-500",
    label: "Contacted"
  },
  converted: {
    style: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-500",
    label: "Converted"
  },
  lost: {
    style: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
    dot: "bg-slate-400",
    label: "Lost"
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
      label: value
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


function Avatar({ name }) {
  const initials = name
    ?.split(" ")
    .map(n => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="
        w-16 h-16 rounded-2xl
        bg-blue-600
        flex items-center justify-center
        text-white font-bold text-lg
      "
    >
      {initials || "?"}
    </div>
  );
}


function Field({ label, icon: Icon, value }) {
  return (
    <div>
      <p
        className="
          flex items-center gap-2
          text-xs text-gray-400 uppercase
        "
      >
        {Icon && <Icon size={12} />}
        {label}
      </p>

      <p className="text-sm font-medium mt-1">{value || "—"}</p>
    </div>
  );
}


export default function LeadViewModal({
  open,
  onClose,
  onEdit,
  onConvert,
  leadId
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!open || !leadId) return;

    const thisRequestId = ++requestIdRef.current;

    const fetchLead = async () => {
      setLoading(true);
      setLoadError(null);
      setData(null);

      try {
        const response = await getLead(leadId);

        if (thisRequestId !== requestIdRef.current) return;

        setData(response);
      } catch (err) {
        if (thisRequestId !== requestIdRef.current) return;

        console.error(err);
        setLoadError("Couldn't load this lead. Please try again.");
      } finally {
        if (thisRequestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    };

    fetchLead();
  }, [open, leadId]);


  if (!open) return null;

  return (
    <Modal
      open={open}
      title="Lead Details"
      subtitle="Full profile for this lead"
      onClose={onClose}
      maxWidthClassName="max-w-2xl"
    >
      {loading && <p>Loading...</p>}

      {!loading && loadError && (
        <div
          className="
            p-4 rounded-2xl bg-rose-50 text-rose-700 text-sm
            flex items-center gap-2
          "
        >
          <AlertCircle size={16} />
          {loadError}
        </div>
      )}

      {!loading && data && (
        <div className="space-y-5">
          <div
            className="
              flex gap-4
              p-5 rounded-2xl
              bg-blue-50
            "
          >
            <Avatar name={data.name} />

            <div>
              <h2 className="text-xl font-bold">{data.name}</h2>

              <p>{data.companyName}</p>

              <div className="flex gap-2 mt-3">
                <Badge value={data.status} config={statusConfig} />
                <Badge value={data.priority} config={priorityConfig} />
              </div>
            </div>
          </div>

          <div
            className="
              grid grid-cols-2 gap-5
              p-5 border rounded-2xl
            "
          >
            <Field label="Phone" icon={Phone} value={data.phone} />
            <Field label="Email" icon={Mail} value={data.email} />
            <Field label="Company" icon={Building2} value={data.companyName} />
            <Field label="Assigned" icon={Users} value={data.assignedTo} />
            <Field label="Source" icon={Tag} value={data.source} />
            <Field label="Date" icon={Calendar} value={data.dateAdded} />
          </div>

          {normalize(data.status) !== "converted" && (
            <div
              className="
                p-4 rounded-2xl
                bg-emerald-50
                flex flex-col gap-3
              "
            >
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => onConvert(data.id, "customer")}
                  className="
                    px-4 py-2
                    bg-blue-600
                    text-white
                    rounded-xl
                    text-sm
                  "
                >
                  Convert Customer
                </button>

                <button
                  onClick={() => onConvert(data.id, "account")}
                  className="
                    px-4 py-2
                    bg-purple-600
                    text-white
                    rounded-xl
                    text-sm
                  "
                >
                  Convert Account
                </button>

                <button
                  onClick={() => onConvert(data.id, "deal")}
                  className="
                    px-4 py-2
                    bg-green-600
                    text-white
                    rounded-xl
                    text-sm
                    flex gap-2 items-center
                  "
                >
                  <ArrowRightLeft size={14} />
                  Convert Deal + Customer
                </button>
              </div>
            </div>
          )}

          <div
            className="
              flex justify-end gap-3
              border-t pt-4
            "
          >
            <button onClick={onClose} className="px-5 py-2 border rounded-xl">
              Close
            </button>

            {onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(data);
                }}
                className="
                  px-5 py-2
                  bg-blue-600
                  text-white
                  rounded-xl
                  flex gap-2
                "
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