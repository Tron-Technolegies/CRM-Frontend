import { useState } from "react";
import { Plus } from "lucide-react";

import useMeeting from "../hooks/useMeeting";

import MeetingsTable from "../components/Meeting/MeetingsTable";
import AddMeeting from "../components/Meeting/AddMeeting";

export default function Meetings() {
  const {
    meetings,
    loading,
    addMeeting,
    editMeeting,
    removeMeeting,
    fetchMeeting,
  } = useMeeting();

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const openAddModal = () => {
    setEditData(null);
    setShowModal(true);
  };

  const openEditModal = async (id) => {
    try {
      const meeting = await fetchMeeting(id);
      setEditData(meeting);
      setShowModal(true);
    } catch (err) {
      console.error("Failed to load meeting:", err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editData) {
        await editMeeting(editData.id, formData);
      } else {
        await addMeeting(formData);
      }

      setShowModal(false);
      setEditData(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this meeting?")) return;

    try {
      await removeMeeting(id);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-gray-500">
          Loading meetings...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] font-semibold text-[#111827]">
            Meetings
          </h1>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus size={18} />
            Create Meeting
          </button>
        </div>

        <MeetingsTable
          meetings={meetings}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="w-full max-w-5xl">
            <AddMeeting
              initialData={editData}
              onSubmit={handleSubmit}
              onClose={() => {
                setShowModal(false);
                setEditData(null);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}