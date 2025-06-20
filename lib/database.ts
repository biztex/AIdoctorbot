// 実際の実装ではNeonやSupabaseを使用
export class Database {
  private static instance: Database

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  async authenticateUser(username: string, password: string) {
    // モックデータ - 実際の実装ではデータベースクエリ
    const mockUsers = [
      { id: 1, username: "admin", password_hash: "$2b$10$rQZ8kHp0rJ0wVXjhKQxKxe", role: "admin" },
      { id: 2, username: "user1", password_hash: "$2b$10$rQZ8kHp0rJ0wVXjhKQxKxe", role: "user" },
    ]

    const user = mockUsers.find((u) => u.username === username)
    if (!user) return null

    // パスワード検証（実際の実装）
    // const isValid = await verifyPassword(password, user.password_hash)
    // if (!isValid) return null

    return { id: user.id, username: user.username, role: user.role }
  }

  async saveDiagnosis(userId: number, symptoms: string, result: any) {
    // データベースに診断結果を保存
    console.log("診断結果を保存:", { userId, symptoms, result })
    return { id: Date.now(), userId, symptoms, result, createdAt: new Date() }
  }

  async getChatHistory(userId: number, sessionId: string) {
    // チャット履歴を取得
    return []
  }

  async saveChatMessage(userId: number, sessionId: string, message: string, sender: "user" | "ai") {
    // チャットメッセージを保存
    console.log("チャットメッセージを保存:", { userId, sessionId, message, sender })
  }

  async getAllUsers() {
    // 全ユーザーを取得（管理者用）
    return [
      { id: 1, username: "admin", email: "admin@example.com", role: "admin", createdAt: new Date() },
      { id: 2, username: "user1", email: "user1@example.com", role: "user", createdAt: new Date() },
    ]
  }

  async getAllDiagnoses() {
    // 全診断結果を取得（管理者用）
    return [
      {
        id: 1,
        userId: 2,
        username: "user1",
        symptoms: "頭痛と発熱",
        diagnosis: "インフルエンザ（疑い）",
        urgencyLevel: "レベル2",
        createdAt: new Date(),
      },
    ]
  }
}
