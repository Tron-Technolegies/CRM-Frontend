import {
  Building2,
  Calendar,
  Mail,
  Phone,
  PhoneCall,
  Tag,
  Users,
  Pencil,
  ArrowRightLeft,
  AlertCircle
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import Modal from "../ui/Modal";

import { getLead } from "../../api/lead";

import AddCall from "../Calls/AddCall";
import CallModal from "../Calls/CallModal";
import { createCall } from "../../api/call";
import { createTask } from "../../api/task";


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
  leadId,
  staff,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const requestIdRef = useRef(0);

  const [callOpen, setCallOpen] = useState(false);
  const [twilioCallOpen, setTwilioCallOpen] = useState(false);
  const [callLoading, setCallLoading] = useState(false);

  const handleCreateCall = async (callPayload, taskPayload) => {
    setCallLoading(true);

    try {
      await createCall(callPayload);

      if (taskPayload) {
        try {
          await createTask(taskPayload);
        } catch (taskErr) {
          console.error("Failed to create follow-up task:", taskErr);
        }
      }

      setCallOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setCallLoading(false);
    }
  };


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
            <div>
              <p className="flex items-center gap-2 text-xs text-gray-400 uppercase">
                <Phone size={12} />
                Phone
              </p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm font-medium">{data.phone || "—"}</p>
                {data.phone && (
                  <button
                    type="button"
                    onClick={() => setTwilioCallOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                    title="Call with Twilio"
                  >
                    <PhoneCall size={12} />
                    Call
                  </button>
                )}
              </div>
            </div>
            <Field label="Email" icon={Mail} value={data.email} />
            <Field label="Company" icon={Building2} value={data.companyName} />
            <Field label="Assigned" icon={Users} value={data.assignedTo} />
            <Field label="Source" icon={Tag} value={data.source} />
            <Field label="Date" icon={Calendar} value={data.dateAdded} />
          </div>

          <div className="p-5 border rounded-2xl">
              <p className="text-xs text-gray-400 uppercase mb-2">
                Description
              </p>

              <p className="text-sm whitespace-pre-wrap">
                {data.description || "—"}
              </p>
          </div>

          <div
            className="
              p-4 rounded-2xl
              bg-slate-50 border border-slate-100
              flex flex-col gap-3
            "
          >
            <div className="flex gap-3 flex-wrap items-center justify-between">
              {normalize(data.status) !== "converted" && (
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => onConvert(data.id, "customer")}
                    className="
                      px-4 py-2
                      bg-blue-600 hover:bg-blue-700
                      text-white
                      rounded-xl
                      text-sm font-medium transition
                    "
                  >
                    Convert Customer
                  </button>

                  <button
                    onClick={() => onConvert(data.id, "account")}
                    className="
                      px-4 py-2
                      bg-purple-600 hover:bg-purple-700
                      text-white
                      rounded-xl
                      text-sm font-medium transition
                    "
                  >
                    Convert Account
                  </button>

                  <button
                    onClick={() => onConvert(data.id, "deal")}
                    className="
                      px-4 py-2
                      bg-green-600 hover:bg-green-700
                      text-white
                      rounded-xl
                      text-sm font-medium
                      flex gap-2 items-center transition
                    "
                  >
                    Convert Deal
                  </button>
                </div>
              )}

              <div className="flex gap-2 flex-wrap items-center">
                <button
                  type="button"
                  onClick={() => setTwilioCallOpen(true)}
                  className="
                    px-4 py-2
                    bg-emerald-600 hover:bg-emerald-700
                    text-white
                    rounded-xl
                    text-sm font-semibold
                    flex items-center gap-1.5 transition
                    shadow-sm cursor-pointer
                  "
                >
                  <PhoneCall size={14} />
                  Call Lead
                </button>

                <button
                  type="button"
                  onClick={() => setCallOpen(true)}
                  className="
                    px-4 py-2
                    bg-indigo-600 hover:bg-indigo-700
                    text-white
                    rounded-xl
                    text-sm font-medium transition
                  "
                >
                  Log Call
                </button>
              </div>
            </div>
          </div>

          <div
            className="
              flex justify-end gap-3
              border-t pt-4
            "
          >
            <button onClick={onClose} className="px-5 py-2 border rounded-xl hover:bg-gray-50 transition cursor-pointer">
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
                  bg-blue-600 hover:bg-blue-700
                  text-white
                  rounded-xl
                  flex gap-2 items-center transition cursor-pointer
                "
              >
                <Pencil size={14} />
                Edit
              </button>
            )}
          </div>
        </div>
      )}


      <AddCall
        open={callOpen}
        onClose={() => setCallOpen(false)}
        onSubmit={handleCreateCall}
        loading={callLoading}
        staff={staff}
        leads={data ? [data] : []}
        lockedRelatedType="lead"
        lockedRelatedId={data?.id || ""}
        lockedRelatedName={data?.name || ""}
      />

      <CallModal
        open={twilioCallOpen}
        onClose={() => setTwilioCallOpen(false)}
        lead={data}
      />
    </Modal>
  );
}