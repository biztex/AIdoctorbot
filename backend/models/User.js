const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
)

// パスワードハッシュ化のミドルウェア
userSchema.pre("save", async function (next) {
  if (!this.isModified("password_hash")) return next()
  this.password_hash = await bcrypt.hash(this.password_hash, 10)
  next()
})

// パスワード検証メソッド
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password_hash)
}

module.exports = mongoose.model("User", userSchema)
