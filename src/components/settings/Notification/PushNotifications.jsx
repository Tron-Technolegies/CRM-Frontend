import React from "react";
import { Bell } from "lucide-react";

const PushNotifications = ({ settings, toggleSetting }) => {
  return (
    <div className="rounded-2xl bg-white px-20 py-10 shadow-lg mb-5">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
          <Bell size={22} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Push Notifications
          </h2>
          <h2 className="text-sm text-gray-500">
            Control mobile and browser alerts for time-sensitive events.
          </h2>
        </div>
      </div>

      {/* High-priority tasks */}
      <div className="flex items-center justify-between py-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            High-priority tasks
          </h3>
          <p className="text-sm text-gray-500">
            Alerts for tasks that are overdue or marked as critical.
          </p>
        </div>
        <button
          onClick={() => toggleSetting("highPriorityTasks")}
          className={`relative h-7 w-14 rounded-full transition ${
            settings.highPriorityTasks ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
              settings.highPriorityTasks ? "left-8" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* Meeting reminders */}
      <div className="flex items-center justify-between py-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Meeting reminders
          </h3>
          <p className="text-sm text-gray-500">
            Get notified 15 minutes before any scheduled calendar event.
          </p>
        </div>
        <button
          onClick={() => toggleSetting("meetingReminders")}
          className={`relative h-7 w-14 rounded-full transition ${
            settings.meetingReminders ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
              settings.meetingReminders ? "left-8" : "left-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default PushNotifications;