const { Pool } = require("pg")

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

// モックデータ（開発用）
const mockUsers = [
  {
    id: 1,
    username: "admin",
    password_hash: "$2b$10$rQZ8kHp0rJ0wVXjhKQxKxe",
    role: "admin",
    email: "admin@example.com",
  },
  {
    id: 2,
    username: "user1",
    password_hash: "$2b$10$rQZ8kHp0rJ0wVXjhKQxKxe",
    role: "user",
    email: "user1@example.com",
  },
]

const mockDiagnoses = [
  {
    id: 1,
    user_id: 2,
    username: "user1",
    symptoms: "頭痛と発熱",
    diagnosis_result: {
      diagnosis: [
        {
          disease: "インフルエンザ（疑い）",
          probability: 75,
          urgency_level: "レベル2",
          recommendations: ["水分補給", "安静", "解熱剤の使用"],
        },
      ],
      summary: "インフルエンザの可能性が高いです。",
    },
    urgency_level: 2,
    created_at: new Date(),
  },
]

class Database {
  static async authenticateUser(username, password) {
    // 実際の実装ではデータベースクエリを使用
    const user = mockUsers.find((u) => u.username === username)
    return user ? { id: user.id, username: user.username, role: user.role, email: user.email } : null
  }

  static async saveDiagnosis(userId, symptoms, result) {
    const diagnosis = {
      id: Date.now(),
      user_id: userId,
      symptoms,
      diagnosis_result: result,
      urgency_level:
        result.diagnosis[0]?.urgency_level === "レベル3" ? 3 : result.diagnosis[0]?.urgency_level === "レベル2" ? 2 : 1,
      created_at: new Date(),
    }
    mockDiagnoses.push(diagnosis)
    return diagnosis
  }

  static async getAllUsers() {
    return mockUsers.map((u) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role,
      created_at: new Date(),
    }))
  }

  static async getAllDiagnoses() {
    return mockDiagnoses.map((d) => ({
      ...d,
      username: mockUsers.find((u) => u.id === d.user_id)?.username,
    }))
  }

  static async saveChatMessage(userId, sessionId, message, sender) {
    console.log("チャットメッセージを保存:", { userId, sessionId, message, sender })
    return { id: Date.now(), userId, sessionId, message, sender, created_at: new Date() }
  }
}

module.exports = { Database, pool }
