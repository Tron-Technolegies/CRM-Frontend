import React from "react";
import {
    ShieldCheck,
    Smartphone,
    MapPin,
    Clock,
    CheckCircle,
    CircleCheck,
    XCircle,
} from "lucide-react";

const Twostep = () => {
    return (
        <div className="space-y-6 mb-5">

            <div className="bg-white shadow-lg rounded-xl p-8 ">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ShieldCheck size={22} className="text-blue-600" />
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Two-Step Verification
                        </h2>
                    </div>

                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                        Enabled
                    </span>
                </div>

                <p className="text-gray-500 mt-4 text-sm">
                    Add an extra layer of security to your account by requiring
                    more than just a password to log in.
                </p>

                <div className="mt-6 border border-blue-300 bg-blue-50 rounded-xl p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Smartphone className="text-blue-600" size={24} />

                        <div>
                            <h3 className="font-semibold text-gray-800">
                                Authenticator App
                            </h3>
                            <p className="text-gray-500 text-sm">
                                Google, Authy, or Microsoft
                            </p>
                        </div>
                    </div>

                    <CircleCheck size={18} className="text-white bg-blue-500 rounded-full" />
                </div>
            </div>

            {/* Recent Logins */}
            <div className="bg-white shadow-lg rounded-xl p-8">
                <h2 className="text-2xl font-semibold border-b border-gray-300 pb-4">
                    Recent Logins
                </h2>

                <div className="py-5 border-b border-gray-300 flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">San Francisco, US</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            Today, 10:42 AM
                        </div>
                    </div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>

                <div className="py-5 flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Unknown Device</span>
                        </div>

                        <div className="flex items-center font-bold gap-2 text-red-500 text-xs">
                            Yesterday, 11:15 PM
                        </div>
                    </div>
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                </div>
            </div>
        </div>
    );
};

export default Twostep;