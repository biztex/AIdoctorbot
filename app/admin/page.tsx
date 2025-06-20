"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Activity, BarChart3, ArrowLeft } from "lucide-react"
import { Database } from "@/lib/database"

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([])
  const [diagnoses, setDiagnoses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "admin") {
      router.push("/menu")
      return
    }

    setUser(parsedUser)
    loadData()
  }, [router])

  const loadData = async () => {
    try {
      const db = Database.getInstance()
      const [usersData, diagnosesData] = await Promise.all([db.getAllUsers(), db.getAllDiagnoses()])

      setUsers(usersData)
      setDiagnoses(diagnosesData)
    } catch (error) {
      console.error("データ読み込みエラー:", error)
    } finally {
      setLoading(false)
    }
  }

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case "レベル3":
        return "bg-red-500 text-white"
      case "レベル2":
        return "bg-orange-500 text-white"
      case "レベル1":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  if (!user || loading) return <div>読み込み中...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => router.push("/menu")}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="text-2xl">管理者ダッシュボード</CardTitle>
              </div>
              <p className="text-sm text-gray-600">ようこそ、{user.username}さん</p>
            </div>
          </CardHeader>
        </Card>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">総ユーザー数</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Activity className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">総診断数</p>
                  <p className="text-2xl font-bold">{diagnoses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <BarChart3 className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">今日の診断数</p>
                  <p className="text-2xl font-bold">
                    {diagnoses.filter((d) => new Date(d.createdAt).toDateString() === new Date().toDateString()).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* タブコンテンツ */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">ユーザー管理</TabsTrigger>
            <TabsTrigger value="diagnoses">診断結果</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>ユーザー一覧</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">ID</th>
                        <th className="text-left p-2">ユーザー名</th>
                        <th className="text-left p-2">メール</th>
                        <th className="text-left p-2">役割</th>
                        <th className="text-left p-2">登録日</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b">
                          <td className="p-2">{user.id}</td>
                          <td className="p-2">{user.username}</td>
                          <td className="p-2">{user.email}</td>
                          <td className="p-2">
                            <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                          </td>
                          <td className="p-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diagnoses">
            <Card>
              <CardHeader>
                <CardTitle>AI診断結果一覧</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {diagnoses.map((diagnosis) => (
                    <Card key={diagnosis.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">ユーザー: {diagnosis.username}</p>
                          <p className="text-sm text-gray-600">症状: {diagnosis.symptoms}</p>
                        </div>
                        <Badge className={getUrgencyColor(diagnosis.urgencyLevel)}>{diagnosis.urgencyLevel}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm">診断: {diagnosis.diagnosis}</p>
                        <p className="text-xs text-gray-500">{new Date(diagnosis.createdAt).toLocaleString()}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
