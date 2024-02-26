import { Route, Routes } from "react-router-dom"
import Login from "./components/Login/Login"
import Register from "./components/Register/Register"
import LandingPage from "./components/LandingPage/LandingPage"
import AdminPage from "./components/AdminPage/AdminPage"
import Header from "./components/Header/Header"
import VotingPage from "./components/VotingPage/VotingPage"

function App() {

  return (
    < >
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/votingPage" element={<VotingPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </>
  )
}

export default App
