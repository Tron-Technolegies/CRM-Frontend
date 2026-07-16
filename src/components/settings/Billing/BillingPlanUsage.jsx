import React from "react";
import { CheckCircle2, Users, Cloud, Zap } from "lucide-react";

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function ProgressBar({ value, colorClass }) {
  return (
    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
      <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export default function BillingPlanUsage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Current Plan */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-blue-50 text-blue-600 uppercase">
            Current Plan
          </span>
          <CheckCircle2 className="w-5 h-5 text-blue-500" />
        </div>
        <h2 className="mt-3 text-xl font-semibold text-gray-900">Enterprise Plan</h2>
        <p className="text-sm text-gray-500 mt-1">Scale your business with full capabilities</p>
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Renewal Date</span>
            <span className="font-medium text-gray-900">Oct 12, 2024</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Billing Cycle</span>
            <span className="font-medium text-gray-900">Yearly (20% Discount)</span>
          </div>
        </div>
      </Card>

      {/* Usage Metrics */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-gray-900">Usage Metrics</h3>
          <span className="text-xs text-gray-400">Usage resets in 14 days</span>
        </div>
        <div className="mt-5 space-y-5">
          <div>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="flex items-center gap-1.5 text-gray-600">
                <Users className="w-4 h-4 text-gray-400" />
                Seats Used
              </span>
              <span className="font-medium text-gray-900">42/50</span>
            </div>
            <ProgressBar value={84} colorClass="bg-blue-500" />
            <p className="text-xs text-gray-400 mt-1">8 seats remaining</p>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="flex items-center gap-1.5 text-gray-600">
                <Cloud className="w-4 h-4 text-gray-400" />
                Storage
              </span>
              <span className="font-medium text-gray-900">756 GB / 1 TB</span>
            </div>
            <ProgressBar value={75.6} colorClass="bg-indigo-500" />
            <p className="text-xs text-gray-400 mt-1">244 GB remaining</p>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="flex items-center gap-1.5 text-gray-600">
                <Zap className="w-4 h-4 text-gray-400" />
                API Calls
              </span>
              <span className="font-medium text-gray-900">1.2M / 2M</span>
            </div>
            <ProgressBar value={60} colorClass="bg-gray-400" />
            <p className="text-xs text-gray-400 mt-1">Monthly quota: 2,000,000</p>
          </div>
        </div>
      </Card>
    </div>
  );
}