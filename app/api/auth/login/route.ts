import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "ユーザー名とパスワードが必要です" }, { status: 400 })
    }

    const db = Database.getInstance()
    const user = await db.authenticateUser(username, password)

    if (!user) {
      return NextResponse.json({ error: "ログイン情報が正しくありません" }, { status: 401 })
    }

    const token = generateToken(user)

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("ログインエラー:", error)
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 })
  }
}
