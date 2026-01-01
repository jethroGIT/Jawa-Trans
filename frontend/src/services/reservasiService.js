import { apiRequest } from "./api";

function orderJadwal({ idUser, idJadwal, penumpang, namaPenumpang, kursi, method, customer, hargaSatuan, totalHarga }) {
    return apiRequest("reservasi/pay", "POST", { idUser, idJadwal, penumpang, namaPenumpang, kursi, method, customer, hargaSatuan, totalHarga });
}

export default {
    orderJadwal,
}