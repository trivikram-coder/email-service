// Import Packages
const express = require("express");
const crypto = require("crypto");
const { sendMail, otpFun } = require("../Utilities/sendEmail");
const Otp = require("../Model/OTP");

const router = express.Router();
router.use(express.json());

// Utility to hash OTP
const hashOtp = (otp) =>
  crypto.createHash("sha256").update(String(otp)).digest("hex");

// =======================
// 📤 Send OTP
// =======================
router.post("/send-otp", async (req, res) => {
  try {
    const { email,appName } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // 1️⃣ Generate OTP
    const otp = otpFun();
    console.log(otp)
    // 2️⃣ Send OTP via email
    await sendMail(email, otp,appName);

    // 3️⃣ Hash OTP before saving
    const hashedOtp = hashOtp(otp);

    // 4️⃣ Store or update OTP record
    await Otp.findOneAndUpdate(
      { email },
      { otp: hashedOtp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ message: "Unable to send OTP", error: error.message });
  }
});

// =======================
// ✅ Verify OTP
// =======================
router.post("/verify-otp/:email", async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.params.email;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // 1️⃣ Get record for email
    const record = await Otp.findOne({ email });

    if (!record) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    // 2️⃣ Compare hashes (not plain OTP)
    const hashedInputOtp = hashOtp(otp);

    if (record.otp !== hashedInputOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // 3️⃣ Delete OTP after successful verification
    await Otp.deleteOne({ email });

    res.status(200).json({ message: "OTP validated successfully" });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Unable to validate OTP", error: error.message });
  }
});

module.exports = router;
