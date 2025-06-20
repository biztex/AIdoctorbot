"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Spinner, Center } from "@chakra-ui/react"

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/menu" replace />
  }

  return children
}

export default ProtectedRoute
