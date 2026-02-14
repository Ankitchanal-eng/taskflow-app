const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date:     { type: Date, default: Date.now }
});

// ✅ Use existing model if it exists, otherwise create it
const userModel =
  mongoose.models.User || mongoose.model("User", userSchema);

module.exports = userModel;
