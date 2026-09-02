import React, { useEffect, useState } from "react";
import { X, Camera } from "lucide-react";

const emptyForm = {
  fullName: "",
  lastName: "",
  mobile: "",
  website: "",
  fax: "",
  alias: "",
  dateOfBirth: "",
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
};

const AccountInfoModal = ({ isOpen, onClose, profile, onSave }) => {
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState(null);
  const [pictureFile, setPictureFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.fullName || "",
        lastName: profile.lastName || "",
        mobile: profile.mobile || "",
        website: profile.website || "",
        fax: profile.fax || "",
        alias: profile.alias || "",
        dateOfBirth: profile.dateOfBirth || "",
        street: profile.street || "",
        city: profile.city || "",
        state: profile.state || "",
        zipCode: profile.zipCode || "",
        country: profile.country || "",
      });
      setPreview(profile.profilePicture || null);
      setPictureFile(null);
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const setField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handlePictureChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setPictureFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value ?? "");
      });

      if (pictureFile) {
        formData.append("profilePicture", pictureFile);
      }

      await onSave(formData);
      onClose();
    } catch (err) {
      console.error("SAVE PROFILE ERROR:", err);
      setError("Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-gray-200 px-8 pt-5">
          <h2 className="text-xl font-bold text-gray-800">Account Information</h2>
          <button onClick={onClose} className="rounded-lg p-1 transition hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Profile picture */}
          <div className="mb-8 flex items-center gap-5">
            <div className="relative">
              <img
                src={preview || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.fullName || "User")}&background=e5e7eb&color=6b7280&size=200`}
                alt="profile"
                className="h-20 w-20 rounded-full object-cover border border-gray-200"
              />
              <label
                htmlFor="profilePictureInput"
                className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[#2B61FF] text-white shadow hover:bg-blue-700"
              >
                <Camera className="h-4 w-4" />
              </label>
              <input
                id="profilePictureInput"
                type="file"
                accept="image/*"
                onChange={handlePictureChange}
                className="hidden"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Profile Picture</p>
              <p className="text-xs text-gray-400">Click the icon to upload a new photo</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h1 className="font-semibold pb-7">User Information</h1>
              <label className="mb-2 block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={form.fullName}
                onChange={setField("fullName")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <h1 className="font-semibold pb-7">Address Information</h1>
              <label className="mb-2 block text-sm font-medium text-gray-700">Street</label>
              <input
                type="text"
                value={form.street}
                onChange={setField("street")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
              />
            </div>

            {/* <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={form.lastName}
                onChange={setField("lastName")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
              />
            </div> */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                value={form.city}
                onChange={setField("city")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                value={form.state}
                onChange={setField("state")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Zip Code</label>
              <input
                type="text"
                value={form.zipCode}
                onChange={setField("zipCode")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                value={form.country}
                onChange={setField("country")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-10">
            <div className="space-y-9 md:grid-cols-2 w-1/2">
              {/* <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Alias</label>
                <input
                  type="text"
                  value={form.alias}
                  onChange={setField("alias")}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div> */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Mobile</label>
                <input
                  type="text"
                  value={form.mobile}
                  onChange={setField("mobile")}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Website</label>
                <input
                  type="text"
                  value={form.website}
                  onChange={setField("website")}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>
              {/* <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Fax</label>
                <input
                  type="text"
                  value={form.fax}
                  onChange={setField("fax")}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div> */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Date Of Birth</label>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={setField("dateOfBirth")}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 border-t border-gray-200 px-8 py-5">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-20 py-2.5 font-medium text-gray-700 transition hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-[#2B61FF] px-20 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountInfoModal;