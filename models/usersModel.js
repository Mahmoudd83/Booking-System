const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const mongooseSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    googleId: {
      type: String,
     unique: true,
      sparse: true,
    },
    phone: String,
    password: String,
    PasswordChangedAt: Date,
    role: {
      type: String,
      enum: ["admin", "provider", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

mongooseSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("Users", mongooseSchema);
