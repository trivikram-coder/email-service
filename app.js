const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const cors=require("cors")
dotenv.config();
const otpRoute=require("./Route/otpRoute");
const connDb = require("./Utilities/db");
const app = express();
app.use(express.json());
app.use(cors())
app.use("/otp",otpRoute)



app.get("/", (req, res) => res.send("Email Service Running Successfully"));
connDb()
const PORT=process.env.PORT
app.listen(PORT, () => console.log(`Server on port ${process.env.PORT}`));
