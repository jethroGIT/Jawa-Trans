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
import './styles/index.css';

export default function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/jadwal" element={<JadwalPage />} />
        <Route path="/detail-jadwal" element={<DetailJadwalPage />}/>
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/transaction" element={<TransactionPage />} />
        <Route path="/list-tiket" element={<TiketPage />} />
        <Route path="/detail-tiket" element={<DetailTiket />} />
      </Routes>
    </BrowserRouter>
  )
}