const mongoose = require("mongoose")

const chatHistorySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      enum: ["user", "ai"],
      required: true,
    },
    session_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("ChatHistory", chatHistorySchema)
