

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import CustomersKpis from "../components/customers/CustomersKpis";
import CustomersList from "../components/customers/CustomersList";
import CustomerFormModal from "../components/customers/CustomerFormModal";
import { useToast } from "../components/ui/toastContext.js";

const initialCustomers = [
  {
    id: 1,
    companyName: "ABC Solutions",
    contactName: "John Smith",
    email: "john@abcsolutions.com",
    phone: "+1 555-123-4567",
    industry: "Technology",
    status: "Active",
    lifetimeValue: 45000,
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    companyName: "XYZ Ltd",
    contactName: "Sarah Johnson",
    email: "sarah@xyzltd.com",
    phone: "+1 555-678-9012",
    industry: "Finance",
    status: "Active",
    lifetimeValue: 128000,
    joinDate: "2023-03-22",
  },
  {
    id: 3,
    companyName: "TechCorp",
    contactName: "David Lee",
    email: "david@techcorp.com",
    phone: "+1 555-345-6789",
    industry: "Technology",
    status: "Active",
    lifetimeValue: 250000,
    joinDate: "2022-11-05",
  },
  {
    id: 4,
    companyName: "Green Earth",
    contactName: "Emily Davis",
    email: "emily@greenearth.org",
    phone: "+1 555-456-7890",
    industry: "Nonprofit",
    status: "Active",
    lifetimeValue: 12000,
    joinDate: "2024-07-18",
  },
  {
    id: 5,
    companyName: "Bright Ideas",
    contactName: "Michael Brown",
    email: "michael@brightideas.co",
    phone: "+1 555-567-8901",
    industry: "Marketing",
    status: "Active",
    lifetimeValue: 34500,
    joinDate: "2023-09-30",
  },
  {
    id: 6,
    companyName: "InnovateX",
    contactName: "Jessica Wilson",
    email: "jessica@innovatex.io",
    phone: "+1 555-890-1234",
    industry: "Technology",
    status: "Active",
    lifetimeValue: 185000,
    joinDate: "2023-02-14",
  },
  {
    id: 7,
    companyName: "Pixel Perfect",
    contactName: "Chris Martin",
    email: "chris@pixelperfect.design",
    phone: "+1 555-789-0123",
    industry: "Design",
    status: "Active",
    lifetimeValue: 28000,
    joinDate: "2024-08-25",
  },
  {
    id: 8,
    companyName: "Global Tech",
    contactName: "Laura Taylor",
    email: "laura@globaltech.inc",
    phone: "+1 555-890-1234",
    industry: "Software",
    status: "Churned",
    lifetimeValue: 9500,
    joinDate: "2024-04-10",
  },
];

export default function Customers() {
  const { pushToast } = useToast();
  const [customers, setCustomers] = useState(initialCustomers);

  const [addOpen, setAddOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const nextId = useMemo(() => Math.max(0, ...customers.map((c) => c.id)) + 1, [customers]);

  const addCustomer = async (form) => {
    setAddLoading(true);
    await new Promise((r) => window.setTimeout(r, 700));

    const newCustomer = {
      id: nextId,
      companyName: form.companyName.trim(),
      contactName: form.contactName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      industry: form.industry,
      status: form.status,
      lifetimeValue: Number(form.lifetimeValue || 0),
      joinDate: form.joinDate || new Date().toISOString().slice(0, 10),
    };

    setCustomers((prev) => [newCustomer, ...prev]);
    setAddLoading(false);
    setAddOpen(false);
    pushToast({
      title: "Customer created",
      message: `${newCustomer.companyName} added successfully`,
      variant: "success",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-[#111827]">Customers</h1>

        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium flex items-center gap-2 cursor-pointer"
        >
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      <CustomersKpis />
      <CustomersList customers={customers} />

      <CustomerFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={addCustomer}
        loading={addLoading}
      />
    </div>
  );
}
