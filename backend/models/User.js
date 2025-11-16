const mongoose = require("mongoose");
const Counter = require("./Counter");

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true }, // auto-increment ID
    userName: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
  },
  {
    timestamps: true
  }
);
// Auto-increment hook
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      "userId",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.id = counter.seq;
  }
  next();
});


module.exports = mongoose.model("User", userSchema);
