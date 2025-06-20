const mongoose = require("mongoose")

const aiDiagnosisSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    symptoms: {
      type: String,
      required: true,
    },
    diagnosis_result: {
      diagnosis: [
        {
          disease: String,
          probability: Number,
          urgency_level: {
            type: String,
            enum: ["レベル1", "レベル2", "レベル3"],
          },
          recommendations: [String],
        },
      ],
      summary: String,
      next_questions: [String],
    },
    urgency_level: {
      type: Number,
      min: 1,
      max: 3,
      required: true,
    },
    probability: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("AIDiagnosis", aiDiagnosisSchema)
