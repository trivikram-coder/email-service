const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();

const app = express();
app.use(express.json());
const otpFun=()=>{
  return Math.floor(100000+Math.random()*900000);

}
const otp=otpFun()

const sendMail = async (email) => {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    const sendData = {
      sender: {
        name: "Smart Expense Tracker Team",
        email: process.env.MAIL
      },
      to: [
        { email }
      ],
      subject: "OTP Verification",
      htmlContent: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Smart Expense Tracker</h2>
          <p>Your verification code is: <strong>${otp}</strong></p>
          <p>This OTP expires in 10 minutes.</p>
        </div>
      `
    };

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      sendData,
      {
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "api-key": apiKey
        }
      }
    );

    console.log("✅ Raw HTTP Email Sent:", response.data);
    return true;
  } catch (err) {
    console.error("❌ Raw HTTP Send Failed:", err.response ? err.response.data : err.message);
    return false;
  }
};

app.post("/send-mail", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  const success = await sendMail(email);
  if (success) res.status(200).json({ message: "Email sent successfully" });
  else res.status(500).json({ message: "Failed to send email" });
});

app.get("/", (req, res) => res.send("Mail API running"));

app.listen(process.env.PORT, () => console.log(`Server on port ${process.env.PORT}`));
