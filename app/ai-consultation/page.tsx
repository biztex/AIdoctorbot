"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, User, ArrowLeft, Send } from "lucide-react"
import { AIService } from "@/lib/ai-service"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

export default function AIConsultationPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "こんにちは！私はAIドクターです。どのような症状でお困りですか？",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setLoading(true)

    try {
      const aiService = AIService.getInstance()
      const chatHistory = messages.map((m) => `${m.sender}: ${m.content}`)

      // 症状に関する質問かどうかを判定
      const isSymptomQuery =
        inputMessage.includes("痛い") ||
        inputMessage.includes("熱") ||
        inputMessage.includes("症状") ||
        inputMessage.includes("具合")

      let aiResponse: string

      if (isSymptomQuery) {
        const diagnosis = await aiService.diagnoseSymptoms(inputMessage, chatHistory)
        aiResponse = `${diagnosis.summary}\n\n診断結果を詳しく見るには「診断結果を表示」とお伝えください。`

        // 診断結果をセッションストレージに保存
        sessionStorage.setItem("lastDiagnosis", JSON.stringify(diagnosis))
      } else if (inputMessage.includes("診断結果")) {
        router.push("/diagnosis-result")
        return
      } else {
        aiResponse = await aiService.chatWithAI(inputMessage, chatHistory)
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "申し訳ございません。システムエラーが発生しました。",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!user) return <div>読み込み中...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <Card className="h-screen rounded-none">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push("/menu")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Bot className="h-8 w-8 text-blue-600" />
            <CardTitle>AI Doctor</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col h-[calc(100vh-140px)] p-0">
          {/* メッセージエリア */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start gap-2 max-w-[80%] ${
                    message.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === "user" ? "bg-blue-600 text-white" : "bg-teal-100 text-teal-600"
                    }`}
                  >
                    {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender === "user" ? "bg-blue-600 text-white" : "bg-white border"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2">
                  <Bot className="h-8 w-8 text-teal-600" />
                  <div className="bg-white border rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 入力エリア */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="症状を入力してください..."
                disabled={loading}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={loading || !inputMessage.trim()} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
