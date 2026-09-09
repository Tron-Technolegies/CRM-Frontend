import React from "react";
import Notifications from "./Notifications";
import PushNotifications from "./PushNotifications";
import AppNotifications from "./AppNotifications";
import DesktopAlert from "./DesktopAlert";
import useNotificationSettings from "../../../hooks/useNotificationSettings";
import BackButton from "../../common/BackButton";
import MetaComponent from "./MetaComponent";
import usePermissions from "../../../permissions/usePermissions";

const statusText = {
  saving: "Saving...",
  saved: "Saved",
  error: "Failed to save",
};

const Notification = () => {
  const { hasPermission } = usePermissions();
  const { settings, loading, error, saveStatus, toggleSetting } =
    useNotificationSettings();

  return (
    <div className="min-h-screen p-6">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <h1 className="text-3xl font-bold text-gray-800">Notification Settings</h1>
        </div>

        {saveStatus !== "idle" && (
          <span
            className={`text-sm font-medium ${
              saveStatus === "error" ? "text-red-500" : "text-gray-500"
            }`}
          >
            {statusText[saveStatus]}
          </span>
        )}
      </div>
      {error && saveStatus !== "error" && (
        <p className="mb-4 text-sm text-red-500">{error}</p>
      )}
      <Notifications settings={settings} toggleSetting={toggleSetting} />
      <PushNotifications settings={settings} toggleSetting={toggleSetting} />
      {hasPermission("integration.view") && <MetaComponent />}
      {/* <AppNotifications settings={settings} toggleSetting={toggleSetting} /> */}
      {/* <DesktopAlert settings={settings} toggleSetting={toggleSetting} /> */}
    </div>
  );
};

export default Notification;
