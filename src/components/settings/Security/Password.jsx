import React, { useState } from "react";
import { Lock, CheckCircle2 } from "lucide-react";
import { changePassword } from "../../../api/changepass";

const Password = () => {
    const [formData, setFormData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        // Clear old messages once the user starts editing again
        if (successMessage) setSuccessMessage("");
        if (errorMessage) setErrorMessage("");
    };

    const handleSubmit = async () => {
        setSuccessMessage("");
        setErrorMessage("");

        if (
            !formData.current_password ||
            !formData.new_password ||
            !formData.confirm_password
        ) {
            setErrorMessage("Please fill all fields");
            return;
        }

        if (formData.new_password !== formData.confirm_password) {
            setErrorMessage("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const data = await changePassword(formData);

            setSuccessMessage(data.message || "Password updated successfully");

            setFormData({
                current_password: "",
                new_password: "",
                confirm_password: "",
            });
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-xl pb-10 px-8 pt-8 max-w-4xl mx-auto">
            <div className="flex">
                <Lock size={22} className="text-blue-500" />
                <h1 className="text-2xl font-semibold text-gray-800 mb-9 px-3">
                    Password Management
                </h1>
            </div>

            {successMessage && (
                <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                    <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                    <span>{successMessage}</span>
                </div>
            )}

            {errorMessage && (
                <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                </label>
                <input
                    type="password"
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleChange}
                    placeholder="Enter current password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                    </label>
                    <input
                        type="password"
                        name="new_password"
                        value={formData.new_password}
                        onChange={handleChange}
                        placeholder="Enter new password"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* <div className="bg-[#EFF4FF] rounded-xl p-5 mb-6">
                <h2 className="font-semibold text-gray-800 mb-4">
                    Strength Requirements
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                        <p className="text-green-500">✔ Minimum 8 characters</p>
                        <p className="text-green-500">✔ At least one uppercase</p>
                    </div>

                    <div>
                        <p className="text-gray-500">• At least one number</p>
                        <p className="text-gray-500">• At least one special symbol</p>
                    </div>
                </div>
            </div> */}

            <div className="flex justify-end mt-8">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-[#2B61FF] hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition disabled:opacity-50"
                >
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </div>
        </div>
    );
};

export default Password;