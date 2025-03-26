import { Routes, Route, Navigate } from "react-router-dom"
import { AppProvider } from "./context/AppContext"
import { ThemeProvider } from "./components/theme-provider"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import HomePage from "./pages/HomePage"
import ProtectedRoute from "./components/ProtectedRoute"
import Footer from "./components/Footer"

export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <AppProvider>
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </AppProvider>
    </ThemeProvider>
  )
}

