import React from "react";

const ProfileDetails = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="flex-1 lg:pr-8 border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-8">User Information</h2>

          <div className="space-y-7">
            <Row label="First Name" value={profile.fullName} />
            <Row label="Last Name" value={profile.lastName} />
            <Row label="Email" value={profile.email} />
            <Row label="Role" value={profile.role} />
            <Row label="Profile" value={profile.profileType} />
            <Row label="Added By" value={profile.addedBy} />
            <Row label="Alias" value={profile.alias} />
            <Row label="Mobile" value={profile.mobile} />
            <Row label="Website" value={profile.website} />
            <Row label="Fax" value={profile.fax} />
            <Row label="Date Of Birth" value={profile.dateOfBirth} />
          </div>
        </div>

        <div className="flex-1 lg:pl-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-8">Address Information</h2>

          <div className="space-y-7">
            <Row label="Street" value={profile.street} />
            <Row label="City" value={profile.city} />
            <Row label="State" value={profile.state} />
            <Row label="Zip Code" value={profile.zipCode} />
            <Row label="Country" value={profile.country} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
    <span className="text-gray-500">{label}</span>
    <span className="font-semibold text-gray-800 text-right">{value || "-"}</span>
  </div>
);

export default ProfileDetails;