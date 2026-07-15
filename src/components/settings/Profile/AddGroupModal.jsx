import React from "react";
import { X } from "lucide-react";

const AddGroupModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">

                {/* Header */}
                <div className="flex items-center justify-between border-gray-200 px-8 py-5">
                    <h2 className="text-xl font-bold text-gray-800">
                        Add Groups - "Admin Name"
                    </h2>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 hover:bg-gray-100 transition"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <div className="flex items-center px-8 py-8">
                    <label className="w-28 text-sm font-medium text-gray-700">
                        Member In
                    </label>

                    <select className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none">
                        <option value=""></option>
                        <option>Team</option>
                        <option>Team</option>
                        <option>Team</option>
                    </select>
                </div>

                {/* Footer */}
                <div className="flex justify-center gap-4 border-gray-200 px-8 py-5">
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-gray-100 px-20 py-2 font-medium text-gray-700 hover:bg-gray-200 transition"
                    >
                        Cancel
                    </button>

                    <button className="rounded-lg bg-[#2B61FF] px-20 py-2 font-medium text-white hover:bg-blue-700 transition">
                        Save
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AddGroupModal;