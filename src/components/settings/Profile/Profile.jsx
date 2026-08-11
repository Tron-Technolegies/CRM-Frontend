import React, { useState, useEffect } from "react";
import { Mail, Phone, ChevronDown, Pencil } from "lucide-react";
import ProfileDetails from "./ProfileDetails";
import AccountInfoModal from "./AccountInfoModal";
import useProfile from "../../../hooks/useProfile";
import BackButton from "../../common/BackButton";

const Profile = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [openAccountModal, setOpenAccountModal] = useState(false);

  const { profile, loading, fetchProfile, saveProfile } = useProfile();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <div className="min-h-screen p-6">

      <div className="flex items-center gap-4 mb-6">
        <BackButton />
        <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-15 mb-5">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <img
            src="https://i.pravatar.cc/150?img=12"
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold text-gray-800">
                {loading ? "Loading..." : profile?.fullName || "-"}
              </h2>

              <span className="px-5 py-1 rounded-full bg-red-100 text-red-600 text-sm font-medium">
                {profile?.role || "-"}
              </span>
              <button
                onClick={() => setOpenAccountModal(true)}
                className="text-black hover:text-[#2B61FF] transition"
              >
                <Pencil size={18} />
              </button>
            </div>

            <p className="mt-3 text-gray-600">{profile?.department || "-"}</p>

            <div className="flex flex-wrap gap-8 mt-5">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={18} className="text-[#2B61FF]" />
                <span>{profile?.email || "-"}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={18} className="text-[#2B61FF]" />
                <span>{profile?.mobile || "-"}</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2 text-[#2B61FF] font-semibold hover:text-blue-700"
              >
                {showDetails ? "Hide Details" : "Show More Details"}
                <ChevronDown
                  size={18}
                  className={`transition-transform ${showDetails ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDetails && <ProfileDetails profile={profile} />}

      <AccountInfoModal
        isOpen={openAccountModal}
        onClose={() => setOpenAccountModal(false)}
        profile={profile}
        onSave={saveProfile}
      />
    </div>
  );
};

export default Profile;