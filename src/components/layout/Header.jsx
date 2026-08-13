import { useLocation, useNavigate, Link } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import api from "../../api/Api";

export default function Header({ setSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [recentNotes, setRecentNotes] = useState([]);

  const dropdownRef = useRef(null);

  const titleByPath = {
    "/": "Dashboard",
    "/leads": "Leads",
    "/deals": "Deals",
    "/customers": "Customers",
    "/tasks": "Tasks",
    "/reports": "Reports",
    "/meetings": "Meetings",
    "/users": "Users",
    "/calls": "Calls",
    "/quotes": "Quotes",
    "/settings": "Settings",
  };

  const title = titleByPath[location.pathname] ?? "CRM";

  const loadUnreadCount = async () => {
    try {
      const res = await api.get("notifications/unread-count/");
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error("Failed to load unread count:", err);
    }
  };

  useEffect(() => {
    loadUnreadCount();

    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000); // check every 30s

    return () => clearInterval(interval);
  }, []);

  const handleBellClick = async () => {
    const nextState = !dropdownOpen;
    setDropdownOpen(nextState);

    if (nextState) {
      try {
        const res = await api.get("notifications/");
        setRecentNotes(res.data.filter((note) => !note.is_read));
        loadUnreadCount();
      } catch (err) {
        // silent fail, dropdown just shows empty state
      }
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const markNotificationRead = async (id) => {
    try {
      await api.put(`notifications/${id}/read/`);

      setRecentNotes((prev) => prev.filter((note) => note.id !== id));

      loadUnreadCount();
    } catch (err) {
      // non-critical, list already reflects optimistic state where relevant
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put("notifications/read-all/");

      setUnreadCount(0);
      setRecentNotes([]);
    } catch (err) {
      // non-critical, badge already cleared optimistically
    }
  };

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
        {/* Notification bell — standalone, not nested inside the profile link */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleBellClick}
            className="relative w-11 h-11 rounded-xl border border-[#dddddd] flex items-center justify-center text-black hover:bg-blue-50 transition"
          >
            <Bell size={20} />

            {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-5 h-5 text-[11px] font-semibold bg-red-500 text-white rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                </span>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">Notifications</p>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {recentNotes.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-gray-400 text-center">
                    No notifications yet
                  </p>
                ) : (
                  recentNotes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => markNotificationRead(note.id)}
                      className="px-4 py-3 border-b border-gray-50 last:border-0 cursor-pointer bg-blue-50 hover:bg-blue-100"
                    >
                      <p className="text-sm font-medium text-gray-800">{note.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{note.message}</p>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/notifications");
                }}
                className="w-full text-center text-xs text-blue-600 py-2 border-t border-gray-100 hover:bg-gray-50"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>

        {/* Profile — its own link, separate from the bell */}
        <Link to="/settings/profile">
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
        </Link>
      </div>
    </header>
  );
}