const express = require('express');
const cors = require('cors');
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

connectDB();

// CORS — allow frontend origin in production, everything in dev
const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",").map(url => url.trim().replace(/\/$/, ""))
    : ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, postman)
        if (!origin) return callback(null, true);
        
        // Normalize origin by removing trailing slashes
        const cleanOrigin = origin.replace(/\/$/, "");
        
        if (allowedOrigins.includes(cleanOrigin) || allowedOrigins.includes("*")) {
            return callback(null, true);
        }
        
        // Returning callback(null, false) tells CORS to block the request without throwing a server error
        return callback(null, false);
    },
    credentials: true,
}));

app.use(express.json());

// Health check endpoint (used by Render / Railway to verify the server is alive)
app.get('/', (req, res) => {
    res.json({ status: "ok", message: "Xpense Tracker API Running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});