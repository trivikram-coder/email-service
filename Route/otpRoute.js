// Import Packages
const express = require("express");
const mongoose = require("mongoose");
const { sendMail, otp } = require("../Utilities/sendEmail");
const app = express();
const Otp=require("../Model/OTP")
// Middleware
app.use(express.json());

// 📤 Send OTP
// =======================
app.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Generate and send OTP via email
    await sendMail(email);
    

    // Update existing OTP or insert a new one
    await Otp.findOneAndUpdate(
      { email },                     // find document by email
      { otp, createdAt: Date.now() }, // update OTP and timestamp
      { upsert: true, new: true }     // create new if not exists
    );

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to send OTP", error: error.message });
  }
});

// =======================
// ✅ Verify OTP
// =======================
app.post("/verify-otp/:email", async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.params.email;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const record = await Otp.findOne({ email });

    if (!record) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    if (record.otp != otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.status(200).json({ message: "OTP validated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to validate OTP", error: error.message });
  }
});

module.exports = app;
