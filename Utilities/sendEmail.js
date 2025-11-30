const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

// Generate 6-digit OTP
const otpFun = () => Math.floor(100000 + Math.random() * 900000);

// Dynamic subject and message based on OTP type
const getEmailContent = (otp, appName, type) => {
  let title = "";
  let message = "";

  switch (type) {
    case "signup":
      title = "Verify your Email";
      message = "Thank you for signing up! Use the OTP below to complete your registration.";
      break;

    case "forget":
      title = "Reset Your Password";
      message = "Use the OTP below to reset your password securely.";
      break;

    case "login":
      title = "Login Verification";
      message = "Use the OTP below to log in securely to your account.";
      break;

    default:
      title = "Your Verification Code";
      message = "Use the OTP below to verify your request.";
      break;
  }

  return {
    subject: `${appName} - ${title}`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; width: 100%; background: #f5f7fa; padding: 0; margin: 0;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden;">

          <!-- Header -->
          <div style="background: #2563eb; padding: 25px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 26px;">${appName}</h1>
            <p style="color: #e5e7eb; font-size: 14px; margin-top: 5px;">${title}</p>
          </div>

          <!-- Body -->
          <div style="padding: 30px;">
            <p style="color: #374151; font-size: 16px; margin: 0 0 10px 0;">Hi,</p>
            <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">${message}</p>

            <div style="padding: 18px; background: #f3f4f6; text-align: center; border-radius: 8px; margin: 25px 0;">
              <p style="font-size: 34px; font-weight: bold; color: #2563eb; margin: 0;">${otp}</p>
            </div>

            <p style="color: #6b7280; font-size: 14px;">This OTP is valid for <b>10 minutes</b>. Please do not share it with anyone.</p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 15px; background: #f9fafb; font-size: 12px; color: #9ca3af;">
            <p>If you didn’t request this, you can safely ignore this email.</p>
            <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
          </div>
        </div>
      </div>
    `
  };
};

// Final sendMail function
const sendMail = async (email, otp, appName, type = "signup") => {
  try {
    const apiKey = process.env.BREVO_API_KEY;

    const { subject, htmlContent } = getEmailContent(otp, appName, type);

    const sendData = {
      sender: {
        name: `${appName} Team`,
        email: process.env.MAIL
      },
      to: [{ email }],
      subject,
      htmlContent,
      replyTo: { email: process.env.MAIL }
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

    console.log("✅ Email Sent Successfully:", response.data);
    return true;

  } catch (err) {
    console.error("❌ Email Sending Failed:", err.response ? err.response.data : err.message);
    return false;
  }
};

module.exports = { sendMail, otpFun };
