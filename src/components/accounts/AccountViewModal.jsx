import Modal from "../ui/Modal";

function formatValue(value) {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
}

function AddressBlock({ title, address }) {
  const lines = [
    address?.address,
    address?.street_address,
    address?.city,
    address?.state,
    address?.zip_code,
    address?.country,
  ].filter(Boolean);

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
      <h3 className="text-sm font-semibold text-[#111827]">{title}</h3>
      <div className="mt-2 space-y-1 text-sm text-[#64748B]">
        {lines.length > 0 ? lines.map((line, index) => <p key={index}>{line}</p>) : <p>-</p>}
      </div>
    </div>
  );
}

export default function AccountViewModal({ open, onClose, account }) {
  if (!account) return null;

  return (
    <Modal
      open={open}
      title={account.account_name || "Account Details"}
      subtitle="A quick overview of the account record"
      onClose={onClose}
      maxWidthClassName="max-w-4xl">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[#E5E7EB] p-4">
          <p className="text-xs uppercase tracking-wide text-[#64748B]">Account Name</p>
          <p className="mt-1 text-sm font-medium text-[#111827]">{formatValue(account.account_name)}</p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] p-4">
          <p className="text-xs uppercase tracking-wide text-[#64748B]">Assigned To</p>
          <p className="mt-1 text-sm font-medium text-[#111827]">{formatValue(account.assigned_to_name)}</p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] p-4">
          <p className="text-xs uppercase tracking-wide text-[#64748B]">Phone</p>
          <p className="mt-1 text-sm font-medium text-[#111827]">{formatValue(account.phone_number)}</p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] p-4">
          <p className="text-xs uppercase tracking-wide text-[#64748B]">Website</p>
          <p className="mt-1 text-sm font-medium text-[#111827]">{formatValue(account.website)}</p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] p-4">
          <p className="text-xs uppercase tracking-wide text-[#64748B]">Account Type</p>
          <p className="mt-1 text-sm font-medium text-[#111827]">{formatValue(account.account_type)}</p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] p-4">
          <p className="text-xs uppercase tracking-wide text-[#64748B]">Industry</p>
          <p className="mt-1 text-sm font-medium text-[#111827]">{formatValue(account.industry)}</p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] p-4">
          <p className="text-xs uppercase tracking-wide text-[#64748B]">Ownership</p>
          <p className="mt-1 text-sm font-medium text-[#111827]">{formatValue(account.ownership)}</p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] p-4">
          <p className="text-xs uppercase tracking-wide text-[#64748B]">Employees</p>
          <p className="mt-1 text-sm font-medium text-[#111827]">{formatValue(account.employees)}</p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] p-4">
          <p className="text-xs uppercase tracking-wide text-[#64748B]">Parent Account</p>
          <p className="mt-1 text-sm font-medium text-[#111827]">{formatValue(account.parent_account)}</p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] p-4">
          <p className="text-xs uppercase tracking-wide text-[#64748B]">Account Site</p>
          <p className="mt-1 text-sm font-medium text-[#111827]">{formatValue(account.account_site)}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <AddressBlock title="Billing Address" address={account.billing_address} />
        <AddressBlock title="Shipping Address" address={account.shipping_address} />
      </div>
    </Modal>
  );
}
