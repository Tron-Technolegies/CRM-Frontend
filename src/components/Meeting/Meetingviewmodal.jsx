import {
  Calendar,
  Clock,
  Link,
  MapPin,
  Pencil,
  Repeat,
  Users,
  Video,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Modal from "../ui/Modal";
import { getMeeting } from "../../api/meeting";

function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function Field({ label, icon: Icon, value }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">
        {Icon && <Icon size={10} />}
        {label}
      </p>
      <p
        className={`text-sm font-medium leading-snug ${
          value ? "text-[#111827]" : "text-[#D1D5DB]"
        }`}
      >
        {value || "—"}
      </p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-2xl border border-[#EAECF0] bg-[#FAFAFA] p-5 space-y-4">
      <p className="text-[10px] font-bold text-[#B0B7C3] uppercase tracking-[0.12em]">
        {title}
      </p>
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
      <p className="text-sm font-medium text-[#111827]">
        Failed to load meeting
      </p>
      <p className="text-xs text-[#9CA3AF]">
        Check your connection or try again.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-2 h-9 px-5 rounded-xl border border-[#E5E7EB] text-sm text-[#374151] font-medium hover:bg-[#F9FAFB] transition"
      >
        Close
      </button>
    </div>
  );
}

// Resolves whichever related record is set (lead / customer / account)
// into a single display name, regardless of relatedType.
function getRelatedName(data) {
  if (!data) return null;
  if (data.relatedType === "lead") return data.relatedLead?.name || null;
  if (data.relatedType === "customer")
    return data.relatedCustomer?.name || null;
  if (data.relatedType === "account")
    return data.relatedAccount?.name || null;
  return null;
}

const relatedTypeLabels = {
  lead: "Lead",
  customer: "Customer",
  account: "Account",
};

export default function MeetingViewModal({
  open,
  onClose,
  onEdit,
  meetingId = null,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!open || !meetingId) return;

    const thisRequestId = ++requestIdRef.current;

    setLoading(true);
    setData(null);
    setError(false);

    getMeeting(meetingId)
      .then((d) => {
        if (thisRequestId !== requestIdRef.current) return;
        setData(d);
      })
      .catch((err) => {
        if (thisRequestId !== requestIdRef.current) return;
        console.error("Failed to load meeting:", err);
        setError(true);
      })
      .finally(() => {
        if (thisRequestId === requestIdRef.current) setLoading(false);
      });
  }, [open, meetingId]);

  const relatedName = getRelatedName(data);
  const hasRelated =
    relatedName && data?.relatedType && data.relatedType !== "none";

  return (
    <Modal
      open={open}
      title="Meeting Details"
      subtitle="Full details for this meeting"
      onClose={onClose}
      maxWidthClassName="max-w-2xl"
    >
      {loading && <Skeleton />}
      {error && <ErrorState onClose={onClose} />}
      {!loading && !error && data && (
        <>
          <div className="space-y-3">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-white border border-[#BFDBFE]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                {data.meetingVenue === "online" ? (
                  <Video size={26} className="text-white" />
                ) : (
                  <MapPin size={26} className="text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="text-xl font-bold text-[#0F172A] leading-tight">
                  {data.title || "Untitled Meeting"}
                </h3>
                {hasRelated && (
                  <p className="text-sm text-[#6B7280] mt-0.5 font-medium">
                    Related to: {relatedName}{" "}
                    <span className="text-xs text-[#9CA3AF] font-normal">
                      ({relatedTypeLabels[data.relatedType]})
                    </span>
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 ring-1 ring-blue-200 capitalize">
                    {data.meetingVenue === "online" ? (
                      <Video size={11} />
                    ) : (
                      <MapPin size={11} />
                    )}
                    {data.meetingVenue}
                  </span>
                  {data.repeat && data.repeat !== "none" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 ring-1 ring-slate-200 capitalize">
                      <Repeat size={11} />
                      {data.repeat}
                    </span>
                  )}
                  {data.host && data.host !== "—" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 ring-1 ring-slate-200">
                      <Users size={11} />
                      {data.host}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Section title="Date & Time">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                <Field
                  label="From"
                  icon={Clock}
                  value={formatDateTime(data.fromDatetime)}
                />
                <Field
                  label="To"
                  icon={Clock}
                  value={formatDateTime(data.toDatetime)}
                />
                <Field
                  label="All Day"
                  icon={Calendar}
                  value={data.allDay ? "Yes" : "No"}
                />
              </div>
            </Section>

            <Section title="Meeting Info">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                <Field label="Host" icon={Users} value={data.host} />
                {data.meetingVenue === "online" ? (
                  <Field label="Provider" icon={Video} value={data.provider} />
                ) : (
                  <Field
                    label="Location"
                    icon={MapPin}
                    value={data.location}
                  />
                )}
              </div>
            </Section>

            {data.participants && data.participants.length > 0 && (
              <Section title="Participants">
                <div className="flex flex-wrap gap-2">
                  {data.participants.map((p) => (
                    <span
                      key={p.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                    >
                      <Users size={11} />
                      {p.fullName || p.full_name || p.name}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {hasRelated && (
              <Section title="Related To">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
                    <Link size={15} className="text-[#6366F1]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">
                      {relatedName}
                    </p>
                    <p className="text-xs text-[#9CA3AF]">
                      {relatedTypeLabels[data.relatedType]}
                    </p>
                  </div>
                </div>
              </Section>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-[#F0F2F5] flex items-center justify-between">
            <p className="text-xs text-[#9CA3AF]">
              Starts {formatDateTime(data.fromDatetime)}
            </p>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="h-10 px-5 rounded-xl border border-[#E5E7EB] text-sm text-[#374151] font-medium hover:bg-[#F9FAFB] transition"
              >
                Close
              </button>
              {onEdit && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEdit(data);
                  }}
                  className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition text-white text-sm font-semibold flex items-center gap-2 shadow-sm"
                >
                  <Pencil size={13} />
                  Edit Meeting
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}