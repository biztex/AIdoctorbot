"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ExternalLink } from "lucide-react"

export default function DoctorConsultationPage() {
  const router = useRouter()

  const externalServices = [
    {
      name: "yokumiru",
      description: "24時間オンライン医療相談",
      url: "https://yokumiru.com",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "海外部サービス",
      description: "海上労働者専門医療相談",
      url: "#",
      color: "bg-green-600 hover:bg-green-700",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => router.push("/menu")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle>ドクター相談</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-gray-600 text-center mb-6">専門医による相談サービスをご利用いただけます</p>

            {externalServices.map((service, index) => (
              <Button
                key={index}
                onClick={() => window.open(service.url, "_blank")}
                className={`w-full h-16 text-lg ${service.color}`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="text-left">
                    <p className="font-semibold">{service.name}</p>
                    <p className="text-sm opacity-90">{service.description}</p>
                  </div>
                  <ExternalLink className="h-5 w-5" />
                </div>
              </Button>
            ))}

            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>注意:</strong>{" "}
                AI診断は参考情報です。緊急時や症状が重い場合は、すぐに医療機関を受診してください。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
