import React from "react";
import { Monitor, Smartphone } from "lucide-react";

const ActiveSessions = () => {
    return (
        <div className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-8">
                <div>
                    <h2 className="text-3xl font-semibold text-gray-900">
                        Active Sessions
                    </h2>
                    <p className="text-gray-500 mt-2">
                        You're currently logged in on these devices.
                    </p>
                </div>

                <button className="border border-red-300 text-red-500 px-6 py-2 rounded-xl hover:bg-red-50 transition">
                    Sign out of all other sessions
                </button>
            </div>

            <div className="grid grid-cols-[2.2fr_1.4fr_1.5fr_1.3fr_1fr] border-y border-gray-200 px-9 py-4 text-sm font-semibold text-gray-700">
                <div>Browser / Device</div>
                <div>IP Address</div>
                <div>Location</div>
                <div>Last Active</div>
                <div className="text-center">Action</div>
            </div>

            <div className="grid grid-cols-[2.2fr_1.4fr_1.5fr_1.3fr_1fr] items-center px-8 py-5">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Monitor size={22} className="text-blue-600" />
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-900">
                            Chrome on Windows
                        </h3>
                        <span className="text-xs font-bold tracking-wider text-emerald-600 uppercase">
                            Current Session
                        </span>
                    </div>
                </div>

                <div className="text-gray-600">192.168.1.104</div>
                <div className="text-gray-600">San Francisco, US</div>
                <div className="text-gray-600">Active now</div>
                <div className="text-center text-gray-400">
                    Always active
                </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-[2.2fr_1.4fr_1.5fr_1.3fr_1fr] items-center px-8 py-5">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Smartphone size={22} className="text-blue-600" />
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-900">
                            Safari on iPhone 15
                        </h3>
                        <p className="text-sm text-gray-400">
                            Mobile App
                        </p>
                    </div>
                </div>

                <div className="text-gray-600">104.22.7.191</div>
                <div className="text-gray-600">Kolkata, India</div>
                <div className="text-gray-600">2 hours ago</div>
                <div className="text-center">
                    <button className="text-red-500 font-medium hover:text-red-600">
                        Revoke
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-[2.2fr_1.4fr_1.5fr_1.3fr_1fr] items-center px-8 py-5">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Monitor size={22} className="text-blue-600" />
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-900">
                            Firefox on macOS
                        </h3>
                        <p className="text-sm text-gray-400">
                            Desktop Browser
                        </p>
                    </div>
                </div>

                <div className="text-gray-600">203.0.113.45</div>
                <div className="text-gray-600">London, UK</div>
                <div className="text-gray-600">Oct 12, 2023</div>
                <div className="text-center">
                    <button className="text-red-500 font-medium hover:text-red-600">
                        Revoke
                    </button>
                </div>
            </div>

        </div>
    );
};

export default ActiveSessions;