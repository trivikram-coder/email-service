const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connDb = async () => {
    try {
        const res = await mongoose.connect(process.env.MONGO_URL);
        console.log("Database connected successfully:", res.connection.name);
    } catch (error) {
        console.error("Database connection error:", error);
        throw error;
    }
};

module.exports = connDb;
