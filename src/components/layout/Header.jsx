// src/components/Header.jsx

import React from "react";
import { Menu, Search, Bell } from "lucide-react";

export default function Header({ setSidebarOpen }) {
  return (
    <header className="h-20 bg-white border-b border-[#dddddd] px-6 flex items-center justify-between">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="w-11 h-11 rounded-xl border border-gray-200 text-black cursor-pointer flex items-center justify-center hover:bg-blue-50 transition"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-xl font-semibold text-black">Dashboard</h1>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center border border-gray-200 rounded-xl px-4 h-11 w-72">
          <Search size={18} className="text-black" />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none px-3 text-black text-sm w-full"
          />
        </div>

        {/* Notification */}
        <button className="relative w-11 h-11 rounded-xl border border-[#dddddd] flex items-center justify-center text-black hover:bg-blue-50 transition">
          <Bell size={20} />

          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3  border border-[#dddddd] rounded-xl px-3 py-2">
          <img
            src="https://i.pravatar.cc/100"
            alt="profile"
            className="w-10 h-10 rounded-full object-cover border border-[#334155] "
          />

          <div className="hidden md:block">
            <h3 className="text-sm font-semibold text-black">Admin</h3>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
