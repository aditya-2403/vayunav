import { useState, useCallback } from 'react';
import { apiService } from '../services/api';

const SESSION_KEY = 'vayunav_unlocked';
const TOKEN_KEY = 'vayunav_token';

export function usePinLock() {
    const [isUnlocked, setIsUnlocked] = useState(() => {
        return sessionStorage.getItem(SESSION_KEY) === 'true';
    });

    const [error, setError] = useState(false);

    const tryUnlock = useCallback(async (pin) => {
        try {
            const data = await apiService.verifyPin(pin);
            if (data.success && data.token) {
                sessionStorage.setItem(SESSION_KEY, 'true');
                sessionStorage.setItem(TOKEN_KEY, data.token);
                setIsUnlocked(true);
                setError(false);
            }
        } catch (err) {
            console.error('Lock Error:', err);
            setError(true);
            setTimeout(() => setError(false), 1200);
        }
    }, []);

    return { isUnlocked, tryUnlock, error };
}
