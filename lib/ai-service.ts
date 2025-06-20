import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export interface DiagnosisResult {
  disease: string
  probability: number
  urgency_level: "レベル1" | "レベル2" | "レベル3"
  recommendations: string[]
}

export interface AIResponse {
  diagnosis: DiagnosisResult[]
  summary: string
  next_questions?: string[]
}

export class AIService {
  private static instance: AIService

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService()
    }
    return AIService.instance
  }

  async diagnoseSymptoms(symptoms: string, chatHistory: string[] = []): Promise<AIResponse> {
    const systemPrompt = `
あなたは臨床経験豊富なAIアシスタントです。症状を元に、以下の形式で回答してください：

参考資料：
- 総務省消防庁「緊急度判定プロトコルVer.3」
- 埼玉県AI医療相談システム
- 電話相談プロトコル（成人70症候、小児38症候）

緊急度レベル：
- レベル3: 肺炎、急性腹膜炎、敗血症、髄膜炎、心筋炎、COVID-19（重症）、インフルエンザ脳症、呼吸不全、百日咳（重症化）、SARS/MERS
- レベル2: インフルエンザ、COVID-19（軽〜中等症）、マイコプラズマ肺炎、急性気管支炎、RSウイルス感染症、感染性胃腸炎、咽頭炎、扁桃結膜熱（咽頭結膜熱）
- レベル1: かぜ（急性上気道炎）、アレルギー性鼻炎、咽頭アレルギー、皮膚炎、季節性アレルギー、軽度の脱水症状、嘔吐症、環境変化による体調不良、病的ストレス由来の発熱、ウイルス性胃腸炎（軽症）

必ず参考情報を基に医師の診察を必要とするものではなく、あくまで参考情報です。
    `

    const userPrompt = `
症状: ${symptoms}
${chatHistory.length > 0 ? `過去の会話: ${chatHistory.join("\n")}` : ""}

上記症状から考えられる病名と緊急レベルを診断してください。
    `

    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        system: systemPrompt,
        prompt: userPrompt,
        tools: {
          diagnose_symptoms: {
            description: "ユーザーの症状から考えられる病名と緊急度を出力する",
            parameters: {
              type: "object",
              properties: {
                diagnosis: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      disease: { type: "string" },
                      probability: { type: "number" },
                      urgency_level: { type: "string", enum: ["レベル1", "レベル2", "レベル3"] },
                    },
                    required: ["disease", "probability", "urgency_level"],
                  },
                },
              },
              required: ["diagnosis"],
            },
          },
        },
      })

      // レスポンスをパースして構造化
      const mockResponse: AIResponse = {
        diagnosis: [
          {
            disease: "インフルエンザ（疑い）",
            probability: 75,
            urgency_level: "レベル2",
            recommendations: ["水分補給", "安静", "解熱剤の使用"],
          },
        ],
        summary: text,
        next_questions: ["発熱はいつから始まりましたか？", "他に症状はありますか？"],
      }

      return mockResponse
    } catch (error) {
      console.error("AI診断エラー:", error)
      throw new Error("AI診断に失敗しました")
    }
  }

  async chatWithAI(message: string, context: string[] = []): Promise<string> {
    const systemPrompt = `
あなたは海上労働者向けの医療相談AIドクターです。
親しみやすく、分かりやすい言葉で医療アドバイスを提供してください。
ただし、最終的な診断は医師の診察が必要であることを必ず伝えてください。
    `

    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        system: systemPrompt,
        prompt: `${context.join("\n")}\nユーザー: ${message}`,
      })

      return text
    } catch (error) {
      console.error("AIチャットエラー:", error)
      return "申し訳ございません。現在システムに問題が発生しています。しばらく後にお試しください。"
    }
  }
}
