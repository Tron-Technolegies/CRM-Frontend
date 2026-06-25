import { Link } from "react-router-dom";
import { Bell, ChevronRight, CreditCard, Database, Globe, Lock, User } from "lucide-react";

const sections = [
  {
    title: "Profile",
    description: "Update your personal information and profile settings.",
    icon: User,
    path: "/settings/profile",
  },
  {
    title: "Notifications",
    description: "Manage your email and in-app notifications.",
    icon: Bell,
    path: "/settings/notifications",
  },
  {
    title: "Security",
    description: "Change your password and manage security settings.",
    icon: Lock,
    path: "/settings/security",
  },
  {
    title: "Preferences",
    description: "Set your language, timezone, and other preferences.",
    icon: Globe,
    path: "/settings/preferences",
  },
  {
    title: "Billing",
    description: "View your subscription and billing details.",
    icon: CreditCard,
    path: "/settings/billing",
  },
  {
    title: "Data & Privacy",
    description: "Manage your data and privacy preferences.",
    icon: Database,
    path: "/settings/data-privacy",
  },
];

export default function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-[28px] font-semibold text-[#111827]">Settings</h1>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
        {sections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.title}
              to={section.path}
              className={`flex items-center gap-4 p-5 hover:bg-[#FAFAFA] transition cursor-pointer ${
                idx !== sections.length - 1 ? "border-b border-[#EEF2F7]" : ""
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Icon size={20} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#111827]">{section.title}</p>
                <p className="text-sm text-[#64748B] mt-0.5">{section.description}</p>
              </div>

              <ChevronRight size={18} className="text-[#94A3B8] ml-auto shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}