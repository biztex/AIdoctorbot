const express = require("express")
const jwt = require("jsonwebtoken")
const DatabaseService = require("../services/databaseService")

const router = express.Router()

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: "ユーザー名とパスワードが必要です" })
    }

    const user = await DatabaseService.authenticateUser(username, password)

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

router.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: "ユーザー名とパスワードが必要です" })
    }

    const userData = {
      username,
      password_hash: password, // pre saveミドルウェアでハッシュ化される
      email,
      role: "user",
    }

    const user = await DatabaseService.createUser(userData)

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" },
    )

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "ユーザー名が既に存在します" })
    }
    console.error("登録エラー:", error)
    res.status(500).json({ error: "サーバーエラーが発生しました" })
  }
})

module.exports = router
