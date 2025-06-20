const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { Database } = require("../config/database")

const router = express.Router()

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: "ユーザー名とパスワードが必要です" })
    }

    const user = await Database.authenticateUser(username, password)

    if (!user) {
      return res.status(401).json({ error: "ログイン情報が正しくありません" })
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" },
    )

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("ログインエラー:", error)
    res.status(500).json({ error: "サーバーエラーが発生しました" })
  }
})

module.exports = router
