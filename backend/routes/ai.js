const express = require("express")
const AIService = require("../services/aiService")
const { Database } = require("../config/database")
const { authMiddleware } = require("../middleware/auth")

const router = express.Router()

router.post("/diagnose", authMiddleware, async (req, res) => {
  try {
    const { symptoms, chatHistory = [] } = req.body
    const userId = req.user.id

    const diagnosis = await AIService.diagnoseSymptoms(symptoms, chatHistory)

    // 診断結果をデータベースに保存
    await Database.saveDiagnosis(userId, symptoms, diagnosis)

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
    await Database.saveChatMessage(userId, sessionId, message, "user")
    await Database.saveChatMessage(userId, sessionId, response, "ai")

    res.json({ response })
  } catch (error) {
    console.error("AIチャットエラー:", error)
    res.status(500).json({ error: "AIチャットに失敗しました" })
  }
})

module.exports = router
