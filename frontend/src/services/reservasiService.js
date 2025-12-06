import { apiRequest } from "./api";

function orderJadwal({ idUser, idJadwal, penumpang, namaPenumpang, kursi, method, customer, totalHarga }) {
    return apiRequest("reservasi/pay", "POST", { idUser, idJadwal, penumpang, namaPenumpang, kursi, method, customer, totalHarga });
}

export default {
    orderJadwal,
}