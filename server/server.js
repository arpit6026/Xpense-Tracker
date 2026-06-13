const express = require('express');
const cors = require('cors');
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Expense Tracker API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

const PORT = 5001;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});