import React from "react";

const MeetingsTable = () => {
    return (
        <div className="overflow-x-auto border rounded-lg border-slate-300">
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="bg-[#E5EEFF] border border-gray-300">
                        <th className="px-5 py-9 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                            TITLE
                        </th>
                        <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                            FROM
                        </th>
                        <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                            TO
                        </th>
                        <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                            RELATED TO
                        </th>
                        <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                            CONTACT NAME
                        </th>
                        <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide text-[#64748B]">
                            HOST
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr className="hover:bg-gray-50">
                        <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium text-gray-700">
                            Text
                        </td>
                        <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                            Text
                        </td>
                        <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                            Text
                        </td>
                        <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                            Text
                        </td>
                        <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                            Text
                        </td>
                        <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                            Text
                        </td>
                    </tr>

                    <tr className="hover:bg-gray-50">
                        <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium text-gray-700">
                            Text
                        </td>
                        <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                            Text
                        </td>
                        <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                            Text
                        </td>
                        <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                            Text
                        </td>
                        <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                            Text
                        </td>
                        <td className="border-b border-gray-200 px-5 py-4 text-sm font-medium">
                            Text
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default MeetingsTable;