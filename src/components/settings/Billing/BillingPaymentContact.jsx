import React from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Building2, Pencil } from "lucide-react";

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export default function BillingPaymentContact() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Payment Methods */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Payment Methods</h3>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">+ Add New</button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between border border-blue-200 bg-blue-50/40 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 rounded bg-blue-600 text-white text-[11px] font-bold">VISA</span>
              <div>
                <p className="text-sm font-medium text-gray-900">Visa ending in 4242</p>
                <p className="text-xs text-gray-400">Expires 12/2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700">PRIMARY</span>
              <Trash2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500" />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg p-3">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 rounded bg-gray-800 text-white text-[11px] font-bold">MC</span>
              <div>
                <p className="text-sm font-medium text-gray-900">Mastercard ending in 8891</p>
                <p className="text-xs text-gray-400">Expires 08/2025</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-xs font-medium text-blue-600 hover:text-blue-700">Set Primary</button>
              <Trash2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500" />
            </div>
          </div>
        </div>
      </Card>

      {/* Billing Contact summary */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Billing Contact</h3>
          <button
            onClick={() => navigate("/settings/billing-contact")}
            className="text-gray-400 hover:text-gray-600"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-gray-400 uppercase">Billing Email</p>
              <p className="text-sm text-gray-900 mt-0.5">finance@techglobal.corp</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-gray-400 uppercase">Billing Address</p>
              <p className="text-sm text-gray-900 mt-0.5">
                742 Evergreen Terrace,<br />
                Springfield, OR 97403,<br />
                United States
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}