import { Routes, Route, BrowserRouter } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Recipes from "./pages/Recipes"
import MealDetail from "./pages/MealDetail"
import UserPage from "./pages/UserPage"
import { AuthProvider } from "./contexts/AuthContext"
import SetProfile from "./pages/SetProfile"
import Favourite from "./pages/Favourite"
import MarketPlace from "./pages/Marketplace"

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/recipes' element={<Recipes />} />
          <Route path='/mealDetails/:id' element={<MealDetail />} />
          <Route path='/userpage' element={<UserPage />} />
          <Route path='/setProfile' element={<SetProfile />} />
          <Route path='/favourites' element={<Favourite />} />
          <Route path='/marketplace' element={<MarketPlace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}