const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "")

  if (!token) {
    return res.status(401).json({ error: "認証トークンがありません" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: "無効なトークンです" })
  }
}

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "管理者権限が必要です" })
  }
  next()
}

module.exports = { authMiddleware, adminMiddleware }
