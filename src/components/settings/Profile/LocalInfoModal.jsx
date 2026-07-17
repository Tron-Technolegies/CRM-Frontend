import React from "react";
import { X } from "lucide-react";

const LocalInfoModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl">

                {/* Header */}
                <div className="flex items-center justify-between border-gray-200 px-8 py-5">
                    <h2 className="text-xl font-bold text-gray-800">
                        Local Information
                    </h2>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 transition hover:bg-gray-100"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-8">

                    <div className="space-y-6">

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Language
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Country Locale
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Date Format
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Time Format
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Time Zone
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Preferred Unit for Distance
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                            />
                        </div>

                    </div>

                    {/* Number Format */}
                    <div className="mt-10">
                        <h3 className="mb-5 text-lg font-semibold text-gray-800">
                            Number Format
                        </h3>

                        <div className="space-y-9 md:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Grouping
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Decimal
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                                />
                            </div>

                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="flex justify-center gap-4 border-t border-gray-200 px-8 py-5">
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-gray-100 px-10 py-2.5 font-medium text-gray-700 transition hover:bg-gray-200"
                    >
                        Cancel
                    </button>

                    <button className="rounded-lg bg-[#2B61FF] px-10 py-2.5 font-medium text-white transition hover:bg-blue-700">
                        Save
                    </button>
                </div>

            </div>
        </div>
    );
};

export default LocalInfoModal;