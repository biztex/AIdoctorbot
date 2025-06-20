const mongoose = require("mongoose")
const User = require("../backend/models/User")
require("dotenv").config()

const initializeDatabase = async () => {
  try {
    // MongoDB接続
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ai_medical_db")
    console.log("MongoDB接続成功")

    // 既存の管理者ユーザーをチェック
    const existingAdmin = await User.findOne({ username: "admin" })

    if (!existingAdmin) {
      // 管理者ユーザーを作成
      const adminUser = new User({
        username: "admin",
        password_hash: "admin123", // pre saveミドルウェアでハッシュ化される
        email: "admin@example.com",
        role: "admin",
      })

      await adminUser.save()
      console.log("管理者ユーザーを作成しました")
    } else {
      console.log("管理者ユーザーは既に存在します")
    }

    // テストユーザーをチェック
    const existingUser = await User.findOne({ username: "user1" })

    if (!existingUser) {
      // テストユーザーを作成
      const testUser = new User({
        username: "user1",
        password_hash: "user123", // pre saveミドルウェアでハッシュ化される
        email: "user1@example.com",
        role: "user",
      })

      await testUser.save()
      console.log("テストユーザーを作成しました")
    } else {
      console.log("テストユーザーは既に存在します")
    }

    console.log("データベース初期化完了")
    process.exit(0)
  } catch (error) {
    console.error("データベース初期化エラー:", error)
    process.exit(1)
  }
}

initializeDatabase()
