import React from "react";
import BillingPlanUsage from "./BillingPlanUsage";
import BillingPaymentContact from "./BillingPaymentContact";
import BillingHistory from "./BillingHistory";

export default function Billing() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] p-8 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Billing</h1>

        <BillingPlanUsage />
        <BillingPaymentContact />
        <BillingHistory />
      </div>
    </div>
  );
}