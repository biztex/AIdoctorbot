"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // トークンの確認
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")

    if (token && user) {
      const userData = JSON.parse(user)
      if (userData.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/menu")
      }
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Maritime Smart Care360</h1>
        <p className="text-gray-600">システムを初期化しています...</p>
      </div>
    </div>
  )
}
