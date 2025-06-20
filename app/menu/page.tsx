"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, UserCheck, LogOut } from "lucide-react"

export default function MenuPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (!user) return <div>読み込み中...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold text-blue-600">Maritime Smart Care360</CardTitle>
            <p className="text-sm text-gray-600">ようこそ、{user.username}さん</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* ドクターアイコン */}
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 bg-teal-100 rounded-lg flex items-center justify-center">
                <Bot className="w-16 h-16 text-teal-600" />
              </div>
            </div>

            <Button
              onClick={() => router.push("/ai-consultation")}
              className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
            >
              <Bot className="mr-2" />
              AI問診
            </Button>

            <Button
              onClick={() => router.push("/doctor-consultation")}
              variant="outline"
              className="w-full h-12 text-lg"
            >
              <UserCheck className="mr-2" />
              ドクター相談
            </Button>

            {user.role === "admin" && (
              <Button onClick={() => router.push("/admin")} variant="secondary" className="w-full h-12 text-lg">
                管理者ダッシュボード
              </Button>
            )}

            <Button onClick={handleLogout} variant="destructive" className="w-full">
              <LogOut className="mr-2" />
              ログアウト
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
