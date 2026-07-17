import React from "react";
import { Filter, Download, FileText } from "lucide-react";

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export default function BillingHistory() {
  const invoices = [
    { date: "Oct 12, 2023", id: "#INV-2023-001", amount: "$12,450.00", status: "Paid" },
    { date: "Sep 12, 2023", id: "#INV-2023-089", amount: "$12,450.00", status: "Paid" },
    { date: "Aug 12, 2023", id: "#INV-2023-042", amount: "$12,450.00", status: "Pending" },
    { date: "Jul 12, 2023", id: "#INV-2023-012", amount: "$12,450.00", status: "Paid" },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Billing History</h3>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50">
            <Filter className="w-3.5 h-3.5" />
            Filters
          </button>
          <button className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50">
            <Download className="w-3.5 h-3.5" />
            Export All
          </button>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
            <th className="pb-2 font-medium">Date</th>
            <th className="pb-2 font-medium">Invoice ID</th>
            <th className="pb-2 font-medium">Amount</th>
            <th className="pb-2 font-medium">Status</th>
            <th className="pb-2 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv, i) => (
            <tr key={i} className="border-b border-gray-50 last:border-0">
              <td className="py-3 text-gray-700">{inv.date}</td>
              <td className="py-3 text-gray-700">{inv.id}</td>
              <td className="py-3 text-gray-700">{inv.amount}</td>
              <td className="py-3">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    inv.status === "Paid" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      inv.status === "Paid" ? "bg-green-500" : "bg-orange-500"
                    }`}
                  />
                  {inv.status}
                </span>
              </td>
              <td className="py-3">
                <button className="flex items-center gap-1 text-blue-600 text-sm hover:text-blue-700">
                  <FileText className="w-3.5 h-3.5" />
                  PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between mt-4">
        <p className="text-xs text-gray-400">Showing 4 of 24 invoices</p>
        <div className="flex gap-2">
          <button className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50">Previous</button>
          <button className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50">Next</button>
        </div>
      </div>
    </Card>
  );
}