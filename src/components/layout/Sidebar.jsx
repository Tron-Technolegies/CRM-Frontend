import {
  LayoutDashboard,
  Users,
  UserRound,
  BarChart3,
  Settings,
  Tag,
  NotepadText,
  Handbag,
  LogOut,
  Package,
  Box,
  Handshake,
  ClipboardList,
  User,
  Building2,
  FileText,
  CalendarDays,
  Phone,
  ChevronDown,
  Store,
  Wrench
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";


export default function Sidebar({ sidebarOpen }) {
  const navigate = useNavigate();

  const [inventoryOpen, setInventoryOpen] = useState(false);

  const menus = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/" },

    { name: "Leads", icon: <Users size={18} />, path: "/leads" },

    { name: "Customers", icon: <UserRound size={18} />, path: "/customers" },

    { name: "Accounts", icon: <Building2 size={18} />, path: "/accounts" },

    { name: "Deals", icon: <Handshake size={18} />, path: "/deals" },

    { name: "Quotes", icon: <FileText size={18} />, path: "/quotes" },

    {
      name: "Inventory",
      icon: <Package size={18} />,
      dropdown: true,
      children: [
        {
          icon: <Store size={18} />,
          name: "Vendor",
          path: "/inventory/vendor"
        },
        {
          icon: <Handbag size={18} />,
          name: "Products",
          path: "/inventory/products"
        },
        {
          icon: <Wrench size={18} />,
          name: "Service",
          path: "/inventory/service"
        },
        {
          icon: <Tag size={18} />,
          name: "Sales",
          path: "/inventory/salesOrder"
        },
        {
          icon: <Tag size={18} />,
          name: "Purchase",
          path: "/inventory/purchase"
        },
        {
          icon: <NotepadText size={18} />,
          name: "Invoices",
          path: "/inventory/invoices"
        },
      ]
    },

    { name: "Tasks", icon: <ClipboardList size={18} />, path: "/tasks" },

    { name: "Meetings", icon: <CalendarDays size={18} />, path: "/meetings" },

    { name: "Calls", icon: <Phone size={18} />, path: "/calls" },

    { name: "Reports", icon: <BarChart3 size={18} />, path: "/reports" },

    { name: "Users", icon: <User size={18} />, path: "/users" },

    { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
  ];

  const handleLogout = () => {

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    navigate("/login");

  };


  return (
    <aside
      className={`${sidebarOpen ? "w-[260px]" : "w-24"}
      duration-300 bg-[#F8FAFC] border-r border-[#E2E8F0]
      flex flex-col h-screen`}
    >


      {/* LOGO */}
      <div className="h-20 border-b border-[#E2E8F0] flex items-center px-6">

        <div className="w-11 h-11 rounded-xl bg-[#2563EB] flex items-center justify-center">
          <Box size={22} className="text-white" />
        </div>


        {sidebarOpen && (
          <div className="ml-3">
            <h1 className="text-[24px] font-bold text-[#0F172A]">
              CRM
            </h1>
          </div>
        )}

      </div>



      {/* MENU */}
      <div className="flex-1 overflow-y-auto px-4 py-6">

        <div className="space-y-1">


          {menus.map((item) => (

            item.dropdown ? (

              <div key={item.name}>


                {/* Inventory Button */}
                <button
                  onClick={() => setInventoryOpen(!inventoryOpen)}
                  className="flex items-center gap-3 w-full px-3 py-3 rounded-xl
                  text-[#0F172A] hover:bg-[#EFF6FF] transition"
                >

                  <div className="w-6 flex items-center justify-center">
                    {item.icon}
                  </div>


                  {sidebarOpen && (
                    <>
                      <span className="font-medium text-[15px] flex-1 text-left">
                        {item.name}
                      </span>

                      <ChevronDown
                        size={16}
                        className={`transition-transform ${inventoryOpen ? "rotate-180" : ""
                          }`}
                      />
                    </>
                  )}

                </button>

                {/* Dropdown Items */}
                {inventoryOpen && sidebarOpen && (

                  <div className="ml-8 mt-2 space-y-1">

                    {item.children.map((child) => (

                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
                          ${isActive
                            ? "bg-[#E8F0FF] text-[#2563EB]"
                            : "text-[#0F172A] hover:bg-[#EFF6FF]"
                          }`
                        }
                      >

                        <div className="w-5 flex items-center justify-center">
                          {child.icon}
                        </div>

                        <span className="font-medium">
                          {child.name}
                        </span>

                      </NavLink>

                    ))}

                  </div>

                )}

              </div>


            ) : (


              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                  ${isActive
                    ? "bg-[#E8F0FF] text-[#2563EB]"
                    : "text-[#0F172A] hover:bg-[#EFF6FF]"
                  }`
                }
              >

                <div className="w-6 flex items-center justify-center">
                  {item.icon}
                </div>


                {sidebarOpen && (
                  <span className="font-medium text-[15px]">
                    {item.name}
                  </span>
                )}

              </NavLink>


            )

          ))}


        </div>

      </div>




      {/* LOGOUT */}
      <div className="border-t border-[#E2E8F0] p-4">

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl
          text-[#0F172A] hover:bg-[#EFF6FF] transition"
        >

          <div className="w-6 flex items-center justify-center">
            <LogOut size={18} />
          </div>


          {sidebarOpen && (
            <span className="font-medium text-[15px]">
              Logout
            </span>
          )}

        </button>

      </div>


    </aside>
  );
}