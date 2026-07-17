import React from "react";
import { useNavigate } from "react-router-dom";
import { Mail, MapPin, Building2, Save } from "lucide-react";

/* ---------------------------------------------------------
   Shared bits
--------------------------------------------------------- */

function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function Field({ label, children, helper }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {children}
      {helper && <p className="text-xs text-gray-400 mt-1">{helper}</p>}
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
    />
  );
}

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-blue-600" />
      </div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
  );
}

/* ---------------------------------------------------------
   BILLING CONTACT EDIT PAGE
--------------------------------------------------------- */

export default function BillingContact() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F7F8FA] p-8 font-sans text-gray-900">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Billing Contact
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Update the contact details and tax information for your
            enterprise invoices.
          </p>
        </div>

        {/* Contact Information */}
        <Card className="p-6">
          <SectionHeader icon={Mail} title="Contact Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Billing Email" helper="Invoices will be sent to this address.">
              <Input type="email" defaultValue="accounts@acmecorp.io" />
            </Field>
            <Field label="Billing Phone">
              <Input type="text" defaultValue="+1 (555) 902-4422" />
            </Field>
          </div>
        </Card>

        {/* Registered Address */}
        <Card className="p-6">
          <SectionHeader icon={MapPin} title="Registered Address" />
          <div className="space-y-4">
            <Field label="Street Address">
              <Input type="text" defaultValue="128 Business Center Way" />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="City">
                <Input type="text" defaultValue="San Francisco" />
              </Field>
              <Field label="State/Province">
                <Input type="text" defaultValue="CA" />
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="ZIP/Postal Code">
                <Input type="text" defaultValue="94105" />
              </Field>
              <Field label="Country">
                <select className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400">
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                </select>
              </Field>
            </div>
          </div>
        </Card>

        {/* Tax Information */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">
              Tax Information{" "}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="VAT/GST Number">
              <Input type="text" defaultValue="GB123456789" />
            </Field>
            <Field label="Tax ID">
              <Input type="text" defaultValue="94-2233110" />
            </Field>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate("/settings/billing")}
            className="text-sm font-medium text-gray-600 border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => navigate("/settings/billing")}
            className="flex items-center gap-2 text-sm font-medium text-white bg-blue-600 rounded-lg px-4 py-2 hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}  