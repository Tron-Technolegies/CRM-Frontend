import React from "react";
import { Monitor } from "lucide-react";

const DesktopAlert = ({ settings, toggleSetting }) => {
  return (
    <div className="rounded-2xl bg-white px-20 py-10 shadow-lg mb-5">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
          <Monitor size={22} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Desktop Alerts
          </h2>
          <h2 className="text-sm text-gray-500">
            Visual and audio preferences for your operating system.
          </h2>
        </div>
      </div>

      {/* Notification sound */}
      <div className="flex items-center justify-between py-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Notification sound
          </h3>
          <p className="text-sm text-gray-500">
            Play a subtle sound when a new alert arrives.
          </p>
        </div>
        <button
          onClick={() => toggleSetting("notificationSound")}
          className={`relative h-7 w-14 rounded-full transition ${
            settings.notificationSound ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
              settings.notificationSound ? "left-8" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* Floating preview */}
      <div className="flex items-center justify-between py-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Floating preview
          </h3>
          <p className="text-sm text-gray-500">
            Show a snippet of the notification content on your desktop.
          </p>
        </div>
        <button
          onClick={() => toggleSetting("floatingPreview")}
          className={`relative h-7 w-14 rounded-full transition ${
            settings.floatingPreview ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
              settings.floatingPreview ? "left-8" : "left-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default DesktopAlert;