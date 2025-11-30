
const axios=require("axios")
const dotenv=require("dotenv")
dotenv.config()
const otpFun=()=>{
  return Math.floor(100000+Math.random()*900000);

}


const sendMail = async (email,otp,appName) => {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    const sendData = {
      sender: {
        name: `${appName} Team`,
        email: process.env.MAIL
      },
      to: [{ email }],
      subject: "Your OTP Verification Code",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
          <div style="background-color: #007bff; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h2 style="color: white; margin: 0;">${appName}</h2>
          </div>
          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px;">
            <p style="color: #333; font-size: 16px;">Hi,</p>
            <p style="color: #333; font-size: 16px;">Your verification code is:</p>
            <div style="background-color: #f0f0f0; padding: 15px; text-align: center; border-radius: 6px; margin: 20px 0;">
              <p style="font-size: 32px; font-weight: bold; color: #007bff; margin: 0; letter-spacing: 2px;">${otp}</p>
            </div>
            <p style="color: #999; font-size: 14px;">This OTP expires in 10 minutes. Do not share this code with anyone.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
          </div>
        </div>
      `,
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

    console.log("✅ Raw HTTP Email Sent:", response.data);
    return true;
  } catch (err) {
    console.error("❌ Raw HTTP Send Failed:", err.response ? err.response.data : err.message);
    return false;
  }
};

module.exports={sendMail,otpFun}