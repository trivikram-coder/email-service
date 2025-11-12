
const axios=require("axios")
const dotenv=require("dotenv")
dotenv.config()
const otpFun=()=>{
  return Math.floor(100000+Math.random()*900000);

}


const sendMail = async (email,otp) => {
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

module.exports={sendMail,otpFun}