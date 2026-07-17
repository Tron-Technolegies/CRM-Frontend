import React from 'react'
import Notifications from './Notifications'
import PushNotifications from './PushNotifications'
import AppNotifications from './AppNotifications'
import DesktopAlert from './DesktopAlert'

const Notification = () => {
    return (
        <div className="min-h-screen p-6">
            <h1 className="mb-8 text-3xl font-bold text-gray-800">
                Notification
            </h1>
            <Notifications />
            <PushNotifications />
            <AppNotifications />
            <DesktopAlert />
        </div>
    )
}

export default Notification