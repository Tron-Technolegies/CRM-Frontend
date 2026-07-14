import React, { useState } from "react";
import CallsTable from "../components/Calls/CallsTable";
import LogCall from "../components/Calls/LogCall";
import ScheduleCall from "../components/Calls/ScheduleCall";

const Calls = () => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("");
    const [showModal, setShowModal] = useState(false);

    const handleOptionClick = (type) => {
        setSelected(type);
        setShowModal(true);
        setOpen(false);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelected("");
    };

    return (
        <>
            <div className="mt-5">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-[28px] font-bold text-[#111827]">
                        Calls
                    </h1>

                    <div className="relative">
                        <button
                            onClick={() => setOpen(!open)}
                            className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            Create Call
                            {/* <span className="text-xs">▼</span> */}
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                                <button
                                    onClick={() => handleOptionClick("schedule")}
                                    className="block w-full px-4 py-3 text-left text-blue-700 hover:bg-gray-100">
                                    Schedule Call
                                </button>

                                <button
                                    onClick={() => handleOptionClick("log")}
                                    className="block w-full px-4 py-3 text-left text-blue-700 hover:bg-gray-100">
                                    Log a Call
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <CallsTable />
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs">
                    <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
                        {selected === "schedule" && (
                            <ScheduleCall onClose={closeModal} />
                        )}
                        {selected === "log" && (
                            <LogCall onClose={closeModal} />
                        )}

                    </div>
                </div>
            )}
        </>
    );
};

export default Calls;