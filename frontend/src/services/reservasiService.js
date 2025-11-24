import { apiRequest } from "./api";

function orderJadwal({ idUSer, idJadwal, penumpang, namaPenumpang, kursi }) {
    return apiRequest("reservasi", "POST", { idUSer, idJadwal, penumpang, namaPenumpang, kursi });
}

export default {
    orderJadwal,
}