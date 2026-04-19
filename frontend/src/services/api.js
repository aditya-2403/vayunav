const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const API_KEY = import.meta.env.VITE_API_KEY;

/**
 * Authenticated fetch wrapper.
 * Automatically attaches the X-API-Key header to every request.
 */
const apiFetch = (url, options = {}) => {
    return fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            'X-API-Key': API_KEY,
        },
    });
};

export const apiService = {
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
        // The proxy-pdf URL is used directly in an <iframe> src, so we embed
        // the key as a query param as headers cannot be set on iframe loads.
        return `${API_BASE_URL}/proxy-pdf?url=${encodeURIComponent(pdfUrl)}&apiKey=${API_KEY}`;
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
