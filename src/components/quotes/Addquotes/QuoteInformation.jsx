import { Search } from "lucide-react";
import React from "react";

const QuoteInformation = () => {
    return (
        <div className="border border-gray-300 shadow-lg rounded-lg p-7 mx-6">

            <h1 className="text-[#2C62FF] font-semibold mb-5">
                Quote Information
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Subject */}
                <div>
                    <label className="text-xs text-[#64748B] font-medium">
                        SUBJECT
                    </label>

                    <div className="mt-2 flex items-center gap-2">
                        <input
                            placeholder="e.g. Website Overhaul Q1"
                            className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                        />
                    </div>
                </div>

                {/* Quote Stage */}
                <div>
                    <label className="text-xs text-[#64748B] font-medium">
                        QUOTE STAGE
                    </label>

                    <select
                        className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none"
                    >
                        <option value="">Draft</option>
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                    </select>
                </div>

                {/* Valid Until */}
                <div>
                    <label className="text-xs text-[#64748B] font-medium">
                        VALID UNTIL
                    </label>

                    <div className="mt-2 flex items-center gap-2">
                        <input
                            type="date"
                            className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                        />
                    </div>
                </div>

                {/* Deal Name */}

                <div>
                    <label className="text-xs text-[#64748B] font-medium">
                        DEAL NAME
                    </label>

                    <div className="relative mt-2">
                        <input
                            type="text"
                            placeholder="Lookup deals..."
                            className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] pl-10 pr-4 text-sm outline-none"
                        />
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                    </div>
                </div>

                {/* Carrier */}
                <div>
                    <label className="text-xs text-[#64748B] font-medium">
                        CARRIER
                    </label>

                    <input
                        placeholder="FedEx, UPS, etc."
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />
                </div>

                {/* Team */}
                <div>
                    <label className="text-xs text-[#64748B] font-medium">
                        TEAM
                    </label>

                    <select
                        className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] px-4 text-sm bg-white outline-none"
                    >
                        <option value="">Sales North America</option>
                        <option value="website">Website</option>
                        <option value="referral">Referral</option>
                        <option value="social">Social Media</option>
                    </select>
                </div>

                {/* Quote Owner */}
                <div>
                    <label className="text-xs text-[#64748B] font-medium">
                        QUOTE OWNER
                    </label>

                    <input
                        type="text"
                        placeholder="Name"
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />
                </div>

                {/* Contact Name */}
                <div>
                    <label className="text-xs text-[#64748B] font-medium">
                        CONTACT NAME
                    </label>

                    <input
                        type="text"
                        placeholder="FedEx, UPS, etc."
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />
                </div>

                {/* Account Name */}
                <div>
                    <label className="text-xs text-[#64748B] font-medium">
                        ACCOUNT NAME
                    </label>

                    <input
                        type="text"
                        placeholder="Name"
                        className="h-11 w-full rounded-xl border-2 border-[#E5E7EB] px-4 text-sm outline-none"
                    />
                </div>

            </div>
        </div>
    );
};

export default QuoteInformation;