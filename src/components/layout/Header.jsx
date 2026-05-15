
import { useLocation } from "react-router-dom";
import { Bell, Menu } from "lucide-react";

export default function Header({ setSidebarOpen }) {
  const location = useLocation();

  const titleByPath = {
    "/": "Dashboard",
    "/leads": "Leads",
    "/deals": "Deals",
    "/customers": "Customers",
    "/tasks": "Tasks",
    "/reports": "Reports",
    "/users": "Users",
    "/settings": "Settings",
  };

  const title = titleByPath[location.pathname] ?? "CRM";

  return (
    <header className="h-20 bg-white border-b border-[#dddddd] px-6 flex items-center justify-between">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="w-11 h-11 rounded-xl border border-gray-200 text-black cursor-pointer flex items-center justify-center hover:bg-blue-50 transition md:hidden"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-xl font-semibold text-black">{title}</h1>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Notification */}
        <button className="relative w-11 h-11 rounded-xl border border-[#dddddd] flex items-center justify-center text-black hover:bg-blue-50 transition">
          <Bell size={20} />

          <span className="absolute top-2 right-2 w-5 h-5 text-[11px] font-semibold bg-red-500 text-white rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 cursor-pointer">
          <img
            src="https://i.pravatar.cc/100?img=12"
            alt="profile"
            className="w-10 h-10 rounded-full object-cover border border-[#e5e7eb]"
          />

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-[#111827]">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
