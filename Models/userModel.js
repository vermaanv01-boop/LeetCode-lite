const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    mobile_number: { type: String, unique: true, sparse: true },
    avatar: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    solvedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Problem" }],
    submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Submission" }],
    score: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastSolvedDate: { type: Date },
    refreshToken: { type: String }

}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);