import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import DealsKpis from "../components/deals/DealsKpis";
import DealsList from "../components/deals/DealsList";
import DealFormModal from "../components/deals/DealFormModal";
import { useToast } from "../components/ui/toastContext.js";

const initialDeals = [
  {
    id: 1,
    name: "Website Redesign",
    customer: "ABC Solutions",
    stage: "Proposal",
    value: 15000,
    expectedCloseDate: "2025-05-25",
    assignedTo: "Mark Brown",
    status: "Open",
  },
  {
    id: 2,
    name: "CRM Implementation",
    customer: "XYZ Ltd",
    stage: "Negotiation",
    value: 35000,
    expectedCloseDate: "2025-05-30",
    assignedTo: "Sarah Wilson",
    status: "Open",
  },
  {
    id: 3,
    name: "Mobile App Development",
    customer: "TechCorp",
    stage: "Proposal",
    value: 22000,
    expectedCloseDate: "2025-06-05",
    assignedTo: "David Lee",
    status: "Open",
  },
  {
    id: 4,
    name: "Digital Marketing",
    customer: "Green Earth",
    stage: "Discussion",
    value: 8000,
    expectedCloseDate: "2025-05-20",
    assignedTo: "Mark Brown",
    status: "Open",
  },
  {
    id: 5,
    name: "SEO Services",
    customer: "Bright Ideas",
    stage: "Won",
    value: 12000,
    expectedCloseDate: "2025-05-15",
    assignedTo: "Sarah Wilson",
    status: "Won",
  },
  {
    id: 6,
    name: "Cloud Migration",
    customer: "InnovateX",
    stage: "Won",
    value: 45000,
    expectedCloseDate: "2025-05-10",
    assignedTo: "David Lee",
    status: "Won",
  },
  {
    id: 7,
    name: "UI/UX Design",
    customer: "Pixel Perfect",
    stage: "Lost",
    value: 6000,
    expectedCloseDate: "2025-05-12",
    assignedTo: "Mark Brown",
    status: "Lost",
  },
  {
    id: 8,
    name: "IT Support Services",
    customer: "Global Tech",
    stage: "Lost",
    value: 9000,
    expectedCloseDate: "2025-05-08",
    assignedTo: "Sarah Wilson",
    status: "Lost",
  },
];

export default function Deals() {
  const { pushToast } = useToast();
  const [deals, setDeals] = useState(initialDeals);

  const [addOpen, setAddOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const nextId = useMemo(() => Math.max(0, ...deals.map((d) => d.id)) + 1, [deals]);

  const addDeal = async (form) => {
    setAddLoading(true);
    await new Promise((r) => window.setTimeout(r, 700));

    const newDeal = {
      id: nextId,
      name: form.dealName.trim(),
      customer: form.companyName.trim(),
      stage: form.stage,
      value: Number(form.dealAmount || 0),
      expectedCloseDate: form.expectedCloseDate,
      assignedTo: form.assignedTo,
      status: "Open",
    };

    setDeals((prev) => [newDeal, ...prev]);
    setAddLoading(false);
    setAddOpen(false);
    pushToast({ title: "Deal created", message: `${newDeal.name} added successfully`, variant: "success" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-[#111827]">Deals</h1>

        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium flex items-center gap-2 cursor-pointer"
        >
          <Plus size={18} />
          Add Deal
        </button>
      </div>

      <DealsKpis />
      <DealsList deals={deals} />

      <DealFormModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={addDeal} loading={addLoading} />
    </div>
  );
}
