import { useState, useEffect, useCallback, useRef } from 'react';
import {
    getNotificationPreferences,
    updateNotificationPreferences,
} from '../api/notificationApi';

const defaultSettings = {
    dailyDigest: false,
    newLeadAlerts: true,
    systemUpdates: true,
    taskAssignments: true,
    emailMeetingReminders: true,
    callAssignments: true,
    dealAssignments: true,
    caseAssignments: true,
    salesOrderUpdates: true,
    purchaseOrderUpdates: true,
    invoiceUpdates: true,
    highPriorityTasks: true,
    meetingReminders: true,
    activityBellDot: true,
    toastAlerts: true,
    notificationSound: false,
    floatingPreview: false,
};

const useNotificationSettings = () => {
    const [settings, setSettings] = useState(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error
    const savedTimeoutRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        getNotificationPreferences()
            .then((data) => {
                if (isMounted && data) {
                    setSettings((prev) => ({ ...prev, ...data }));
                }
            })
            .catch((err) => {
                console.warn('Failed to load notification settings from server, using local defaults:', err);
                if (isMounted) setError(null);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
            clearTimeout(savedTimeoutRef.current);
        };
    }, []);

    const toggleSetting = useCallback((key) => {
        setSettings((prev) => {
            if (!prev) return prev;
            const previousValue = prev[key];
            const updated = { ...prev, [key]: !previousValue };

            setSaveStatus('saving');
            setError(null);

            updateNotificationPreferences({ [key]: updated[key] })
                .then(() => {
                    setSaveStatus('saved');
                    clearTimeout(savedTimeoutRef.current);
                    savedTimeoutRef.current = setTimeout(() => setSaveStatus('idle'), 2000);
                })
                .catch(() => {
                    setSettings((current) => ({ ...current, [key]: previousValue }));
                    setSaveStatus('error');
                    setError('Failed to save. Please try again.');
                });

            return updated;
        });
    }, []);

    return { settings, loading, error, saveStatus, toggleSetting };
};

export default useNotificationSettings;