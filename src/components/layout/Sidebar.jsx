import React from "react";
import {
  LayoutDashboard,
  Users,
  GitBranch,
  Activity,
  UserRound,
  Ticket,
  BarChart3,
  Bot,
  Settings,
  LogOut,
  Box,
} from "lucide-react";

import { NavLink } from "react-router-dom";

export default function Sidebar({ sidebarOpen }) {
  const menuSections = [
    {
      title: "MAIN",
      menus: [
        {
          name: "Dashboard",
          icon: <LayoutDashboard size={18} />,
          path: "/",
        },
        {
          name: "Leads",
          icon: <Users size={18} />,
          path: "/leads",
          count: 12,
        },
        {
          name: "Pipeline",
          icon: <GitBranch size={18} />,
          path: "/pipeline",
        },
        {
          name: "Activities",
          icon: <Activity size={18} />,
          path: "/activities",
        },
      ],
    },

    {
      title: "MANAGEMENT",
      menus: [
        {
          name: "Customers",
          icon: <UserRound size={18} />,
          path: "/customers",
        },
        {
          name: "Support Tickets",
          icon: <Ticket size={18} />,
          path: "/support-tickets",
        },
        {
          name: "Reports",
          icon: <BarChart3 size={18} />,
          path: "/reports",
        },
      ],
    },

    {
      title: "SYSTEM",
      menus: [
        {
          name: "Automations",
          icon: <Bot size={18} />,
          path: "/automations",
        },
        {
          name: "Settings",
          icon: <Settings size={18} />,
          path: "/settings",
        },
      ],
    },
  ];

  return (
    <aside
      className={`${
        sidebarOpen ? "w-[260px]" : "w-24"
      } duration-300 bg-[#F8FAFC] border-r border-[#E2E8F0] flex flex-col h-screen`}
    >
      {/* LOGO */}
      <div className="h-20 border-b border-[#E2E8F0] flex items-center px-6">
        <div className="w-11 h-11 rounded-xl bg-[#2563EB] flex items-center justify-center">
          <Box size={22} className="text-white" />
        </div>

        {sidebarOpen && (
          <div className="ml-3">
            <h1 className="text-[24px] font-bold text-[#0F172A]">CRM</h1>
          </div>
        )}
      </div>

      {/* MENU */}
      <div className="flex-1 overflow-y-auto overflow-y-hidden px-4 py-6">
        {menuSections.map((section, index) => (
          <div key={index} className="mb-8">
            {sidebarOpen && (
              <p className="text-xs font-semibold tracking-[2px] text-[#94A3B8] mb-3 px-3">
                {section.title}
              </p>
            )}

            <div className="space-y-1">
              {section.menus.map((item, idx) => (
                <NavLink
                  key={idx}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 group
                     
                     ${
                       isActive
                         ? "bg-[#E8F0FF] text-[#2563EB]"
                         : "text-[#0F172A] hover:bg-[#EFF6FF]"
                     }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <div>{item.icon}</div>

                    {sidebarOpen && <span className="font-medium text-[15px]">{item.name}</span>}
                  </div>

                  {sidebarOpen && item.count && (
                    <span className="text-xs font-semibold text-[#0F172A]">{item.count}</span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* PROFILE + LOGOUT */}
      <div className="border-t border-[#E2E8F0] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/100?img=12"
              alt="profile"
              className="w-11 h-11 rounded-full object-cover"
            />

            {sidebarOpen && (
              <div>
                <h3 className="text-sm font-semibold text-[#0F172A]">Sarah Jenkins</h3>
                <p className="text-xs text-[#64748B]">Manager</p>
              </div>
            )}
          </div>

          {sidebarOpen && (
            <button className="text-[#64748B] hover:text-red-500 transition">
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
