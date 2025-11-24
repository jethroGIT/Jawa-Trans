import { useState, useEffect, useCallback } from 'react';
import jadwalService from '../services/jadwalService';

export function useJadwal(idJadwal = null) {
    const [jadwal, setJadwal] = useState(idJadwal ? null : []);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchJadwal = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await jadwalService.getAllJadwal();
            setJadwal(response.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchJadwalById = useCallback(async (id) => {
        try {
            setLoading(true);
            setError(null);
            const response = await jadwalService.showJadwal(id);
            setJadwal(response.data || null);
        } catch (err) {
            setError(err.message);
            setJadwal(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (idJadwal) {
            fetchJadwalById(idJadwal);
        } else {
            fetchJadwal();
        }
    }, [idJadwal, fetchJadwal, fetchJadwalById]);

    return {
        jadwal,
        loading,
        error,
        fetchJadwal,
        fetchJadwalById
    };
}