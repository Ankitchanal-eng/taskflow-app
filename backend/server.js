require("dotenv").config();
console.log("Loaded JWT_SECRET:", JSON.stringify(process.env.JWT_SECRET));
console.log("Length:", process.env.JWT_SECRET.length);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); 
const authRoutes = require("./routes/auth");
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3001;

// --- CRITICAL MIDDLEWARE FIX ---

// 1. Body Parser: Must come first to populate req.body
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 2. CORS: Updated with CORRECT NEW Vercel URL
app.use(cors({
    origin: [
        "https://task-flow-app-roan.vercel.app",  // ✅ NEW URL
        "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));

// --- ROUTES ---

// Authentication routes
app.use("/api/auth", authRoutes);

// Task Routes (These require the Authorization header checked by CORS)
app.use('/api/tasks', taskRoutes);

// --- DATABASE CONNECTION & SERVER STARTUP ---

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("connected to MongoDB");

        app.listen(PORT, () => {
            console.log(`The server is running on ${PORT}`);
        });
    } catch (error) {
        console.error("MongoDB connection failed", error.message);
        process.exit(1);
    }
}

connectDB();
