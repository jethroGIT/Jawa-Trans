import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/auth/Login"
import RegisterPage from "./pages/auth/Register"

import HomePage from "./pages/home/HomePage"
import JadwalPage from "./pages/jadwal/JadwalPage"
import DetailJadwalPage from "./pages/jadwal/DetailJadwalPage"
import PaymentPage from "./pages/pembayaran/PaymentPage"
import TransactionPage from "./pages/pembayaran/TransactionPage"
import TiketPage from "./pages/tiket/TiketPage"
import DetailTiket from "./pages/tiket/DetailTiket"

import StaffLayout from "./layouts/StaffLayout";
import KeuanganLayout from "./layouts/KeuanganLayout";

import IndexBus from "./pages/staff/bus/IndexBus";
import CreateBus from "./pages/staff/bus/CreateBus";
import UpdateBus from "./pages/staff/bus/UpdateBus";

import IndexTipe from "./pages/staff/tipe-bus/IndexTipe";
import CreateTipe from "./pages/staff/tipe-bus/CreateTipe";
import UpdateTipe from "./pages/staff/tipe-bus/UpdateTipe";

import IndexJadwal from "./pages/staff/jadwal/IndexJadwal";
import CreateJadwal from "./pages/staff/jadwal/CreateJadwal";
import UpdateJadwal from "./pages/staff/jadwal/UpdateJadwal";

import IndexTerminal from "./pages/staff/terminal/IndexTerminal";
import CreateTerminal from "./pages/staff/terminal/CreateTerminal";
import UpdateTerminal from "./pages/staff/terminal/UpdateTerminal";

import IndexPenumpang from "./pages/staff/daftarPenumpang/IndexPenumpang";
import DetailJadwalPenumpang from "./pages/staff/daftarPenumpang/DetailJadwalPenumpang";

import ProfileMitra from "./pages/staff/mitra/ProfileMitra";
import LaporanKeuangan from "./pages/keuangan/laporan keuangan/LaporanKeuangan";

import IndexUser from "./pages/admin/user/IndexUser";
import CreateUser from "./pages/admin/user/CreateUser";
import UpdateUser from "./pages/admin/user/UpdateUser";

import IndexFasilitas from "./pages/admin/fasilitas/IndexFasilitas";
import CreateFasilitas from "./pages/admin/fasilitas/CreateFasilitas";
import UpdateFasilitas from "./pages/admin/fasilitas/UpdateFasilitas";

import './styles/index.css';

export default function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="jadwal" element={<JadwalPage />} />
        <Route path="detail-jadwal" element={<DetailJadwalPage />} />
        <Route path="payment" element={<PaymentPage />} />
        <Route path="transaction" element={<TransactionPage />} />
        <Route path="list-tiket" element={<TiketPage />} />
        <Route path="detail-tiket/:idReservasi" element={<DetailTiket />} />

        <Route path="/admin" >
          <Route path="user-mitra" element={<IndexUser />} />
          <Route path="user-mitra/create" element={<CreateUser />} />
          <Route path="user-mitra/:id" element={<UpdateUser />} />

          <Route path="fasilitas" element={<IndexFasilitas />} />
          <Route path="fasilitas/create" element={<CreateFasilitas />} />
          <Route path="fasilitas/:id" element={<UpdateFasilitas />} />
        </Route>

        <Route path="/mitra" >
          <Route path="bus" element={<IndexBus />} />
          <Route path="bus/create" element={<CreateBus />} />
          <Route path="bus/:id" element={<UpdateBus />} />

          <Route path="tipe-bus" element={<IndexTipe />} />
          <Route path="tipe-bus/create" element={<CreateTipe />} />
          <Route path="tipe-bus/:id" element={<UpdateTipe />} />

          <Route path="jadwal" element={<IndexJadwal />} />
          <Route path="jadwal/create" element={<CreateJadwal />} />
          <Route path="jadwal/:id" element={<UpdateJadwal />} />
          <Route path="daftar-penumpang" element={<IndexPenumpang />} />
          <Route path="daftar-penumpang/:id" element={<DetailJadwalPenumpang />} />

          <Route path="terminal" element={<IndexTerminal />} />
          <Route path="terminal/create" element={<CreateTerminal />} />
          <Route path="terminal/:id" element={<UpdateTerminal />} />

          <Route path="profil" element={<ProfileMitra />} />
        </Route>

        <Route path="/keuangan" >
          <Route path="laporan" element={<LaporanKeuangan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}