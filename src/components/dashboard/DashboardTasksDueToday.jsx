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
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 h-full flex flex-col justify-between">
      <div>
        <h2 className="text-lg sm:text-[20px] font-semibold text-[#111827]">
          Tasks Due Today
        </h2>

        <div className="mt-4 sm:mt-6 divide-y divide-[#EEF2F7] max-h-[400px] overflow-y-auto">
          {tasks.length === 0 ? (
            <p className="text-sm text-[#64748B] py-4">
              No tasks due today.
            </p>
          ) : (
            tasks.map((t) => (
              <div
                key={t.id}
                className="py-3 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#111827] truncate">
                    {t.title}
                  </p>
                </div>

                <div className="flex items-center gap-3 sm:gap-6 shrink-0 text-xs sm:text-sm text-[#64748B]">
                  <span className="truncate max-w-[120px]">{t.assignedTo || "—"}</span>
                  <span>{t.dueDate || "—"}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-[#EEF2F7] sm:border-0 mt-2">
        <button
          type="button"
          onClick={() => navigate("/tasks")}
          className="w-full text-sm text-blue-600 hover:text-blue-700 transition cursor-pointer text-center font-medium"
        >
          View All Tasks →
        </button>
      </div>
    </div>
  );
}
