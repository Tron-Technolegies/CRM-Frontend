import {
  Building2,
  Phone,
  Globe,
  Users,
  Briefcase,
  Layers,
  MapPin,
} from "lucide-react";

import Modal from "../ui/Modal";

function formatValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

function Avatar({ name }) {
  const initials = name?.slice(0, 2).toUpperCase();

  return (
    <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-medium text-base shrink-0">
      {initials || "?"}
    </div>
  );
}

function Field({ label, icon: Icon, value }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[11px] text-gray-400 tracking-wide uppercase">
        {Icon && <Icon size={12} strokeWidth={1.75} />}
        {label}
      </p>
      <p className="text-sm text-[#1F2937] mt-1">{formatValue(value)}</p>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] p-5 bg-white shadow-sm">
      <h3 className="text-[13px] font-medium text-[#374151] mb-4">{title}</h3>
      {children}
    </div>
  );
}

function AddressBlock({ title, address }) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] p-5 bg-[#FAFAFA]">
      <p className="flex items-center gap-1.5 text-[11px] text-gray-400 tracking-wide uppercase mb-4">
        <MapPin size={12} strokeWidth={1.75} />
        {title}
      </p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Country" value={address?.country} />
        <Field label="Address" value={address?.address} />
        <Field label="Street Address" value={address?.street_address} />
        <Field label="City" value={address?.city} />
        <Field label="State" value={address?.state} />
        <Field label="Zip Code" value={address?.zip_code} />
      </div>
    </div>
  );
}

export default function AccountViewModal({ open, onClose, onEdit, account, accounts = [] }) {
  if (!open || !account) return null;

  // parent_account from the backend is just an ID — resolve the name
  // from the accounts list already loaded on the page.
  const parentAccount = accounts.find(
    (a) => String(a.id) === String(account.parent_account),
  );
  const parentAccountName = parentAccount?.account_name;

  return (
    <Modal
      open={open}
      title="Account Details"
      subtitle="Full profile for this account"
      onClose={onClose}
      maxWidthClassName="max-w-3xl"
    >
      <div className="space-y-4">
        <div className="flex gap-4 p-5 rounded-2xl bg-blue-50/60">
          <Avatar name={account.account_name} />

          <div>
            <h2 className="text-lg font-medium text-[#111827]">{account.account_name || "—"}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{account.website || "No website on file"}</p>

            <div className="flex gap-2 mt-3 flex-wrap">
              {account.account_type && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-normal bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                  {account.account_type}
                </span>
              )}
              {account.industry && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-normal bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                  {account.industry}
                </span>
              )}
            </div>
          </div>
        </div>

        <SectionCard title="Account Information">
          <div className="grid grid-cols-2 gap-y-5 gap-x-5">
            <Field label="Phone" icon={Phone} value={account.phone_number} />
            <Field label="Website" icon={Globe} value={account.website} />
            <Field label="Account Site" icon={Building2} value={account.account_site} />
            <Field label="Assigned To" icon={Users} value={account.assigned_to_name} />
            <Field label="Ownership" icon={Briefcase} value={account.ownership} />
            <Field label="Employees" icon={Users} value={account.employees} />
            <Field label="Account Type" icon={Layers} value={account.account_type} />
            <Field label="Parent Account" icon={Layers} value={parentAccountName} />
          </div>
        </SectionCard>

        <div>
          <h3 className="text-[13px] font-medium text-[#374151] mb-3 px-1">Address Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AddressBlock title="Billing Address" address={account.billing_address} />
            <AddressBlock title="Shipping Address" address={account.shipping_address} />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#EEF2F7] pt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-[#E5E7EB] text-sm text-[#374151] rounded-xl hover:bg-gray-50 transition"
          >
            Close
          </button>

          {onEdit && (
            <button
              onClick={() => {
                onClose();
                onEdit(account);
              }}
              className="px-5 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}