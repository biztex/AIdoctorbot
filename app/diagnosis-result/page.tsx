"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, AlertTriangle, Info, CheckCircle } from "lucide-react"
import type { AIResponse } from "@/lib/ai-service"

export default function DiagnosisResultPage() {
  const [diagnosis, setDiagnosis] = useState<AIResponse | null>(null)
  const router = useRouter()

  useEffect(() => {
    const savedDiagnosis = sessionStorage.getItem("lastDiagnosis")
    if (!savedDiagnosis) {
      router.push("/ai-consultation")
      return
    }
    setDiagnosis(JSON.parse(savedDiagnosis))
  }, [router])

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

  const getUrgencyIcon = (level: string) => {
    switch (level) {
      case "レベル3":
        return <AlertTriangle className="h-4 w-4" />
      case "レベル2":
        return <Info className="h-4 w-4" />
      case "レベル1":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  if (!diagnosis) return <div>読み込み中...</div>

  const highestUrgency = diagnosis.diagnosis.reduce((prev, current) =>
    prev.urgency_level > current.urgency_level ? prev : current,
  )

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => router.push("/ai-consultation")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle>緊急度判定</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 緊急度レベル表示 */}
            <div className="text-center">
              <div
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg text-2xl font-bold ${getUrgencyColor(highestUrgency.urgency_level)}`}
              >
                {getUrgencyIcon(highestUrgency.urgency_level)}
                緊急{highestUrgency.urgency_level}
              </div>
              <p className="mt-2 text-gray-600">セルフドクターで検査しながら、医師相談をおすすめします</p>
            </div>

            {/* 診断結果一覧 */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">考えられる病名</h3>
              {diagnosis.diagnosis.map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{item.disease}</h4>
                    <Badge className={getUrgencyColor(item.urgency_level)}>{item.urgency_level}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">可能性: {item.probability}%</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${item.probability}%` }}></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* 病名と緊急レベル対比表 */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">病名と緊急レベル対比表（例）</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left">レベル</th>
                      <th className="border border-gray-300 p-2 text-left">病名</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        <Badge className="bg-red-500 text-white">レベル3</Badge>
                      </td>
                      <td className="border border-gray-300 p-2 text-sm">
                        肺炎、急性腹膜炎、敗血症、髄膜炎、心筋炎、COVID-19（重症）、インフルエンザ脳症、呼吸不全、百日咳（重症化）、SARS/MERS
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        <Badge className="bg-orange-500 text-white">レベル2</Badge>
                      </td>
                      <td className="border border-gray-300 p-2 text-sm">
                        インフルエンザ、COVID-19（軽〜中等症）、マイコプラズマ肺炎、急性気管支炎、RSウイルス感染症、感染性胃腸炎、咽頭炎、扁桃結膜熱（咽頭結膜熱）
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">
                        <Badge className="bg-green-500 text-white">レベル1</Badge>
                      </td>
                      <td className="border border-gray-300 p-2 text-sm">
                        かぜ（急性上気道炎）、アレルギー性鼻炎、咽頭アレルギー、皮膚炎、季節性アレルギー、軽度の脱水症状、嘔吐症、環境変化による体調不良、病的ストレス由来の発熱、ウイルス性胃腸炎（軽症）
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/doctor-consultation")}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                ドクター相談へ進む
              </Button>
              <Button onClick={() => router.push("/menu")} variant="outline" className="w-full">
                トップに戻る
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
