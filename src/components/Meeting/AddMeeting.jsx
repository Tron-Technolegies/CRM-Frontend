import React from "react";

const AddMeeting = ({ onClose }) => {
    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
            <div className="relative border-b border-gray-200 px-8 py-5">
                <h1 className="text-center text-2xl font-semibold text-gray-800">
                    Meeting Information
                </h1>

                <button
                    onClick={onClose}
                    className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black">
                    ✕
                </button>
            </div>

            <div className="p-8">
                <div className="space-y-6">

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                type="text"
                                placeholder="Webinar"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#2B61FF] focus:ring-2 focus:ring-[#2B61FF]/20" />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Host Name
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#2B61FF] focus:ring-2 focus:ring-[#2B61FF]/20"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                From
                            </label>
                            <input
                                type="date"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#2B61FF] focus:ring-2 focus:ring-[#2B61FF]/20" />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                To
                            </label>
                            <input
                                type="date"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#2B61FF] focus:ring-2 focus:ring-[#2B61FF]/20" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Related To
                            </label>
                            <input
                                type="text"
                                placeholder="Printing Dimensions"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#2B61FF] focus:ring-2 focus:ring-[#2B61FF]/20" />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Contact Name
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#2B61FF] focus:ring-2 focus:ring-[#2B61FF]/20" />
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 pt-8">
                        <button
                            onClick={onClose}
                            className="rounded-lg border border-[#2B61FF] px-10 py-2 font-medium text-[#2B61FF] transition hover:bg-blue-50">
                            Cancel
                        </button>

                        <button
                            className="rounded-lg bg-[#2B61FF] px-10 py-2 font-medium text-white transition hover:bg-blue-700">
                            Save
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AddMeeting;