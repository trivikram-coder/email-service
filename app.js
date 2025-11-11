const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());

// Generate 6-digit OTP
const otp = () => Math.floor(100000 + Math.random() * 900000);

// Function to send mail via Brevo SMTP
const sendMail = async (email) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com", // Brevo SMTP server
      port: 587,                    // Port for STARTTLS
      secure: false,                // Use TLS
      auth: {
        user: process.env.BREVO_EMAIL, // Brevo login
        pass: process.env.BREVO_PASS   // Brevo SMTP key
      },
      logger: true,
      debug: true
    });

    const code = otp();

    const info = await transporter.sendMail({
      from: `"Smart Expense Tracker Team" <${process.env.MAIL}>`,
      to: email,
      subject: "OTP Verification",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Smart Expense Tracker</h2>
          <p>Your verification code is:</p>
          <h1 style="letter-spacing: 3px;">${code}</h1>
          <p>This OTP expires in 10 minutes.</p>
        </div>
      `
    });

    console.log("✅ Email sent successfully:", info.response);
    return true;
  } catch (err) {
    console.error("❌ Failed to send email:", err);
    return false;
  }
};

// API to send OTP
app.post("/send-mail", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const success = await sendMail(email);
  if (success) res.status(200).json({ message: "Email sent successfully" });
  else res.status(500).json({ message: "Failed to send email" });
});

// Test route
app.get("/", (req, res) => res.send("✅ Smart Expense Tracker Mail API is running!"));

app.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`));
