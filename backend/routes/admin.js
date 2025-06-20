const express = require("express")
const DatabaseService = require("../services/databaseService")
const { authMiddleware, adminMiddleware } = require("../middleware/auth")

const router = express.Router()

router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await DatabaseService.getAllUsers()
    res.json(users)
  } catch (error) {
    console.error("ユーザー取得エラー:", error)
    res.status(500).json({ error: "ユーザー情報の取得に失敗しました" })
  }
})

router.get("/diagnoses", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const diagnoses = await DatabaseService.getAllDiagnoses()
    res.json(diagnoses)
  } catch (error) {
    console.error("診断結果取得エラー:", error)
    res.status(500).json({ error: "診断結果の取得に失敗しました" })
  }
})

router.get("/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await DatabaseService.getAllUsers()
    const diagnoses = await DatabaseService.getAllDiagnoses()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todaysDiagnoses = diagnoses.filter((d) => new Date(d.created_at) >= today)

    const stats = {
      totalUsers: users.length,
      totalDiagnoses: diagnoses.length,
      todaysDiagnoses: todaysDiagnoses.length,
      urgencyLevels: {
        level1: diagnoses.filter((d) => d.urgency_level === "レベル1").length,
        level2: diagnoses.filter((d) => d.urgency_level === "レベル2").length,
        level3: diagnoses.filter((d) => d.urgency_level === "レベル3").length,
      },
    }

    res.json(stats)
  } catch (error) {
    console.error("統計取得エラー:", error)
    res.status(500).json({ error: "統計情報の取得に失敗しました" })
  }
})

module.exports = router
