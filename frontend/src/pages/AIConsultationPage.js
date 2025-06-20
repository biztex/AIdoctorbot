"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  VStack,
  HStack,
  Input,
  Text,
  Avatar,
  Flex,
  IconButton,
  Spinner,
} from "@chakra-ui/react"
import { FaArrowLeft, FaPaperPlane, FaRobot, FaUser } from "react-icons/fa"
import axios from "axios"

const AIConsultationPage = () => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      content: "こんにちは！私はAIドクターです。どのような症状でお困りですか？",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()
  const sessionId = useRef(Date.now().toString())

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return

    const userMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setLoading(true)

    try {
      const chatHistory = messages.map((m) => `${m.sender}: ${m.content}`)

      // 症状に関する質問かどうかを判定
      const isSymptomQuery =
        inputMessage.includes("痛い") ||
        inputMessage.includes("熱") ||
        inputMessage.includes("症状") ||
        inputMessage.includes("具合")

      let aiResponse

      if (isSymptomQuery) {
        const response = await axios.post("/api/ai/diagnose", {
          symptoms: inputMessage,
          chatHistory,
        })

        const diagnosis = response.data
        aiResponse = `${diagnosis.summary}\n\n診断結果を詳しく見るには「診断結果を表示」とお伝えください。`

        // 診断結果をセッションストレージに保存
        sessionStorage.setItem("lastDiagnosis", JSON.stringify(diagnosis))
      } else if (inputMessage.includes("診断結果")) {
        navigate("/diagnosis-result")
        return
      } else {
        const response = await axios.post("/api/ai/chat", {
          message: inputMessage,
          context: chatHistory,
          sessionId: sessionId.current,
        })
        aiResponse = response.data.response
      }

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      const errorMessage = {
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Box h="100vh" bg="gray.50">
      <Card h="100%" borderRadius="none">
        <CardHeader borderBottom="1px" borderColor="gray.200">
          <HStack spacing={3}>
            <IconButton icon={<FaArrowLeft />} variant="ghost" onClick={() => navigate("/menu")} />
            <Avatar bg="teal.500" icon={<FaRobot />} size="sm" />
            <Heading size="md">AI Doctor</Heading>
          </HStack>
        </CardHeader>

        <CardBody p={0} display="flex" flexDirection="column" h="calc(100vh - 100px)">
          {/* メッセージエリア */}
          <Box flex="1" overflowY="auto" p={4}>
            <VStack spacing={4} align="stretch">
              {messages.map((message) => (
                <Flex key={message.id} justify={message.sender === "user" ? "flex-end" : "flex-start"}>
                  <HStack spacing={2} maxW="80%" flexDirection={message.sender === "user" ? "row-reverse" : "row"}>
                    <Avatar
                      size="sm"
                      bg={message.sender === "user" ? "brand.500" : "teal.100"}
                      color={message.sender === "user" ? "white" : "teal.600"}
                      icon={message.sender === "user" ? <FaUser /> : <FaRobot />}
                    />
                    <Box
                      bg={message.sender === "user" ? "brand.500" : "white"}
                      color={message.sender === "user" ? "white" : "black"}
                      p={3}
                      borderRadius="lg"
                      border={message.sender === "ai" ? "1px solid" : "none"}
                      borderColor="gray.200"
                    >
                      <Text whiteSpace="pre-wrap">{message.content}</Text>
                      <Text fontSize="xs" mt={1} color={message.sender === "user" ? "blue.100" : "gray.500"}>
                        {message.timestamp.toLocaleTimeString()}
                      </Text>
                    </Box>
                  </HStack>
                </Flex>
              ))}

              {loading && (
                <Flex justify="flex-start">
                  <HStack spacing={2}>
                    <Avatar bg="teal.100" color="teal.600" icon={<FaRobot />} size="sm" />
                    <Box bg="white" border="1px solid" borderColor="gray.200" p={3} borderRadius="lg">
                      <HStack>
                        <Spinner size="xs" />
                        <Text fontSize="sm">入力中...</Text>
                      </HStack>
                    </Box>
                  </HStack>
                </Flex>
              )}

              <div ref={messagesEndRef} />
            </VStack>
          </Box>

          {/* 入力エリア */}
          <Box borderTop="1px" borderColor="gray.200" p={4}>
            <HStack spacing={2}>
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="症状を入力してください..."
                disabled={loading}
                flex="1"
              />
              <IconButton
                icon={<FaPaperPlane />}
                onClick={handleSendMessage}
                isDisabled={loading || !inputMessage.trim()}
                colorScheme="brand"
              />
            </HStack>
          </Box>
        </CardBody>
      </Card>
    </Box>
  )
}

export default AIConsultationPage
