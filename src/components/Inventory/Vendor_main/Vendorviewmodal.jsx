import { useEffect, useState } from "react";
import { X, Building2, UserRound, Pencil } from "lucide-react";
import { getVendor } from "../../../api/vendor";

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
    <div className="min-w-0">
      <div className="text-[11px] font-semibold tracking-wide text-[#9CA3AF] uppercase mb-1">
        {label}
      </div>
      <div className="text-sm font-semibold text-[#111827] break-words">
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

export default function VendorViewModal({ vendorId, onClose, onEdit }) {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!vendorId) return;

    const fetchVendor = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getVendor(vendorId);
        setVendor(data);
      } catch (err) {
        console.error("FETCH VENDOR (view) ERROR:", err);
        setError("Could not load this vendor.");
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [vendorId]);

  if (!vendorId) return null;

  const isActive = vendor?.status === "active";

  const addressLine = vendor?.address
    ? [
        vendor.address.address,
        vendor.address.streetAddress,
        vendor.address.city,
        vendor.address.state,
        vendor.address.zipCode,
        vendor.address.country,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-[#E5E7EB] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-lg font-semibold text-[#111827]">
              Vendor Details
            </h2>
            <p className="text-sm text-[#6B7280] mt-1">
              Full details for this vendor
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B7280] hover:bg-gray-100 cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {loading && <div className="text-[#6B7280] text-sm py-8 text-center">Loading vendor details...</div>}

          {error && (
            <div className="px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && vendor && (
            <>
              {/* Highlight card */}
              <div className="flex items-center gap-4 p-5 rounded-2xl border border-blue-100 bg-blue-50/50">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Building2 size={22} className="text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-[#111827] text-lg truncate">
                    {vendor.vendorName}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge dot dotColor={isActive ? "#22C55E" : "#9CA3AF"}>
                      {isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge>{vendor.vendorCode}</Badge>
                    {vendor.contactPerson && (
                      <Badge>
                        <UserRound size={12} />
                        {vendor.contactPerson}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Vendor details grid */}
              <div className="mt-5 p-5 rounded-2xl bg-[#F9FAFB] border border-[#EEF2F7]">
                <div className="text-[11px] font-bold tracking-wider text-[#9CA3AF] uppercase mb-4">
                  General Information
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-5">
                  <DetailField
                    label="Status"
                    value={isActive ? "Active" : "Inactive"}
                  />
                  <DetailField label="Vendor Code" value={vendor.vendorCode} />
                  <DetailField label="GST Number" value={vendor.gstNumber} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  <DetailField label="Email" value={vendor.email} />
                  <DetailField label="Phone" value={vendor.phone} />
                  <DetailField label="Mobile" value={vendor.mobile} />
                </div>
              </div>

              {/* Address */}
              <div className="mt-5 p-5 rounded-2xl bg-[#F9FAFB] border border-[#EEF2F7]">
                <div className="text-[11px] font-bold tracking-wider text-[#9CA3AF] uppercase mb-2">
                  Address
                </div>
                <div className="text-sm font-medium text-[#111827] leading-relaxed break-words">
                  {addressLine || "No address added."}
                </div>
              </div>

              {/* Notes */}
              {vendor.notes && (
                <div className="mt-5 p-5 rounded-2xl bg-[#F9FAFB] border border-[#EEF2F7]">
                  <div className="text-[11px] font-bold tracking-wider text-[#9CA3AF] uppercase mb-2">
                    Notes
                  </div>
                  <div className="text-sm text-[#374151] leading-relaxed break-words whitespace-pre-wrap">
                    {vendor.notes}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!loading && !error && vendor && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB]">
            <span className="text-xs text-[#6B7280]">
              Updated {formatDate(vendor.updatedAt)}
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
                onClick={() => onEdit(vendor.id)}
                className="px-4 h-11 rounded-xl bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
              >
                <Pencil size={16} />
                Edit Vendor
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}