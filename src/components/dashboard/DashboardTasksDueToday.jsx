import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/Api";

export default function DashboardTasksDueToday() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get("/task/view/")
      .then((res) => {
        const today = new Date().toISOString().slice(0, 10);

        const dueTodayOrPending = res.data.filter(
          (t) => t.dueDate === today && t.status !== "completed"
        );

        setTasks(dueTodayOrPending);
      })
      .catch((err) => console.error("Failed to fetch tasks:", err));
  }, []);

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 h-full">
      <h2 className="text-[20px] font-semibold text-[#111827]">
        Tasks Due Today
      </h2>

      <div className="mt-6 divide-y divide-[#EEF2F7] max-h-[400px] overflow-y-auto">
        {tasks.length === 0 ? (
          <p className="text-sm text-[#64748B] py-4">
            No tasks due today.
          </p>
        ) : (
          tasks.map((t) => (
            <div
              key={t.id}
              className="py-5 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-4 min-w-0">
                <p className="text-sm text-[#111827] truncate">
                  {t.title}
                </p>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <p className="text-sm text-[#64748B]">
                  {t.assignedTo || "—"}
                </p>

                <p className="text-sm text-[#64748B]">
                  {t.dueDate || "—"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-4">
        <button
          type="button"
          onClick={() => navigate("/tasks")}
          className="w-full text-sm text-blue-600 hover:text-blue-700 transition"
        >
          View All Tasks →
        </button>
      </div>
    </div>
  );
}