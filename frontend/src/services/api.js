const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiService = {
    getAirports: async () => {
        const res = await fetch(`${API_BASE_URL}/airports`);
        if (!res.ok) throw new Error("Failed");
        return res.json();
    },

    getCharts: async (airportCode) => {
        const res = await fetch(`${API_BASE_URL}/charts/${airportCode}`);
        if (!res.ok) throw new Error("Failed");
        return res.json();
    },

    getProxyUrl: (pdfUrl) => {
        return `${API_BASE_URL}/proxy-pdf?url=${encodeURIComponent(pdfUrl)}`;
    }
};
