const express = require("express")
const { authMiddleware } = require("../middleware/auth")

const router = express.Router()

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    role: req.user.role,
  })
})

module.exports = router
