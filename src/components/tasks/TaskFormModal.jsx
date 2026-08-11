import { useEffect, useMemo, useState } from "react";
import api from "../../api/Api";
import Modal from "../ui/Modal";
import Spinner from "../ui/Spinner";
import { usePicklist } from "../../hooks/usePicklist";

function validateTask(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = "Task title is required";
  if (!form.dueDate) errors.dueDate = "Due date is required";
  return errors;
}

export default function TaskFormModal({ open, onClose, onSubmit, loading = false, initialData = null }) {
  const [staff, setStaff] = useState([]);
  const [leads, setLeads] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [deals, setDeals] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const priorityOptions = usePicklist("task_priority");
  const statusOptions = usePicklist("task_status");

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const { data } = await api.get("/staff/view/");
        setStaff(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch staff:", err);
        setStaff([]);
      }
    };
    fetchStaff();
  }, []);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const { data } = await api.get("/lead/view/");
        setLeads(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch leads:", err);
        setLeads([]);
      }
    };
    fetchLeads();
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data } = await api.get("/customer/view/");
        setCustomers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
        setCustomers([]);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const { data } = await api.get("/deal/view/");
        setDeals(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch deals:", err);
        setDeals([]);
      }
    };
    fetchDeals();
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { data } = await api.get("/account/view/");
        setAccounts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch accounts:", err);
        setAccounts([]);
      }
    };
    fetchAccounts();
  }, []);

  const blankForm = useMemo(() => ({
    title: "",
    description: "",
    assignedTo: "",
    relatedType: "none",
    relatedLead: "",
    relatedContact: "",
    relatedDeal: "",
    relatedAccount: "",
    priority: "medium",
    status: "pending",
    dueDate: "",
  }), []);

  const [form, setForm] = useState(blankForm);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      const relatedType = initialData.relatedType || "none";
      const relatedId = initialData.relatedToId || "";

      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        assignedTo: initialData.assigned_to || initialData.assignedToId || "",
        relatedType,
        relatedLead: relatedType === "lead" ? relatedId : "",
        relatedContact: relatedType === "contact" ? relatedId : "",
        relatedDeal: relatedType === "deal" ? relatedId : "",
        relatedAccount: relatedType === "account" ? relatedId : "",
        dueDate: initialData.due_date || initialData.dueDate || "",
        priority: initialData.priority?.toLowerCase() || "medium",
        status: initialData.status?.toLowerCase() || "pending",
      });
    } else {
      setForm(blankForm);
    }
    setTouched({});
  }, [initialData]);

  const errors = validateTask(form);
  const hasErrors = Object.keys(errors).length > 0;

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const closeAndReset = () => {
    if (loading) return;
    setForm(blankForm);
    setTouched({});
    onClose();
  };

  const submit = () => {
    setTouched({ title: true, dueDate: true });
    if (hasErrors) return;
    onSubmit(form);
  };

  return (
    <Modal
      open={open}
      title={initialData ? "Edit Task" : "Add New Task"}
      subtitle={initialData ? "Update the task details below" : "Fill in the details below to add a new task"}
      onClose={closeAndReset}
      maxWidthClassName="max-w-2xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="text-sm text-[#111827] font-medium">Task Title <span className="text-red-500">*</span></label>
          <input
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, title: true }))}
            placeholder="e.g. Follow up with ABC Solutions"
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          />
          {touched.title && errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-[#111827] font-medium">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Add task description..."
            className="mt-2 w-full min-h-[90px] rounded-xl border border-[#E5E7EB] p-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 resize-none"
          />
        </div>

        <div>
          <label className="text-sm text-[#111827] font-medium">Assigned To</label>
          <select
            value={form.assignedTo}
            onChange={(e) => setField("assignedTo", e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select team member</option>
            {staff.map((s) => (<option key={s.id} value={s.id}>{s.full_name || s.fullName || s.name}</option>))}
          </select>
        </div>

        <div>
          <label className="text-sm text-[#111827] font-medium">Priority</label>
          <select
            value={form.priority}
            onChange={(e) => setField("priority", e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
          >
            {priorityOptions.map((o) => <option key={o.id} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-[#111827] font-medium">Related To</label>
          <select
            value={form.relatedType}
            onChange={(e) => setField("relatedType", e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="none">None</option>
            <option value="lead">Lead</option>
            <option value="contact">Contact (Customer)</option>
            <option value="deal">Deal</option>
            <option value="account">Account</option>
          </select>
        </div>

        {form.relatedType === "lead" && (
          <div className="md:col-span-2">
            <label className="text-sm text-[#111827] font-medium">Select Lead</label>
            <select
              value={form.relatedLead}
              onChange={(e) => setField("relatedLead", e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select lead</option>
              {leads.map((l) => (<option key={l.id} value={l.id}>{l.name}</option>))}
            </select>
          </div>
        )}

        {form.relatedType === "contact" && (
          <div className="md:col-span-2">
            <label className="text-sm text-[#111827] font-medium">Select Contact</label>
            <select
              value={form.relatedContact}
              onChange={(e) => setField("relatedContact", e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select contact</option>
              {customers.map((c) => (<option key={c.id} value={c.id}>{c.companyName}</option>))}
            </select>
          </div>
        )}

        {form.relatedType === "deal" && (
          <div className="md:col-span-2">
            <label className="text-sm text-[#111827] font-medium">Select Deal</label>
            <select
              value={form.relatedDeal}
              onChange={(e) => setField("relatedDeal", e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select a deal</option>
              {deals.map((d) => (<option key={d.id} value={d.id}>{d.deal_name || d.name}</option>))}
            </select>
          </div>
        )}

        {form.relatedType === "account" && (
          <div className="md:col-span-2">
            <label className="text-sm text-[#111827] font-medium">Select Account</label>
            <select
              value={form.relatedAccount}
              onChange={(e) => setField("relatedAccount", e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select account</option>
              {accounts.map((a) => (<option key={a.id} value={a.id}>{a.account_name}</option>))}
            </select>
          </div>
        )}

        <div>
          <label className="text-sm text-[#111827] font-medium">Status</label>
          <select
            value={form.status}
            onChange={(e) => setField("status", e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
          >
            {statusOptions.map((o) => <option key={o.id} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-[#111827] font-medium">Due Date <span className="text-red-500">*</span></label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setField("dueDate", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, dueDate: true }))}
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          />
          {touched.dueDate && errors.dueDate && <p className="text-xs text-red-600 mt-1">{errors.dueDate}</p>}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button type="button" onClick={closeAndReset} disabled={loading} className="h-11 px-5 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] disabled:opacity-60">Cancel</button>
        <button type="button" onClick={submit} disabled={loading} className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium flex items-center gap-2 disabled:opacity-60">
          {loading && <Spinner size={16} className="text-white" />}
          {initialData ? "Save Task" : "Add Task"}
        </button>
      </div>
    </Modal>
  );
}