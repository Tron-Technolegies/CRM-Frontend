import { useState, useEffect, useCallback, useRef } from 'react';
import {
    getNotificationPreferences,
    updateNotificationPreferences,
} from '../api/notificationApi';

const useNotificationSettings = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error
    const savedTimeoutRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        getNotificationPreferences()
            .then((data) => {
                if (isMounted) setSettings(data);
            })
            .catch(() => {
                if (isMounted) setError('Failed to load notification settings');
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