import React from "react";

const LogCall = ({ onClose }) => {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-xl">
            <div className="relative  px-10 pt-10">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Log a Call
                </h1>

                <p className="pt-6 text-[#2B61FF]">
                    Call Information
                </p>

                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 rounded-full p-2 text-xl text-gray-500 transition hover:bg-gray-100 hover:text-black"
                >
                    ✕
                </button>
            </div>

            {/* Body */}
            <div className="p-10">
                <div className="space-y-6">

                    {/* Row 1 */}
                    <div className="grid grid-cols-2 gap-10">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Call For
                            </label>

                            <input
                                type="text"
                                placeholder="text"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#2B61FF] focus:ring-2 focus:ring-[#2B61FF]/20"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Related To
                            </label>

                            <input
                                type="text"
                                placeholder="Text"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#2B61FF] focus:ring-2 focus:ring-[#2B61FF]/20"
                            />
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-2 gap-10">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Call Type
                            </label>

                            <input
                                type="text"
                                placeholder="Outbound"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#2B61FF] focus:ring-2 focus:ring-[#2B61FF]/20"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Outgoing Call Status
                            </label>

                            <input
                                type="text"
                                placeholder="schedule"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#2B61FF] focus:ring-2 focus:ring-[#2B61FF]/20"
                            />
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div className="grid grid-cols-2 gap-10">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Call Start Time
                            </label>

                            <div className="flex w-full rounded-lg border border-gray-300 focus-within:border-[#2B61FF] focus-within:ring-2 focus-within:ring-[#2B61FF]/20">
                                <input
                                    type="text"
                                    placeholder="30/06/26"
                                    className="w-1/2 px-4 py-3 outline-none"
                                />

                                <div className="h-10 w-px self-center bg-gray-300"></div>

                                <input
                                    type="text"
                                    placeholder="02:57PM"
                                    className="w-1/2 px-4 py-3 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Call Duration
                            </label>

                            <input
                                type="text"
                                placeholder="00 minute  00 seconds"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#2B61FF] focus:ring-2 focus:ring-[#2B61FF]/20"
                            />
                        </div>
                    </div>

                    {/* Row 4  */}

                    <div className="grid grid-cols-2 gap-10">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Subject
                            </label>

                            <input
                                type="text"
                                placeholder="text"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#2B61FF] focus:ring-2 focus:ring-[#2B61FF]/20"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Voice Recording
                            </label>

                            <input
                                type="text"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#2B61FF] focus:ring-2 focus:ring-[#2B61FF]/20"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-center gap-4 pt-8">
                        <button
                            onClick={onClose}
                            className="rounded-lg border border-[#2B61FF] px-10 py-2 font-medium text-[#2B61FF] transition hover:bg-blue-50"
                        >
                            Cancel
                        </button>

                        <button
                            className="rounded-lg bg-[#2B61FF] px-10 py-2 font-medium text-white transition hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LogCall;