import React from "react";

const NotesSection = ({ formData, handleChange }) => {
    return (
        <div className="flex gap-5 my-5 mx-6">

            {/* Terms & Conditions */}
            <div className="border border-gray-300 shadow-lg rounded-lg p-7 w-1/2">

                <h1 className="text-[#2C62FF] font-semibold mb-5">
                    Terms & Conditions
                </h1>

                <textarea
                    name="terms_conditions"
                    value={formData.terms_conditions || ""}
                    onChange={handleChange}
                    placeholder="Legal notes, payment terms, or policy links..."
                    className="mt-2 w-full min-h-[150px] rounded-xl border border-[#E5E7EB] p-4 text-sm outline-none resize-none"
                />

            </div>


            {/* Description */}
            <div className="border border-gray-300 shadow-lg rounded-lg p-7 w-1/2">

                <h1 className="text-[#2C62FF] font-semibold mb-5">
                    Description
                </h1>

                <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    placeholder="Internal comments or detailed breakdown for this quote..."
                    className="mt-2 w-full min-h-[150px] rounded-xl border border-[#E5E7EB] p-4 text-sm outline-none resize-none"
                />

            </div>

        </div>
    );
};

export default NotesSection;