import React, { useState } from "react";
import { Mail } from "lucide-react";

const Notifications = () => {
  const [settings, setSettings] = useState({
    dailyDigest: true,
    orderUpdates: true,
    promotions: false,
    securityAlerts: true,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (


    <div className="rounded-2xl bg-white px-20 py-10 shadow-lg mb-5">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
          <Mail size={22} className="text-blue-600" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Email Notifications
          </h2>
        </div>
      </div>

      <div className="flex items-center justify-between py-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Daily digest
          </h3>
          <p className="text-sm text-gray-500">
            Receive a daily summary of your activity and updates via email.
          </p>
        </div>

        <button
          onClick={() => toggleSetting("dailyDigest")}
          className={`relative h-7 w-14 rounded-full transition ${settings.dailyDigest ? "bg-blue-600" : "bg-gray-300"
            }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${settings.dailyDigest ? "left-8" : "left-1"
              }`}
          />
        </button>
      </div>

      {/* Order Updates */}
      <div className="flex items-center justify-between py-4">
        <div>
          <p className="mt-1 text-sm text-gray-500">
            Manage how and when you receive emails from the system.
          </p>
        </div>
      </div>

      {/* Promotions */}
      <div className="flex items-center justify-between py-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            New lead alerts
          </h3>
          <p className="text-sm text-gray-500">
            Get notified instantly when a new lead is assigned to you.
          </p>
        </div>

        <button
          onClick={() => toggleSetting("promotions")}
          className={`relative h-7 w-14 rounded-full transition ${settings.promotions ? "bg-blue-600" : "bg-gray-300"
            }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${settings.promotions ? "left-8" : "left-1"
              }`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between py-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            System Updates
          </h3>
          <p className="text-sm text-gray-500">
            Receive emails about major product updates and maintenance.
          </p>
        </div>

        <button
          onClick={() => toggleSetting("securityAlerts")}
          className={`relative h-7 w-14 rounded-full transition ${settings.securityAlerts ? "bg-blue-600" : "bg-gray-300"
            }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${settings.securityAlerts ? "left-8" : "left-1"
              }`}
          />
        </button>
      </div>
    </div>
  );
};

export default Notifications;