import { useState, useEffect } from 'react';
import jadwalService from '../services/jadwalService';

export function useJadwal() {
    const [jadwal, setJadwal] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchJadwal() {
            try {
                setLoading(true);
                const response = await jadwalService.getAllJadwal();
                setJadwal(response.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchJadwal();
    }, []);

    return { jadwal, loading, error };
}
