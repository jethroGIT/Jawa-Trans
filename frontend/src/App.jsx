// import { Jawa, Kota, Gubernur, PaymentChecker } from './components/Jawa'

// function App() {
//   // mengirim data dalam bentuk objek
//   const gubernur = {
//     nama1: "Jokowi",
//     nama2: "Prabowo",
//     nama3: "Teddy"
//   }

//   const payment = [
//     {
//       id: 1,
//       quantity: 2,
//       amount: 10000,
//       status: "success"
//     },
//     {
//       id: 2,
//       quantity: 2,
//       amount: 10000,
//       status: "pending"
//     },
//     {
//       id: 3,
//       quantity: 2,
//       amount: 10000,
//       status: "pending"
//     }
//   ]

//   const [data, setData] = useState(0)
//   function tambahDataHandler() {
//     setData(data + 1)
//   }

//   return (
//     <>
//       <Jawa />
//       <Kota />
//       <Gubernur nama1={"Dedi Mulyadi"} nama2={"Sri Sultan Hamengkubuwono"} nama3={"Khofifah"} />
//       <Gubernur nama1={gubernur.nama1} nama2={gubernur.nama2} nama3={gubernur.nama3} />

//       <PaymentChecker payments={payment} />

//       <button onClick={tambahDataHandler}>Tambah data</button>
//       <p>data: {data}</p>
//     </>
//   )
// }

// export default App
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./Login"
import App from "./App"

export default function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<App />} />
      </Routes>
    </BrowserRouter>
  )
}
