const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();
const otpRoute=require("./Route/otpRoute");
const connDb = require("./Utilities/db");
const app = express();
app.use(express.json());
app.use("/otp",otpRoute)



// app.post("/send-mail", async (req, res) => {
//   const { email } = req.body;
//   if (!email) return res.status(400).json({ message: "Email is required" });
//   const success = await sendMail(email);
//   if (success) res.status(200).json({ message: "Email sent successfully" });
//   else res.status(500).json({ message: "Failed to send email" });
// });

app.get("/", (req, res) => res.send("Mail API running"));
connDb()
app.listen(process.env.PORT, () => console.log(`Server on port ${process.env.PORT}`));
