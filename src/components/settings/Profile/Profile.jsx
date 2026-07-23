import React from "react";
import { Mail, Phone, ChevronDown, Pencil, Globe, SlidersHorizontal } from "lucide-react";
import ProfileDetails from "./ProfileDetails";
import { useState, useEffect } from "react";
import AddGroupModal from "./AddGroupModal";
import LocalInfoModal from "./LocalInfoModal";
import AccountInfoModal from "./AccountInfoModal";
import useProfile from "../../../hooks/useProfile";

const Profile = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [openLocalModal, setOpenLocalModal] = useState(false);
  const [openAccountModal, setOpenAccountModal] = useState(false);

  const {
    profile,
    fetchProfile,
  } = useProfile();

  useEffect(() => {
    fetchProfile();
  }, []);


  return (
    <div className="min-h-screen p-6">

      <h1 className="text-3xl font-bold text-gray-800 mb-9">
        Profile
      </h1>

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
                {profile?.name || "Admin Name"}
              </h2>

              <span className="px-5 py-1 rounded-full bg-red-100 text-red-600 text-sm font-medium">
                Administration
              </span>
              <button
                onClick={() => setOpenAccountModal(true)}
                className="text-black hover:text-[#2B61FF] transition">
                <Pencil size={18} />
              </button>
            </div>


            <p className="mt-3 text-gray-600">
              {profile?.role || "Administration"}
            </p>

            <div className="flex flex-wrap gap-8 mt-5">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={18} className="text-[#2B61FF]" />
                <span>{profile?.email || "-"}</span>
              </div>


              <div className="flex items-center gap-2 text-gray-600">
                <Phone
                  size={18}
                  className="text-[#2B61FF]"
                />
                <span>
                  1234567890
                </span>
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
                  className={`transition-transform ${showDetails ? "rotate-180" : ""
                    }`}
                />
              </button>
            </div>


          </div>

        </div>

      </div>
      {showDetails && <ProfileDetails />}

      {/* second component  */}

      <div className="bg-white rounded-2xl shadow-lg p-12 mb-5">
        <h1 className="text-2xl font-semibold text-gray-900 pb-5">Teamspace Information</h1>
        <div className="ml-5">
          <h1 className="font-semibold text-2xl text-gray-400 flex items-center gap-3 py-5">
            Associated To<span className="p-2 rounded-lg bg-orange-300 text-white text-md mx-5">
              C T
            </span><span className="text-gray-800">CRM Teamspace</span>
          </h1>
        </div>
      </div>

      {/* third component  */}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 mb-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-[#2B61FF]" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Local Information
            </h2>
          </div>

          <button
            onClick={() => setOpenLocalModal(true)}
            className="text-black hover:text-[#2B61FF] transition">
            <Pencil className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">

          <div className="border-b border-gray-300 pb-4 flex justify-between items-center">
            <span className="text-gray-500">Language</span>
            <span className="font-medium text-gray-900">
              English (United States)
            </span>
          </div>

          <div className="border-b border-gray-300 pb-4 flex justify-between items-center">
            <span className="text-gray-500">Country Locale</span>
            <span className="font-medium text-gray-900">India</span>
          </div>

          <div className="border-b border-gray-300 pb-4 flex justify-between items-center">
            <span className="text-gray-500">Date Format</span>
            <span className="font-medium text-gray-900">DD/MM/YYYY</span>
          </div>

          <div className="border-b border-gray-300 pb-4 flex justify-between items-center">
            <span className="text-gray-500">Time Format</span>
            <span className="font-medium text-gray-900">12 Hours</span>
          </div>

          <div className="md:col-span-2 border-b border-gray-300 pb-4 flex justify-between items-center">
            <span className="text-gray-500">Time Zone</span>
            <span className="font-medium text-gray-900 text-right">
              (GMT 5:30) India Standard Time (Asia/Kolkata)
            </span>
          </div>

          <div className="border-b border-gray-300 pb-4 flex justify-between items-center">
            <span className="text-gray-500">Distance Unit</span>
            <span className="font-medium text-gray-900">
              Kilometers (km)
            </span>
          </div>

          <div className="border-b border-gray-300 pb-4 flex justify-between items-center">
            <span className="text-gray-500">Number Format</span>
            <span className="font-medium text-gray-900">
              English (United States)
            </span>
          </div>

        </div>
      </div>

      {/* fourth  */}

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-5">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-[#2B61FF]" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Groups
            </h2>
          </div>

          <button
            onClick={() => setOpenGroupModal(true)}
            className="text-black hover:text-[#2B61FF] transition">
            <Pencil className="w-5 h-5" />
          </button>
        </div>
        <div className="ml-5 flex gap-9 py-9">
          <h1 className="text-gray-300">Member In</h1>
          <h1 className="text-gray-300">No Groups Joined</h1>
        </div>
      </div>

      {/* last component  */}

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-6 h-6 text-[#2B61FF]" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Display Name Format & Preferences
          </h2>
        </div>

        {/* Content */}
        <div className="ml-9 mt-6">
          <p className="text-gray-500 pb-9">
            These settings apply to full names in list views, lookup fields, and user
            profiles.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Name Format */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Name Format
              </label>

              <select className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#2B61FF] focus:ring-2 focus:ring-[#2B61FF]/20">
                <option>Salutation, First Name, Last Name</option>
                <option>Last Name, First Name</option>
                <option>First Name Middle Name Last Name</option>
              </select>
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Sort Order Preference
              </label>

              <select className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#2B61FF] focus:ring-2 focus:ring-[#2B61FF]/20">
                <option>First Name,Last  Name</option>
                <option>Last Name</option>
              </select>
            </div>

          </div>
        </div>
      </div>
      <AddGroupModal
        isOpen={openGroupModal}
        onClose={() => setOpenGroupModal(false)}
      />
      <LocalInfoModal
        isOpen={openLocalModal}
        onClose={() => setOpenLocalModal(false)}
      />
      <AccountInfoModal
        isOpen={openAccountModal}
        onClose={() => setOpenAccountModal(false)}
      />

    </div>
  );
};

export default Profile;