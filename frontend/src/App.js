import { Routes, Route, Navigate } from "react-router-dom"
import { Box } from "@chakra-ui/react"
import { AuthProvider } from "./contexts/AuthContext"
import LoginPage from "./pages/LoginPage"
import MenuPage from "./pages/MenuPage"
import AIConsultationPage from "./pages/AIConsultationPage"
import DiagnosisResultPage from "./pages/DiagnosisResultPage"
import DoctorConsultationPage from "./pages/DoctorConsultationPage"
import AdminDashboard from "./pages/AdminDashboard"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <AuthProvider>
      <Box minH="100vh" bg="gray.50">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/menu" replace />} />
          <Route
            path="/menu"
            element={
              <ProtectedRoute>
                <MenuPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-consultation"
            element={
              <ProtectedRoute>
                <AIConsultationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/diagnosis-result"
            element={
              <ProtectedRoute>
                <DiagnosisResultPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor-consultation"
            element={
              <ProtectedRoute>
                <DoctorConsultationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Box>
    </AuthProvider>
  )
}

export default App
