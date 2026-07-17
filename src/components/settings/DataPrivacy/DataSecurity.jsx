import React from 'react'
import Sensitive from './Sensitive'
import Privacy from './Privacy'

const DataSecurity = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800">
                Data & Privacy
            </h1>

            <p className="mt-2 text-gray-500">
                Manage how your enterprise data is processed, exported, and stored.
                We ensure your data rights are <br /> protected according to global
                compliance standards including GDPR and CCPA.
            </p>

            <div className="mt-8 flex items-start gap-6">
                <div className="flex-1">
                    <Privacy />
                </div>

                <div className="w-[420px]">
                    <Sensitive />
                </div>
            </div>
        </div>
    )
}

export default DataSecurity