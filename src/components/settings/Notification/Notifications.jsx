import React from "react";
import { Mail } from "lucide-react";

const Notifications = ({ settings, toggleSetting }) => {
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

      {/* Daily digest */}
      <div className="flex items-center justify-between py-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Daily digest</h3>
          <p className="text-sm text-gray-500">
            Receive a daily summary of your activity and updates via email.
          </p>
        </div>
        <button
          onClick={() => toggleSetting("dailyDigest")}
          className={`relative h-7 w-14 rounded-full transition ${
            settings.dailyDigest ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
              settings.dailyDigest ? "left-8" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* Descriptive line, no toggle */}
      <div className="flex items-center justify-between py-4">
        <p className="mt-1 text-sm text-gray-500">
          Manage how and when you receive emails from the system.
        </p>
      </div>

      {/* New lead alerts */}
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
          onClick={() => toggleSetting("newLeadAlerts")}
          className={`relative h-7 w-14 rounded-full transition ${
            settings.newLeadAlerts ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
              settings.newLeadAlerts ? "left-8" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* Deal assignments */}
      <div className="flex items-center justify-between py-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Deal assignments
          </h3>
          <p className="text-sm text-gray-500">
            Get notified when a deal is assigned to you.
          </p>
        </div>
        <button
          onClick={() => toggleSetting("dealAssignments")}
          className={`relative h-7 w-14 rounded-full transition ${
            settings.dealAssignments ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
              settings.dealAssignments ? "left-8" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* Task assignments */}
      <div className="flex items-center justify-between py-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Task assignments
          </h3>
          <p className="text-sm text-gray-500">
            Get notified when a task is assigned to you.
          </p>
        </div>
        <button
          onClick={() => toggleSetting("taskAssignments")}
          className={`relative h-7 w-14 rounded-full transition ${
            settings.taskAssignments ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
              settings.taskAssignments ? "left-8" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* Meeting reminders (email) */}
      <div className="flex items-center justify-between py-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Meeting reminders
          </h3>
          <p className="text-sm text-gray-500">
            Get emailed when you're set as the host for a meeting.
          </p>
        </div>
        <button
          onClick={() => toggleSetting("emailMeetingReminders")}
          className={`relative h-7 w-14 rounded-full transition ${
            settings.emailMeetingReminders ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
              settings.emailMeetingReminders ? "left-8" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* Call assignments */}
      <div className="flex items-center justify-between py-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Call assignments
          </h3>
          <p className="text-sm text-gray-500">
            Get notified when a call is assigned to you.
          </p>
        </div>
        <button
          onClick={() => toggleSetting("callAssignments")}
          className={`relative h-7 w-14 rounded-full transition ${
            settings.callAssignments ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
              settings.callAssignments ? "left-8" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* Case assignments */}
      {/* <div className="flex items-center justify-between py-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Case assignments
          </h3>
          <p className="text-sm text-gray-500">
            Get notified when a case is assigned to you.
          </p>
        </div>
        <button
          onClick={() => toggleSetting("caseAssignments")}
          className={`relative h-7 w-14 rounded-full transition ${
            settings.caseAssignments ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
              settings.caseAssignments ? "left-8" : "left-1"
            }`}
          />
        </button>
      </div> */}

      {/* Sales order updates */}
      <div className="flex items-center justify-between py-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Sales order updates
          </h3>
          <p className="text-sm text-gray-500">
            Get notified when a sales order is assigned to you.
          </p>
        </div>
        <button
          onClick={() => toggleSetting("salesOrderUpdates")}
          className={`relative h-7 w-14 rounded-full transition ${
            settings.salesOrderUpdates ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
              settings.salesOrderUpdates ? "left-8" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* Purchase order updates */}
      <div className="flex items-center justify-between py-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Purchase order updates
          </h3>
          <p className="text-sm text-gray-500">
            Get notified when a purchase order is assigned to you.
          </p>
        </div>
        <button
          onClick={() => toggleSetting("purchaseOrderUpdates")}
          className={`relative h-7 w-14 rounded-full transition ${
            settings.purchaseOrderUpdates ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
              settings.purchaseOrderUpdates ? "left-8" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* Invoice updates */}
      <div className="flex items-center justify-between py-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Invoice updates
          </h3>
          <p className="text-sm text-gray-500">
            Get notified when an invoice is assigned to you.
          </p>
        </div>
        <button
          onClick={() => toggleSetting("invoiceUpdates")}
          className={`relative h-7 w-14 rounded-full transition ${
            settings.invoiceUpdates ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
              settings.invoiceUpdates ? "left-8" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* System updates */}
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
          onClick={() => toggleSetting("systemUpdates")}
          className={`relative h-7 w-14 rounded-full transition ${
            settings.systemUpdates ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
              settings.systemUpdates ? "left-8" : "left-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default Notifications;