import { useEffect, useMemo, useState } from "react";
import Modal from "../ui/Modal";
import Spinner from "../ui/Spinner";

const defaultRoles = ["admin", "manager", "sales agent", "support agent"];

function formatRole(role) {
  return role.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function validateUser(form) {
  const errors = {};
  if (!form.fullName.trim()) errors.fullName = "Full name is required";
  if (!form.email.trim()) errors.email = "Email address is required";
  if (!form.role) errors.role = "Role is required";
  if (!form.department.trim()) errors.department = "Department is required";
  return errors;
}

export default function UserFormModal({ open, onClose, onSubmit, loading = false, initialData = null }) {
  const blankForm = useMemo(() => ({
    fullName: "",
    email: "",
    role: "sales agent",
    department: "",
  }), []);

  const [form, setForm] = useState(blankForm);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        fullName: initialData.fullName || "",
        email: initialData.email || "",
        role: initialData.role || "sales agent",
        department: initialData.department || "",
      });
    } else {
      setForm(blankForm);
    }
    setTouched({});
  }, [initialData]);

  const errors = validateUser(form);
  const hasErrors = Object.keys(errors).length > 0;

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const closeAndReset = () => {
    if (loading) return;
    setForm(blankForm);
    setTouched({});
    onClose();
  };

  const submit = () => {
    setTouched({ fullName: true, email: true, role: true, department: true });
    if (hasErrors) return;
    onSubmit(form);
  };

  return (
    <Modal
      open={open}
      title={initialData ? "Edit User" : "Invite New User"}
      subtitle={initialData ? "Update the user details below" : "Add a new team member to your workspace"}
      onClose={closeAndReset}
      maxWidthClassName="max-w-md"
    >
      <div className="space-y-5">
        <div>
          <label className="text-sm text-[#111827] font-medium">Full Name <span className="text-red-500">*</span></label>
          <input
            value={form.fullName}
            onChange={(e) => setField("fullName", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, fullName: true }))}
            placeholder="John Doe"
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          />
          {touched.fullName && errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="text-sm text-[#111827] font-medium">Email Address <span className="text-red-500">*</span></label>
          <input
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, email: true }))}
            placeholder="john.doe@example.com"
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          />
          {touched.email && errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="text-sm text-[#111827] font-medium">Role <span className="text-red-500">*</span></label>
          <select
            value={form.role}
            onChange={(e) => setField("role", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, role: true }))}
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
          >
            {defaultRoles.map((r) => (
              <option key={r} value={r}>{formatRole(r)}</option>
            ))}
          </select>
          {touched.role && errors.role && <p className="text-xs text-red-600 mt-1">{errors.role}</p>}
        </div>

        <div>
          <label className="text-sm text-[#111827] font-medium">Department <span className="text-red-500">*</span></label>
          <input
            value={form.department}
            onChange={(e) => setField("department", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, department: true }))}
            placeholder="e.g. Sales"
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          />
          {touched.department && errors.department && <p className="text-xs text-red-600 mt-1">{errors.department}</p>}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button type="button" onClick={closeAndReset} disabled={loading} className="h-11 px-5 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] disabled:opacity-60">
          Cancel
        </button>
        <button type="button" onClick={submit} disabled={loading} className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium flex items-center gap-2 disabled:opacity-60">
          {loading && <Spinner size={16} className="text-white" />}
          {initialData ? "Save Changes" : "Send Invitation"}
        </button>
      </div>
    </Modal>
  );
}