import { useState, useEffect } from "react";
import { History, ChevronDown, ChevronUp, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { getAuditHistory } from "../../api/audit";

export function formatAuditDate(dateInput) {
  if (!dateInput) return "—";
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return String(dateInput);

  const datePart = d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const timePart = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${datePart} • ${timePart}`;
}

export function formatFieldName(field) {
  if (!field) return "";
  // Insert space before capital letters (camelCase to words) and replace underscores/hyphens
  const words = field
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();
  return words
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatFieldValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "[Object]";
    }
  }
  return String(value);
}

function resolveUserName(user) {
  if (!user) return "Unknown";
  if (typeof user === "string") return user;
  return user.name || user.username || user.email || "Unknown";
}

const actionStyles = {
  created: {
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-500",
    label: "Created",
  },
  updated: {
    badge: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    dot: "bg-blue-500",
    label: "Updated",
  },
  deleted: {
    badge: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    dot: "bg-rose-500",
    label: "Deleted",
  },
};

export default function AuditHistory({
  lastEditedBy = null,
  lastEditedAt = null,
  editHistory = null,
  modelName = null,
  objectId = null,
  className = "",
  defaultExpanded = false,
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [fetchedData, setFetchedData] = useState(null);
  const [loading, setLoading] = useState(false);

  // If audit props are not provided via Single View API response, fallback to reusable endpoint
  const needsFetch =
    (!editHistory || editHistory.length === 0) &&
    !lastEditedBy &&
    !lastEditedAt &&
    Boolean(modelName && objectId);

  useEffect(() => {
    if (!needsFetch) return;

    let isMounted = true;
    setLoading(true);

    getAuditHistory(modelName, objectId)
      .then((res) => {
        if (!isMounted) return;
        if (res) {
          // Can be { lastEditedBy, lastEditedAt, editHistory } or array
          if (Array.isArray(res)) {
            setFetchedData({ editHistory: res });
          } else {
            setFetchedData(res);
          }
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        // Non-breaking fallback if audit history is absent or errors
        console.warn(`Audit history fetch skipped for ${modelName}/${objectId}:`, err?.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [needsFetch, modelName, objectId]);

  // Combine props with fetched data
  const rawHistory = editHistory || fetchedData?.editHistory || [];
  const rawLastEditedBy = lastEditedBy || fetchedData?.lastEditedBy;
  const rawLastEditedAt = lastEditedAt || fetchedData?.lastEditedAt;

  // Sort history newest first
  const historyList = [...(Array.isArray(rawHistory) ? rawHistory : [])].sort((a, b) => {
    const tA = a?.at ? new Date(a.at).getTime() : 0;
    const tB = b?.at ? new Date(b.at).getTime() : 0;
    return tB - tA;
  });

  // If lastEditedBy/lastEditedAt are not explicitly provided, derive from the latest history entry
  const latestEntry = historyList[0] || null;
  const finalLastEditedBy = rawLastEditedBy || (latestEntry?.action === "updated" ? latestEntry?.by : latestEntry?.by);
  const finalLastEditedAt = rawLastEditedAt || latestEntry?.at;

  const editorName = resolveUserName(finalLastEditedBy);
  const formattedEditedAt = formatAuditDate(finalLastEditedAt);

  const hasAuditData = Boolean(finalLastEditedBy || finalLastEditedAt || historyList.length > 0);

  if (loading) {
    return (
      <div className={`rounded-2xl border border-[#EAECF0] bg-[#FAFAFA] p-4 animate-pulse ${className}`}>
        <div className="h-4 w-32 bg-[#E5E7EB] rounded mb-2" />
        <div className="h-3 w-48 bg-[#F3F4F6] rounded" />
      </div>
    );
  }

  if (!hasAuditData) {
    return (
      <div className={`rounded-2xl border border-[#EAECF0] bg-[#FAFAFA] p-4 text-xs text-[#9CA3AF] flex items-center gap-2 ${className}`}>
        <History size={14} className="text-[#9CA3AF] shrink-0" />
        <span>No edit history available yet.</span>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-[#EAECF0] bg-[#FAFAFA] p-4 sm:p-5 transition-all ${className}`}>
      {/* Header / Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center text-[#4B5563] shrink-0 shadow-2xs">
            <History size={15} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em]">
              Audit Trail
            </p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-xs text-[#374151]">
              <span>
                Last edited by <span className="font-semibold text-[#111827]">{editorName}</span>
              </span>
              {finalLastEditedAt && (
                <>
                  <span className="text-[#D1D5DB]">•</span>
                  <span className="text-[#6B7280]">{formattedEditedAt}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Expand / Collapse toggle */}
        {historyList.length > 0 && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-xs font-medium text-[#374151] transition cursor-pointer shadow-2xs"
            aria-expanded={expanded}
          >
            <span>{expanded ? "Hide History" : `Edit History (${historyList.length})`}</span>
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        )}
      </div>

      {/* Expandable History Timeline */}
      {expanded && historyList.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-3">
          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.12em]">
            Change Log ({historyList.length} {historyList.length === 1 ? "entry" : "entries"})
          </p>

          <div className="space-y-2.5">
            {historyList.map((entry, index) => {
              const actionKey = String(entry.action || "updated").toLowerCase();
              const actionCfg = actionStyles[actionKey] || {
                badge: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
                dot: "bg-slate-400",
                label: entry.action ? entry.action.charAt(0).toUpperCase() + entry.action.slice(1) : "Modified",
              };

              const user = resolveUserName(entry.by);
              const timestamp = formatAuditDate(entry.at);
              const changes = entry.changes && typeof entry.changes === "object" ? entry.changes : null;
              const hasChanges = changes && Object.keys(changes).length > 0;

              return (
                <div
                  key={index}
                  className="rounded-xl border border-[#E5E7EB] bg-white p-3.5 shadow-2xs space-y-2"
                >
                  {/* Entry Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#F3F4F6] text-[#4B5563] flex items-center justify-center text-[10px] font-medium">
                        <User size={11} />
                      </span>
                      <span className="text-xs font-semibold text-[#111827]">{user}</span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${actionCfg.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${actionCfg.dot}`} />
                        {actionCfg.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#6B7280] font-medium">{timestamp}</span>
                  </div>

                  {/* Changes Diff */}
                  {hasChanges ? (
                    <div className="mt-2 pt-2 border-t border-[#F3F4F6] divide-y divide-[#F3F4F6]">
                      {Object.entries(changes).map(([fieldKey, changeVal]) => {
                        const fieldLabel = formatFieldName(fieldKey);
                        const oldVal = formatFieldValue(changeVal?.old);
                        const newVal = formatFieldValue(changeVal?.new);

                        return (
                          <div
                            key={fieldKey}
                            className="py-1.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
                          >
                            <span className="font-semibold text-[#4B5563] shrink-0 min-w-[130px]">
                              {fieldLabel}
                            </span>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className="line-through text-[#9CA3AF] bg-[#F9FAFB] border border-[#EAECF0] px-2 py-0.5 rounded text-[11px] font-mono"
                                title={`Old value: ${oldVal}`}
                              >
                                {oldVal}
                              </span>
                              <ArrowRight size={11} className="text-[#9CA3AF] shrink-0" />
                              <span
                                className="text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded text-[11px] font-mono font-medium"
                                title={`New value: ${newVal}`}
                              >
                                {newVal}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-xs text-[#6B7280] flex items-center gap-1.5 pt-1">
                      {actionKey === "created" ? (
                        <>
                          <CheckCircle2 size={12} className="text-emerald-500" />
                          <span>Initial record creation</span>
                        </>
                      ) : (
                        <span>Record {actionKey}</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
