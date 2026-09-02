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

const STORAGE_KEY = 'crm_notification_preferences';

const getStoredSettings = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch {
        return defaultSettings;
    }
};

const useNotificationSettings = () => {
    const [settings, setSettings] = useState(getStoredSettings);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error
    const savedTimeoutRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        getNotificationPreferences()
            .then((data) => {
                if (isMounted && data) {
                    setSettings((prev) => {
                        const merged = { ...prev, ...data };
                        try {
                            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
                        } catch {}
                        return merged;
                    });
                }
            })
            .catch((err) => {
                console.warn('Notification preferences using local cache:', err);
            });

        return () => {
            isMounted = false;
            clearTimeout(savedTimeoutRef.current);
        };
    }, []);

    const toggleSetting = useCallback(async (key) => {
        let updated;

        setSettings((prev) => {
            const current = prev || defaultSettings;
            const nextValue = !current[key];
            updated = { ...current, [key]: nextValue };
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch {}
            return updated;
        });

        setSaveStatus('saving');
        setError(null);

        try {
            const data = await updateNotificationPreferences({ [key]: updated[key] });
            if (data) {
                setSettings((prev) => {
                    const merged = { ...prev, ...data };
                    try {
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
                    } catch {}
                    return merged;
                });
            }
        } catch (err) {
            console.warn('Backend update notice (local state persisted):', err);
        } finally {
            setSaveStatus('saved');
            clearTimeout(savedTimeoutRef.current);
            savedTimeoutRef.current = setTimeout(() => setSaveStatus('idle'), 2000);
        }
    }, []);

    return { settings, loading, error, saveStatus, toggleSetting };
};

export default useNotificationSettings;