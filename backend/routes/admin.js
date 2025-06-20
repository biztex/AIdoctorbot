const express = require("express")
const { Database } = require("../config/database")
const { authMiddleware, adminMiddleware } = require("../middleware/auth")

const router = express.Router()

router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await Database.getAllUsers()
    res.json(users)
  } catch (error) {
    console.error("ユーザー取得エラー:", error)
    res.status(500).json({ error: "ユーザー情報の取得に失敗しました" })
  }
})

router.get("/diagnoses", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const diagnoses = await Database.getAllDiagnoses()
    res.json(diagnoses)
  } catch (error) {
    console.error("診断結果取得エラー:", error)
    res.status(500).json({ error: "診断結果の取得に失敗しました" })
  }
})

module.exports = router
