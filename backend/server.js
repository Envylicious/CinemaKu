
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const contentRoutes = require("./routes/contentRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to CinemaKu API!",
        status: "Server is running",
        database: "MongoDB Atlas"
    });
});

// Authentication Routes
app.use("/api/auth", authRoutes);
// User Routes
app.use("/api/users", userRoutes);
// Content Routes
app.use("/api/contents", contentRoutes);
// Favorites routes
app.use("/api/favorites", favoriteRoutes);
// Review routes
app.use("/api/reviews", reviewRoutes);

// Connect database then start
const startServer = async () => {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`CinemaKu server running on port ${PORT}`);
    });
};

startServer();
