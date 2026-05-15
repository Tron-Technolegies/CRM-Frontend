import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function HomeLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-[#F7F8FA] overflow-hidden">
      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 md:static md:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          transition-transform duration-300
        `}
      >
        <Sidebar sidebarOpen={sidebarOpen} />
      </div>

      {/* Backdrop (mobile) */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Pages Render Here */}
        <main className="flex-1 overflow-y-auto bg-[#F7F8FA] p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
