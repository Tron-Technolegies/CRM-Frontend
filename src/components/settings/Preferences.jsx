import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Plus, Trash2, X, Check } from "lucide-react";
import { useToast } from "../ui/toastContext.js";

const api = axios.create({ baseURL: "http://localhost:8000/api/admin" });

const fieldGroups = [
  { key: "lead_status", label: "Lead Status" },
  { key: "lead_source", label: "Lead Source" },
  { key: "lead_priority", label: "Lead Priority" },
  { key: "deal_stage", label: "Deal Stage" },
  { key: "deal_source", label: "Deal Source" },
  { key: "deal_priority", label: "Deal Priority" },
  { key: "customer_status", label: "Customer Status" },
  { key: "customer_industry", label: "Customer Industry" },
  { key: "task_status", label: "Task Status" },
  { key: "task_priority", label: "Task Priority" },
];

export default function Preferences() {
  const { pushToast } = useToast();
  const [activeField, setActiveField] = useState("lead_status");
  const [options, setOptions] = useState([]);
  const [newLabel, setNewLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editLabel, setEditLabel] = useState("");

  const fetchOptions = () => {
    setFetching(true);
    api.get(`/picklists/view/?field=${activeField}`)
      .then((res) => setOptions(res.data))
      .catch((err) => {
        console.error("Failed to fetch options:", err);
        pushToast({ title: "Failed to load options", variant: "error" });
      })
      .finally(() => setFetching(false));
  };

  useEffect(() => {
    fetchOptions();
    setEditingId(null);
  }, [activeField]);

  const addOption = async () => {
    if (!newLabel.trim()) return;
    setLoading(true);
    try {
      const value = newLabel.trim().toLowerCase().replace(/\s+/g, "_");
      await api.post("/picklists/add/", { field: activeField, value, label: newLabel.trim() });
      setNewLabel("");
      fetchOptions();
      pushToast({ title: "Option added", message: `${newLabel.trim()} added successfully`, variant: "success" });
    } catch (err) {
      console.error("Failed to add option:", err);
      const message = err.response?.data || "Failed to add option";
      pushToast({ title: "Failed to add option", message: typeof message === "string" ? message : "This option may already exist", variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (option) => {
    setEditingId(option.id);
    setEditLabel(option.label);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditLabel("");
  };

  const saveEdit = async (id) => {
    if (!editLabel.trim()) return;
    try {
      await api.put(`/picklists/update/${id}/`, { label: editLabel.trim() });
      setEditingId(null);
      fetchOptions();
      pushToast({ title: "Option updated", variant: "success" });
    } catch (err) {
      console.error("Failed to update option:", err);
      pushToast({ title: "Failed to update option", variant: "error" });
    }
  };

  const deleteOption = async (id, label) => {
    try {
      await api.delete(`/picklists/delete/${id}/`);
      fetchOptions();
      pushToast({ title: "Option deleted", message: `${label} removed`, variant: "success" });
    } catch (err) {
      console.error("Failed to delete option:", err);
      pushToast({ title: "Failed to delete option", variant: "error" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-semibold text-[#111827]">Preferences</h1>
        <p className="text-sm text-[#64748B] mt-1">Manage dropdown options used across your CRM.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        {/* Field list */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-2 h-fit">
          {fieldGroups.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveField(f.key)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition cursor-pointer ${
                activeField === f.key ? "bg-blue-50 text-blue-600 font-medium" : "text-[#374151] hover:bg-[#F9FAFB]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Options editor */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-[#111827] mb-4">
            {fieldGroups.find((f) => f.key === activeField)?.label} Options
          </h2>

          <div className="flex items-center gap-2 mb-6">
            <input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addOption()}
              placeholder="Enter new option label"
              className="h-11 flex-1 rounded-xl border border-[#E5E7EB] px-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={addOption}
              disabled={loading}
              className="h-11 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium flex items-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              <Plus size={16} /> Add
            </button>
          </div>

          {fetching && <p className="text-sm text-[#94A3B8] text-center py-6">Loading options...</p>}

          {!fetching && (
            <div className={`space-y-2 pr-1 ${options.length > 5 ? "max-h-[300px] overflow-y-auto" : ""}`}>
              {options.map((o) => (
                <div key={o.id} className="flex items-center justify-between px-4 py-3 rounded-xl border border-[#EEF2F7] bg-[#FAFAFA]">
                  {editingId === o.id ? (
                    <>
                      <input
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit(o.id)}
                        autoFocus
                        className="flex-1 h-9 rounded-lg border border-[#E5E7EB] px-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 mr-2"
                      />
                      <div className="flex items-center gap-1.5">
                        <button type="button" onClick={() => saveEdit(o.id)} className="text-emerald-600 hover:text-emerald-700 transition cursor-pointer">
                          <Check size={16} />
                        </button>
                        <button type="button" onClick={cancelEdit} className="text-[#94A3B8] hover:text-[#64748B] transition cursor-pointer">
                          <X size={16} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-sm text-[#111827]">{o.label}</span>
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => startEdit(o)} className="text-[#94A3B8] hover:text-blue-600 transition cursor-pointer">
                          <Pencil size={15} />
                        </button>
                        <button type="button" onClick={() => deleteOption(o.id, o.label)} className="text-[#94A3B8] hover:text-rose-500 transition cursor-pointer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {options.length === 0 && <p className="text-sm text-[#94A3B8] text-center py-6">No options yet.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}