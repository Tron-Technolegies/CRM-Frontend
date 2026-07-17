import React, { useState } from "react";
import { SlidersHorizontal, BadgeCheck, ShieldHalf } from "lucide-react";

const Privacy = () => {
    const [settings, setSettings] = useState({
        notificationSound: true,
        marketingCommunications: false,
        thirdPartySharing: true,
    });

    const toggleSetting = (key) => {
        setSettings((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <div>
            <div className="rounded-2xl bg-white px-10 py-10 shadow-lg">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                        <SlidersHorizontal size={22} className="text-blue-600" />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Privacy Preferences
                        </h2>
                    </div>
                </div>

                {/* Notification Sound */}
                <div className="mb-5 flex items-center justify-between rounded-xl bg-[#EFF4FF] p-5">
                    <div className="max-w-xl">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Notification Sound
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Play a subtle sound whenever a new notification arrives.
                        </p>
                    </div>

                    <button
                        onClick={() => toggleSetting("notificationSound")}
                        className={`relative h-7 w-14 rounded-full transition ${settings.notificationSound ? "bg-blue-600" : "bg-gray-300"
                            }`}
                    >
                        <span
                            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${settings.notificationSound ? "left-8" : "left-1"
                                }`}
                        />
                    </button>
                </div>

                {/* Marketing Communications */}
                <div className="mb-5 flex items-center justify-between rounded-xl bg-[#EFF4FF] p-5">
                    <div className="max-w-xl">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Marketing Communications
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Receive updates about new features, security improvements, and
                            industry insights.
                        </p>
                    </div>

                    <button
                        onClick={() => toggleSetting("marketingCommunications")}
                        className={`relative h-7 w-14 rounded-full transition ${settings.marketingCommunications
                            ? "bg-blue-600"
                            : "bg-gray-300"
                            }`}
                    >
                        <span
                            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${settings.marketingCommunications ? "left-8" : "left-1"
                                }`}
                        />
                    </button>
                </div>

                {/* Third-party Data Sharing */}
                <div className="mb-8 flex items-center justify-between rounded-xl bg-[#EFF4FF] p-5">
                    <div className="max-w-xl">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Third-party Data Sharing
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Enable integration with trusted partners for enhanced analytics and
                            secure cross-platform synchronization.
                        </p>
                    </div>

                    <button
                        onClick={() => toggleSetting("thirdPartySharing")}
                        className={`relative h-7 w-14 rounded-full transition ${settings.thirdPartySharing ? "bg-blue-600" : "bg-gray-300"
                            }`}
                    >
                        <span
                            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${settings.thirdPartySharing ? "left-8" : "left-1"
                                }`}
                        />
                    </button>
                </div>

                {/* Save Button */}
                <div className="flex justify-end border-t border-gray-200 pt-6">
                    <button className="rounded-lg bg-[#2B61FF] px-6 py-2.5 font-medium text-white transition hover:bg-blue-700">
                        Save Preferences
                    </button>
                </div>
            </div>


            {/* Compliance Cards */}
            <div className="mt-8 rounded-2xl bg-white p-15 shadow-lg">
                <h2 className="mb-6 text-xl font-semibold text-gray-800">
                    Compliance Status
                </h2>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="flex items-center gap-4 rounded-xl border border-gray-300 p-5 shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full">
                            <BadgeCheck size={25} className="text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">GDPR Compliant</h3>
                            <p className="text-sm text-gray-500">
                                Validated September 2023
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl border border-gray-300 p-5 shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full">
                            <ShieldHalf size={25} className="text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">SOC 2 Type II</h3>
                            <p className="text-sm text-gray-500">
                                Annual audit complete
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;