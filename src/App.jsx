import { Routes, Route, BrowserRouter } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import MarketPlace from "./pages/Marketplace"
import MealDetail from "./pages/MealDetail"
import UserPage from "./pages/UserPage"
import { AuthProvider } from "./contexts/AuthContext"
import SetProfile from "./pages/SetProfile"

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/marketplace' element={<MarketPlace />} />
          <Route path='/mealDetails/:id' element={<MealDetail />} />
          <Route path='/userpage' element={<UserPage />} />
          <Route path='/setProfile' element={<SetProfile />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}