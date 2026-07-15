import React from "react";

const ProfileDetails = () => {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* User Information */}

                <div className="flex-1 lg:pr-8  border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-8">
                        User Information
                    </h2>

                    <div className="space-y-7">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-500">Name</span>
                            <span className="font-semibold text-gray-800 text-right">
                                Admin Name
                            </span>
                        </div>

                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-500">Last Name</span>
                            <span className="font-semibold text-gray-800 text-right">
                                Last Name
                            </span>
                        </div>

                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-500">Email</span>
                            <span className="font-semibold text-gray-800 text-right">
                                admin@gmail.com
                            </span>
                        </div>

                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-500">Role</span>
                            <span className="font-semibold text-gray-800 text-right">
                                Role Name
                            </span>
                        </div>

                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-500">Profile</span>
                            <span className="font-semibold text-gray-800 text-right">
                                Text
                            </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-500">Added By</span>
                            <span className="font-semibold text-gray-800 text-right">
                                Admin Name
                            </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-500">Alias</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-500">Mobile</span>
                            <span className="font-semibold text-gray-800 text-right">
                                00000000000
                            </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-500">Website</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-500">Fax</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-500">Date Of Birth</span>
                        </div>
                    </div>
                </div>

                {/* Address Information */}

                <div className="flex-1 lg:pl-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-8">
                        Address Information
                    </h2>

                    <div className="space-y-7">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-500">Street</span>
                            <span className="font-semibold text-gray-800 text-right">
                                Street
                            </span>
                        </div>

                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-500">City</span>
                            <span className="font-semibold text-gray-800 text-right">
                                City
                            </span>
                        </div>

                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-500">State</span>
                            <span className="font-semibold text-gray-800 text-right">
                                Kerala
                            </span>
                        </div>

                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-500">Zip Code</span>
                            <span className="font-semibold text-gray-800 text-right">
                                680001
                            </span>
                        </div>

                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-500">Country</span>
                            <span className="font-semibold text-gray-800 text-right">
                                India
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfileDetails;