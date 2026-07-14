import React, { useState } from "react";
import { Plus } from "lucide-react";
import MeetingsTable from "../components/Meeting/MeetingsTable";
import AddMeeting from "../components/Meeting/AddMeeting";

const Meetings = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="mt-5">
                <div className="flex items-center justify-between mb-15">
                    <h1 className="text-[28px] font-bold text-[#111827]">
                        Meetings
                    </h1>

                    <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-7 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        <Plus size={18} />
                        Create Meeting
                    </button>
                </div>

                <MeetingsTable />
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs">
                    <div className="relative w-full max-w-3xl rounded-xl bg-white shadow-2xl">
                        <AddMeeting onClose={() => setShowModal(false)} />
                    </div>
                </div>
            )}
        </>
    );
};

export default Meetings;