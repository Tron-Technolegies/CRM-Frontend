import React from 'react'
import Password from './Password'
import Twostep from './Twostep'
import ActiveSessions from './ActiveSessions'

const Security = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800">
                Security
            </h1>
            <div className="mt-8 flex flex-col xl:flex-row gap-6">
                <div className="flex-1">
                    <Password />
                </div>

                <div className="w-full xl:w-[420px]">
                    <Twostep />
                </div>
            </div>
            <ActiveSessions />
        </div>
    )
}

export default Security