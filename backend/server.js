const express = require("express")
const cors = require("cors")
require("dotenv").config()

const authRoutes = require("./routes/auth")
const aiRoutes = require("./routes/ai")
const adminRoutes = require("./routes/admin")
const userRoutes = require("./routes/users")

const app = express()
const PORT = process.env.PORT || 5000

// ミドルウェア
app.use(cors())
app.use(express.json())

// ルート
app.use("/api/auth", authRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/users", userRoutes)

// ヘルスチェック
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "AI医療相談システム バックエンド稼働中" })
})

app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で稼働しています`)
})
