import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck } from "lucide-react";
import api from "../../api/Api";

const PAGE_SIZE = 15;

export default function NotificationFullView() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all" | "unread" | "read"
  const [page, setPage] = useState(1);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("notifications/");
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markNotificationRead = async (id) => {
    try {
      await api.put(`notifications/${id}/read/`);
      setNotifications((prev) =>
        prev.map((note) =>
          note.id === id ? { ...note, is_read: true } : note
        )
      );
    } catch (err) {
      // non-critical
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put("notifications/read-all/");
      setNotifications((prev) =>
        prev.map((note) => ({ ...note, is_read: true }))
      );
    } catch (err) {
      // non-critical
    }
  };

  const filtered = notifications.filter((note) => {
    if (filter === "unread") return !note.is_read;
    if (filter === "read") return note.is_read;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleFilterChange = (value) => {
    setFilter(value);
    setPage(1);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-black">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "You're all caught up"}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 text-sm text-blue-600 border border-blue-200 rounded-xl px-4 py-2 hover:bg-blue-50 transition"
          >
            <CheckCheck size={16} />
            Mark all read
          </button>
        )}
      </div>

      <div className="bg-white border border-[#dddddd] rounded-xl overflow-hidden">
        {/* Filter tabs */}
        <div className="flex items-center gap-1 px-4 pt-4 border-b border-gray-100">
          {[
            { key: "all", label: "All" },
            { key: "unread", label: "Unread" },
            { key: "read", label: "Read" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleFilterChange(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
                filter === tab.key
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="min-h-[300px]">
          {loading ? (
            <div className="py-16 text-center text-sm text-gray-400">
              Loading notifications...
            </div>
          ) : paginated.length === 0 ? (
            <div className="py-16 flex flex-col items-center text-center text-gray-400">
              <Bell size={28} className="mb-2 text-gray-300" />
              <p className="text-sm">No notifications here</p>
            </div>
          ) : (
            paginated.map((note) => (
              <div
                key={note.id}
                onClick={() => !note.is_read && markNotificationRead(note.id)}
                className={`px-4 py-4 border-b border-gray-50 last:border-0 flex items-start justify-between gap-4 ${
                  note.is_read ? "bg-white" : "bg-blue-50 cursor-pointer hover:bg-blue-100"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                      note.is_read ? "bg-transparent" : "bg-blue-500"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {note.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {note.message}
                    </p>
                  </div>
                </div>

                {note.created_at && (
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="text-xs text-gray-600 disabled:text-gray-300 hover:text-black transition"
            >
              Previous
            </button>
            <span className="text-xs text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="text-xs text-gray-600 disabled:text-gray-300 hover:text-black transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}