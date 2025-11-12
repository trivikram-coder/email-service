const mongoose=require("mongoose")
const schema = new mongoose.Schema({
  otp: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // ensures one OTP per email
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // document auto-deletes after 5 minutes
  },
});

module.exports= mongoose.model("Otp", schema);
