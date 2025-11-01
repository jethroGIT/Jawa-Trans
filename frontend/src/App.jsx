import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/auth/Login"
import RegisterPage from "./pages/auth/Register"
import HomePage from "./pages/home/HomePage"
import JadwalPage from "./pages/jadwal/JadwalPage"
import './styles/index.css';

export default function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jadwal" element={<JadwalPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  )
}