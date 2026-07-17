import React, { useState } from "react";
import { BellRing } from "lucide-react";

const AppNotifications = () => {
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
                    <BellRing size={22} className="text-blue-600" />
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                        In-App Notifications
                    </h2>
                    <h2 className="text-sm text-gray-500">
                        Adjust how notifications appear while you're using the CRM.
                    </h2>
                </div>
            </div>

            <div className="flex items-center justify-between py-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        Activity bell red dot
                    </h3>
                    <p className="text-sm text-gray-500">
                        Show a small indicator when you have unread notifications.
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
            <div className="flex items-center justify-between py-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        Toast alerts
                    </h3>
                    <p className="text-sm text-gray-500">
                        Briefly show pop-up messages in the bottom corner of the screen.
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
        </div>
    );
};

export default AppNotifications;