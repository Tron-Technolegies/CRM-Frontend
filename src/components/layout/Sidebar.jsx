// import React from "react";
// import {
//   LayoutDashboard,
//   Users,
//   ShoppingCart,
//   Settings,
//   Bell,
//   LogOut,
//   Package,
// } from "lucide-react";
// import { NavLink } from "react-router-dom";

// export default function Sidebar({ sidebarOpen }) {
//   const menuItems = [
//     {
//       name: "Dashboard",
//       icon: <LayoutDashboard size={20} />,
//       path: "/",
//     },
//     {
//       name: "Users",
//       icon: <Users size={20} />,
//       path: "/users",
//     },
//     {
//       name: "Orders",
//       icon: <ShoppingCart size={20} />,
//       path: "/orders",
//     },
//     {
//       name: "Products",
//       icon: <Package size={20} />,
//       path: "/products",
//     },
//     {
//       name: "Notifications",
//       icon: <Bell size={20} />,
//       path: "/notifications",
//     },
//     {
//       name: "Settings",
//       icon: <Settings size={20} />,
//       path: "/settings",
//     },
//   ];

//   return (
//     <aside
//       className={`${
//         sidebarOpen ? "w-72" : "w-20"
//       } duration-300 bg-[#020617] border-r border-[#1e293b] flex flex-col`}
//     >
//       {/* Logo */}
//       <div className="h-20 border-b border-[#1e293b] flex items-center px-6">
//         <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-xl font-bold">
//           T
//         </div>

//         {sidebarOpen && (
//           <div className="ml-3">
//             <h1 className="text-lg font-semibold">Tron Admin</h1>
//             <p className="text-xs text-gray-400">Dashboard Panel</p>
//           </div>
//         )}
//       </div>

//       {/* Menus */}
//       <div className="flex-1 px-4 py-5 space-y-2">
//         {menuItems.map((item, index) => (
//           <NavLink
//             key={index}
//             to={item.path}
//             className={({ isActive }) =>
//               `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 border

//               ${
//                 isActive
//                   ? "bg-blue-600 border-blue-500 text-white shadow-lg"
//                   : "border-transparent hover:bg-[#0f172a] hover:border-[#334155] text-gray-300"
//               }`
//             }
//           >
//             {item.icon}

//             {sidebarOpen && <span className="font-medium">{item.name}</span>}
//           </NavLink>
//         ))}
//       </div>

//       {/* Logout */}
//       <div className="p-4 border-t border-[#1e293b]">
//         <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 border border-transparent hover:bg-red-500/10 hover:border-red-500/30 transition-all">
//           <LogOut size={20} />

//           {sidebarOpen && <span>Logout</span>}
//         </button>
//       </div>
//     </aside>
//   );
// }

import React from "react";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Settings,
  Bell,
  LogOut,
  Package,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ sidebarOpen }) {
  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/",
    },
    {
      name: "Leads",
      icon: <Users size={20} />,
      path: "/users",
    },
    {
      name: "Pipeline",
      icon: <ShoppingCart size={20} />,
      path: "/orders",
    },
    {
      name: "Activities",
      icon: <Package size={20} />,
      path: "/products",
    },
    {
      name: "Customers",
      icon: <Bell size={20} />,
      path: "/notifications",
    },
    {
      name: "Support Tickets",
      icon: <Settings size={20} />,
      path: "/settings",
    },
    {
      name: "Reports",
      icon: <Settings size={20} />,
      path: "/settings",
    },
    {
      name: "Automation",
      icon: <Settings size={20} />,
      path: "/settings",
    },
    {
      name: "Settings",
      icon: <Settings size={20} />,
      path: "/settings",
    },
  ];

  return (
    <div
      className={`${
        sidebarOpen ? "w-72" : "w-20"
      } duration-300  bg-[#F1F5F9] flex flex-col border-r border-gray-200`}
    >
      <div className="h-20 flex items-center px-6 border border-gray-200">
        <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-xl font-bold">
          C
        </div>
        {sidebarOpen && (
          <div className="ml-3">
            <h1 className="text-lg text-black font-semibold">CRM</h1>
            <p className="text-xs text-gray-400">Dashboard Panel</p>
          </div>
        )}
      </div>

      <div className="flex-1 px-4 py-5 space-y-2">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 border

              ${
                isActive
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg"
                  : "border-transparent hover:bg-[#b9d1f3] hover:border-gray-200 text-[#0F1724]"
              }`
            }
          >
            {item.icon}

            {sidebarOpen && <span className="font-medium">{item.name}</span>}
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 border border-transparent hover:bg-red-500/10 hover:border-red-500/30 transition-all">
          <LogOut size={20} />

          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
