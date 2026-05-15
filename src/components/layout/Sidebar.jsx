
import {
  LayoutDashboard,
  Users,
  UserRound,
  BarChart3,
  Settings,
  LogOut,
  Box,
  Handshake,
  ClipboardList,
  User,
} from "lucide-react";

import { NavLink } from "react-router-dom";

export default function Sidebar({ sidebarOpen }) {
  const menus = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/" },
    { name: "Leads", icon: <Users size={18} />, path: "/leads" },
    { name: "Deals", icon: <Handshake size={18} />, path: "/deals" },
    { name: "Customers", icon: <UserRound size={18} />, path: "/customers" },
    { name: "Tasks", icon: <ClipboardList size={18} />, path: "/tasks" },
    { name: "Reports", icon: <BarChart3 size={18} />, path: "/reports" },
    { name: "Users", icon: <User size={18} />, path: "/users" },
    { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
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
        <div className="space-y-1">
          {menus.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                ${
                  isActive ? "bg-[#E8F0FF] text-[#2563EB]" : "text-[#0F172A] hover:bg-[#EFF6FF]"
                }`
              }
            >
              <div className="w-6 flex items-center justify-center">{item.icon}</div>
              {sidebarOpen && <span className="font-medium text-[15px]">{item.name}</span>}
            </NavLink>
          ))}
        </div>
      </div>

      {/* LOGOUT */}
      <div className="border-t border-[#E2E8F0] p-4">
        <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[#0F172A] hover:bg-[#EFF6FF] transition">
          <div className="w-6 flex items-center justify-center">
            <LogOut size={18} />
          </div>
          {sidebarOpen && <span className="font-medium text-[15px]">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
