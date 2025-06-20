const express = require("express")
const AIService = require("../services/aiService")
const DatabaseService = require("../services/databaseService")
const { authMiddleware } = require("../middleware/auth")

const router = express.Router()

router.post("/diagnose", authMiddleware, async (req, res) => {
  try {
    const { symptoms, chatHistory = [] } = req.body
    const userId = req.user.id

    const diagnosis = await AIService.diagnoseSymptoms(symptoms, chatHistory)

    // 診断結果をデータベースに保存
    await DatabaseService.saveDiagnosis(userId, symptoms, diagnosis)

    res.json(diagnosis)
  } catch (error) {
    console.error("AI診断エラー:", error)
    res.status(500).json({ error: "AI診断に失敗しました" })
  }
})

router.post("/chat", authMiddleware, async (req, res) => {
  try {
    const { message, context = [], sessionId } = req.body
    const userId = req.user.id

    const response = await AIService.chatWithAI(message, context)

    // チャットメッセージを保存
    await DatabaseService.saveChatMessage(userId, sessionId, message, "user")
    await DatabaseService.saveChatMessage(userId, sessionId, response, "ai")

    res.json({ response })
  } catch (error) {
    console.error("AIチャットエラー:", error)
    res.status(500).json({ error: "AIチャットに失敗しました" })
  }
})

router.get("/chat-history/:sessionId", authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params
    const userId = req.user.id

    const history = await DatabaseService.getChatHistory(userId, sessionId)
    res.json(history)
  } catch (error) {
    console.error("チャット履歴取得エラー:", error)
    res.status(500).json({ error: "チャット履歴の取得に失敗しました" })
  }
})

module.exports = router
