import { useEffect, useState } from "react";
import { X, Wrench, Pencil } from "lucide-react";
import { getService } from "../../../api/service";

function Badge({ children, dot, dotColor }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-[#E5E7EB] text-[#374151]">
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: dotColor }}
        />
      )}
      {children}
    </span>
  );
}

function DetailField({ label, value }) {
  return (
    <div>
      <div className="text-[11px] font-semibold tracking-wide text-[#9CA3AF] uppercase mb-1">
        {label}
      </div>
      <div className="text-sm font-semibold text-[#111827]">
        {value || "-"}
      </div>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

const billingTypeLabels = {
  fixed: "Fixed Price",
  hourly: "Hourly",
  daily: "Daily",
  monthly: "Monthly",
  yearly: "Yearly",
};

export default function ServiceViewModal({ serviceId, onClose, onEdit }) {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!serviceId) return;

    const fetchService = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getService(serviceId);
        setService(data);
      } catch (err) {
        console.error("FETCH SERVICE (view) ERROR:", err);
        setError("Could not load this service.");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  if (!serviceId) return null;

  const isActive = service?.status === "active";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-[#E5E7EB] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-lg font-semibold text-[#111827]">
              Service Details
            </h2>
            <p className="text-sm text-[#6B7280] mt-1">
              Full details for this service
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B7280] hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {loading && <div className="text-[#6B7280] text-sm">Loading...</div>}

          {error && (
            <div className="px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && service && (
            <>
              {/* Highlight card */}
              <div className="flex items-center gap-4 p-4 rounded-xl border border-blue-100 bg-blue-50/50">
                <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Wrench size={20} className="text-white" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-[#111827] text-base truncate">
                    {service.serviceName}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge dot dotColor={isActive ? "#22C55E" : "#9CA3AF"}>
                      {isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge>{service.serviceCode}</Badge>
                    <Badge>
                      {billingTypeLabels[service.billingType] ||
                        service.billingType}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Service details grid */}
              <div className="mt-5 p-4 rounded-xl bg-[#F9FAFB]">
                <div className="text-[11px] font-semibold tracking-wide text-[#9CA3AF] uppercase mb-3">
                  Service Details
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <DetailField
                    label="Unit Price"
                    value={
                      typeof service.unitPrice === "number"
                        ? service.unitPrice.toFixed(2)
                        : service.unitPrice
                    }
                  />
                  <DetailField
                    label="Tax %"
                    value={
                      typeof service.taxPercentage === "number"
                        ? service.taxPercentage.toFixed(2)
                        : service.taxPercentage
                    }
                  />
                  <DetailField
                    label="Billing Type"
                    value={
                      billingTypeLabels[service.billingType] ||
                      service.billingType
                    }
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <DetailField label="Category" value={service.category} />
                  <DetailField label="Duration" value={service.duration} />
                  <DetailField
                    label="Status"
                    value={isActive ? "Active" : "Inactive"}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mt-5 p-4 rounded-xl bg-[#F9FAFB]">
                <div className="text-[11px] font-semibold tracking-wide text-[#9CA3AF] uppercase mb-2">
                  Description
                </div>
                <div className="text-sm text-[#111827]">
                  {service.description || "No description added."}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!loading && !error && service && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB]">
            <span className="text-xs text-[#6B7280]">
              Updated {formatDate(service.updatedAt)}
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 h-11 rounded-xl border border-[#E5E7EB] text-[#111827] hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => onEdit(service.id)}
                className="px-4 h-11 rounded-xl bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
              >
                <Pencil size={16} />
                Edit Service
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}