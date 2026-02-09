import { apiRequest, apiRequestWithAuth } from "../api";
import authService from "../authService";

async function fetchReservasiByMitra() {
    try {
        const user = authService.getUser();

        if (!user?.idMitra) {
            throw new Error('ID Mitra tidak ditemukan');
        }

        const response = await apiRequestWithAuth(`mitra/${user.idMitra}/keuangan`, "GET");
        console.log('Response data:', response.data);

        return response.data || [];
    } catch (error) {
        throw new Error(error.message || 'Terjadi kesalahan saat mengambil data reservasi');
    }
}

async function fetchReservasiByJadwal(idJadwal) {
    try {
        const response = await apiRequestWithAuth(`mitra/keuangan/${idJadwal}`, "GET");
        console.log('Response data:', response.data);

        return response.data || [];
    } catch (error) {
        throw new Error(error.message || 'Terjadi kesalahan saat mengambil data reservasi');
    }
}

export default {
    fetchReservasiByMitra,
    fetchReservasiByJadwal
};