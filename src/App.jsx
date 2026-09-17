import { Routes, Route, BrowserRouter } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import MarketPlace from "./pages/Marketplace"

import { AuthProvider } from "./contexts/AuthContext"
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/marketplace' element={<MarketPlace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}