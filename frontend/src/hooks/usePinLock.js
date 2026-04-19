import { useState, useCallback } from 'react';

const SESSION_KEY = 'vayunav_unlocked';
const CORRECT_PIN = import.meta.env.VITE_APP_PIN;

export function usePinLock() {
    const [isUnlocked, setIsUnlocked] = useState(() => {
        return sessionStorage.getItem(SESSION_KEY) === 'true';
    });

    const [error, setError] = useState(false);

    const tryUnlock = useCallback((pin) => {
        if (pin === CORRECT_PIN) {
            sessionStorage.setItem(SESSION_KEY, 'true');
            setIsUnlocked(true);
            setError(false);
        } else {
            setError(true);
            setTimeout(() => setError(false), 1200);
        }
    }, []);

    return { isUnlocked, tryUnlock, error };
}
