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
  const [profilePicture, setProfilePicture] = useState(null);
  const [fullName, setFullName] = useState("");

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

  const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    fullName || "User"
  )}&background=e5e7eb&color=6b7280&size=200`;

  const loadUnreadCount = async () => {
    try {
      const res = await api.get("notifications/unread-count/");
      const count =
        typeof res.data === "number"
          ? res.data
          : res.data?.count ?? res.data?.unread_count ?? 0;
      setUnreadCount(Number(count) || 0);
    } catch (err) {
      console.error("Failed to load unread count:", err);
    }
  };

  const loadProfilePicture = async () => {
    try {
      const res = await api.get("profile/view/");
      setProfilePicture(res.data?.profilePicture);
      setFullName(res.data?.fullName || "");
    } catch (err) {
      console.error("Failed to load profile picture:", err);
    }
  };

  useEffect(() => {
    loadUnreadCount();
    loadProfilePicture();

    const handleProfileUpdated = (e) => {
      if (e.detail?.profilePicture) {
        setProfilePicture(e.detail.profilePicture);
      }
      if (e.detail?.fullName) {
        setFullName(e.detail.fullName);
      }
      loadProfilePicture();
    };

    const handleNotificationUpdated = () => {
      loadUnreadCount();
    };

    window.addEventListener("profileUpdated", handleProfileUpdated);
    window.addEventListener("notificationUpdated", handleNotificationUpdated);

    const interval = setInterval(() => {
      loadUnreadCount();
    }, 10000); // check every 10s

    return () => {
      clearInterval(interval);
      window.removeEventListener("profileUpdated", handleProfileUpdated);
      window.removeEventListener("notificationUpdated", handleNotificationUpdated);
    };
  }, []);

  const handleBellClick = async () => {
    const nextState = !dropdownOpen;
    setDropdownOpen(nextState);

    if (nextState) {
      try {
        const res = await api.get("notifications/");
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.notifications)
          ? res.data.notifications
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
        setRecentNotes(list.slice(0, 10));
        loadUnreadCount();
      } catch (err) {
        console.error("Failed to load notifications dropdown:", err);
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

      setRecentNotes((prev) =>
        prev.map((note) => (note.id === id ? { ...note, is_read: true } : note))
      );

      loadUnreadCount();
    } catch (err) {
      // non-critical
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put("notifications/read-all/");

      setUnreadCount(0);
      setRecentNotes((prev) => prev.map((note) => ({ ...note, is_read: true })));
    } catch (err) {
      // non-critical
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
                <span className="absolute top-1 right-2 w-4 h-4 text-[11px] font-semibold bg-red-500 text-white rounded-full flex items-center justify-center">
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
                      onClick={() => !note.is_read && markNotificationRead(note.id)}
                      className={`px-4 py-3 border-b border-gray-100 last:border-0 cursor-pointer transition ${
                        note.is_read
                          ? "bg-white hover:bg-gray-50 opacity-80"
                          : "bg-blue-50/70 hover:bg-blue-100/70"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-800">{note.title}</p>
                        {!note.is_read && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{note.message}</p>
                      {note.created_at && (
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(note.created_at).toLocaleDateString()}
                        </p>
                      )}
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
              src={profilePicture || avatarFallback}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover border border-[#e5e7eb]"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-[#111827]">{fullName || "Admin"}</p>
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}