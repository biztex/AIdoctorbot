const User = require("../models/User")
const AIDiagnosis = require("../models/AIDiagnosis")
const ChatHistory = require("../models/ChatHistory")

class DatabaseService {
  static async authenticateUser(username, password) {
    try {
      const user = await User.findOne({ username })
      if (!user) return null

      const isValidPassword = await user.comparePassword(password)
      if (!isValidPassword) return null

      return {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email,
      }
    } catch (error) {
      console.error("認証エラー:", error)
      return null
    }
  }

  static async createUser(userData) {
    try {
      const user = new User(userData)
      await user.save()
      return {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email,
      }
    } catch (error) {
      console.error("ユーザー作成エラー:", error)
      throw error
    }
  }

  static async saveDiagnosis(userId, symptoms, result) {
    try {
      const diagnosis = new AIDiagnosis({
        user_id: userId,
        symptoms,
        diagnosis_result: result,
        urgency_level:
          result.diagnosis[0]?.urgency_level === "レベル3"
            ? 3
            : result.diagnosis[0]?.urgency_level === "レベル2"
              ? 2
              : 1,
        probability: result.diagnosis[0]?.probability || 0,
      })

      await diagnosis.save()
      return diagnosis
    } catch (error) {
      console.error("診断結果保存エラー:", error)
      throw error
    }
  }

  static async getAllUsers() {
    try {
      const users = await User.find({}, "-password_hash").sort({ createdAt: -1 })
      return users.map((user) => ({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.createdAt,
      }))
    } catch (error) {
      console.error("ユーザー取得エラー:", error)
      throw error
    }
  }

  static async getAllDiagnoses() {
    try {
      const diagnoses = await AIDiagnosis.find({}).populate("user_id", "username").sort({ createdAt: -1 })

      return diagnoses.map((diagnosis) => ({
        id: diagnosis._id,
        user_id: diagnosis.user_id._id,
        username: diagnosis.user_id.username,
        symptoms: diagnosis.symptoms,
        diagnosis: diagnosis.diagnosis_result.diagnosis[0]?.disease || "診断結果なし",
        urgency_level: diagnosis.diagnosis_result.diagnosis[0]?.urgency_level || "レベル1",
        created_at: diagnosis.createdAt,
      }))
    } catch (error) {
      console.error("診断結果取得エラー:", error)
      throw error
    }
  }

  static async saveChatMessage(userId, sessionId, message, sender) {
    try {
      const chatMessage = new ChatHistory({
        user_id: userId,
        session_id: sessionId,
        message,
        sender,
      })

      await chatMessage.save()
      return chatMessage
    } catch (error) {
      console.error("チャットメッセージ保存エラー:", error)
      throw error
    }
  }

  static async getChatHistory(userId, sessionId) {
    try {
      const history = await ChatHistory.find({
        user_id: userId,
        session_id: sessionId,
      }).sort({ createdAt: 1 })

      return history
    } catch (error) {
      console.error("チャット履歴取得エラー:", error)
      throw error
    }
  }
}

module.exports = DatabaseService
