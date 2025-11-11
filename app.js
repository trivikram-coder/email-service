const express = require("express");
const nodemailer = require("nodemailer");
const dotenv=require("dotenv")
dotenv.config()
const app = express();
app.use(express.json())
// Function to generate a 6-digit OTP
const otp = () => Math.floor(100000 + Math.random() * 900000);

// Function to send the email
const sendMail = async (email) => {
  // Create transporter using Mailtrap SMTP
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Correct Mailtrap sandbox host
    port: 587,
    secure:false,
    service:"gmail", // Mailtrap default port
    auth: {
      user: process.env.GMAIL, 
      pass: process.env.PASSWORD 
    }
  });

  // Generate OTP
  const code = otp();

  // Send the email
  const info = await transporter.sendMail({
    from: '"Smart Expense Tracker Team" <no-reply@smartexpensetracker.com>', // better practice than using your Gmail
    to: email, // receiver email
    subject: "OTP Verification",
    text: `Enter this OTP to verify your account: ${code}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
        <p>Hi <b>Vikram</b>,</p>
        <p>Your verification code is:</p>
        <div style="margin: 20px 0; text-align: center;">
          <span style="font-size: 30px; font-weight: bold; background: #f3f3f3; padding: 10px 20px; border-radius: 6px;">
            ${code}
          </span>
        </div>
        <p>Use this OTP to verify your login. It will expire in 10 minutes.</p>
        <p>— Smart Expense Tracker Team</p>
      </div>
    `
  });

  console.log("✅ Email sent successfully:", info.messageId);
};

// Send email immediately on start
app.post('/send-mail',async(req,res)=>{
  const {email}=req.body;
  if(!email){
    return res.status(400).json({message:"Email is required"})
  }
  await sendMail(email);
  res.status(200).json({message:"Email sent successfully"})
})

// Minimal server
app.get("/", (req, res) => {
  res.send("✅ Hello, the Mailtrap OTP app is running!");
});

app.listen(3030, () => console.log("🚀 App running on port 3030"));
