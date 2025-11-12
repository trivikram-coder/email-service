const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  otp: {
    type: String, // store hashed string, not number
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // auto delete after 5 minutes
  },
});

module.exports = mongoose.model("Otp", otpSchema);
