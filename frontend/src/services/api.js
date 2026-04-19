const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const API_KEY = import.meta.env.VITE_API_KEY;

/**
 * Authenticated fetch wrapper.
 * Automatically attaches the X-API-Key and Authorization (JWT) headers to every request.
 */
const apiFetch = (url, options = {}) => {
    const token = sessionStorage.getItem('vayunav_token');
    
    return fetch(url, {
        ...options,
        headers: {
            'X-API-Key': API_KEY,
            'Authorization': token ? `Bearer ${token}` : '',
            ...(options.headers || {}),
        },
    });
};

export const apiService = {
    verifyPin: async (pin) => {
        const res = await fetch(`${API_BASE_URL}/verify-pin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY,
            },
            body: JSON.stringify({ pin }),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Verification failed');
        }
        return res.json(); // { success, token }
    },

    getAirports: async () => {
        const res = await apiFetch(`${API_BASE_URL}/airports`);
        if (!res.ok) throw new Error("Failed");
        return res.json();
    },

    getCharts: async (airportCode) => {
        const res = await apiFetch(`${API_BASE_URL}/charts/${airportCode}`);
        if (!res.ok) throw new Error("Failed");
        return res.json();
    },

    getProxyUrl: (pdfUrl) => {
        const token = sessionStorage.getItem('vayunav_token');
        return `${API_BASE_URL}/proxy-pdf?url=${encodeURIComponent(pdfUrl)}&apiKey=${API_KEY}&token=${token}`;
    },

    getWeather: async (airportCode) => {
        try {
            const res = await apiFetch(`${API_BASE_URL}/metar/${airportCode}`);
            const text = await res.text();
            return { metar: text || 'METAR NOT AVAILABLE' };
        } catch (error) {
            console.error('Failed to fetch weather', error);
            return { metar: 'WEATHER DATA OFFLINE' };
        }
    }
};
