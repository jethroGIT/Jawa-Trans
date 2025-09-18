// export default App
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./components/Login"
import App from "./App"

export default function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}
