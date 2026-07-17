import React from "react";
import { TriangleAlert } from "lucide-react";

const Sensitive = () => {
    return (
        <>
            <div>
                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 shadow-lg">
                    <div className="mb-6 flex items-center gap-3">
                        <TriangleAlert size={24} className="text-red-600" />

                        <div>
                            <h2 className="text-2xl font-bold text-red-700">
                                Sensitive Zone
                            </h2>
                        </div>
                    </div>

                    <div className="mb-5 rounded-xl border border-red-200 bg-white p-5">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Purge Organization Data
                        </h3>

                        <p className="mt-2 text-md text-gray-600">
                            Permanently delete all customer records, deals,
                            and history. This action is immediate and
                            cannot be undone.
                        </p>

                        <button className="mt-5 w-full rounded-lg bg-red-600 py-2 font-medium text-white transition hover:bg-red-700">
                            Purge All Data
                        </button>
                    </div>

                    <div className="rounded-xl border border-red-200 bg-white p-5">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Close Enterprise Account
                        </h3>

                        <p className="mt-2 text-md text-gray-600">
                            Terminate your enterprise subscription and
                            erase all workspace configurations.
                        </p>

                        <button className="mt-5 w-full rounded-lg bg-red-600 py-2 font-medium text-white transition hover:bg-red-700">
                            Request Account Deletion
                        </button>
                    </div>
                </div>

                <div className="mt-6 rounded-2xl border border-blue-200 bg-[#DCE9FF] p-6">
                    <h3 className="mb-2 text-lg font-semibold">
                        Privacy by Design
                    </h3>

                    <p className="text-sm">
                        Did you know you can set automatic data retention
                        policies for your leads?
                    </p>
                </div>
            </div>
        </>
    );
};

export default Sensitive;