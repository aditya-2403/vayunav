import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { API_MESSAGES } from '../constants/messages';

export function useAirports() {
    const [airports, setAirports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const fetchAirports = async () => {
            try {
                setLoading(true);
                const data = await apiService.getAirports();
                if (isMounted) {
                    setAirports(data || []);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) setError(API_MESSAGES.ERR_FETCH_AIRPORTS);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchAirports();
        return () => { isMounted = false; };
    }, []);

    return { airports, loading, error };
}

export function useCharts(airportCode) {
    const [charts, setCharts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        
        if (!airportCode) {
            setCharts([]);
            setError(null);
            return;
        }

        const fetchCharts = async () => {
            try {
                setLoading(true);
                const data = await apiService.getCharts(airportCode);
                if (isMounted) {
                    setCharts(data || []);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) setError(API_MESSAGES.ERR_FETCH_CHARTS);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchCharts();
        return () => { isMounted = false; };
    }, [airportCode]);

    return { charts, loading, error };
}
