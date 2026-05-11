// src/layouts/HomeLayout.jsx

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function HomeLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-[#F7F8FA] text-white overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto bg-[#F7F8FA] p-6">{children}</main>
      </div>
    </div>
  );
}
