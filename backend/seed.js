
require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Content = require("./models/Content");

const sampleContents = [
    {
        title: "Interstellar",
        type: "movie",
        description: "A team of explorers travels beyond this galaxy to discover whether mankind has a future among the stars.",
        genre: ["Sci-Fi", "Adventure", "Drama"],
        releaseYear: 2014,
        creator: "Christopher Nolan",
        rating: 8.7,
        ratingCount: 1200,
        poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN6MBU9VxzNxqU0gzzOsgDR0Mpxn4_6BDHIzD-Xc8YaQ&s=10",
        trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E"
    },
    {
        title: "The Batman",
        type: "movie",
        description: "Batman investigates corruption in Gotham City while pursuing a mysterious serial killer.",
        genre: ["Action", "Crime", "Drama"],
        releaseYear: 2022,
        creator: "Matt Reeves",
        rating: 7.8,
        ratingCount: 900,
        poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV9s1naV3T_h378vBhMYysfmMInSKzrbTXjFY49cJ2jQ&s=10",
        trailerUrl: "https://www.youtube.com/watch?v=mqqft2x_Aa4"
    },
    {
        title: "Stranger Things",
        type: "series",
        description: "A group of friends encounters supernatural mysteries in their small town.",
        genre: ["Sci-Fi", "Horror", "Drama"],
        releaseYear: 2016,
        creator: "The Duffer Brothers",
        rating: 8.7,
        ratingCount: 1500,
        poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrPls9rZtuIWtDvESGz-JtttBHQE2O__xbeluI6oUADQ&s=10",
        trailerUrl: ""
    },
    {
        title: "Breaking Bad",
        type: "series",
        description: "A chemistry teacher enters the criminal world after receiving a life-changing diagnosis.",
        genre: ["Crime", "Drama", "Thriller"],
        releaseYear: 2008,
        creator: "Vince Gilligan",
        rating: 9.5,
        ratingCount: 1800,
        poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR48DbZSXkajp98TFO6Tn_yGy1DAoqpHu1OgInOqzOA0A&s=10",
        trailerUrl: ""
    },
    {
        title: "After Hours",
        type: "music",
        description: "A dark and atmospheric R&B album exploring love, loneliness, and heartbreak.",
        genre: ["Pop", "R&B"],
        releaseYear: 2020,
        creator: "The Weeknd",
        rating: 8.9,
        ratingCount: 1100,
        poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy2pq2VhjMjQTjhGA1G8aJakE5yv43PRjz0YShJYpZWw&s=10",
        trailerUrl: ""
    },
    {
        title: "Midnights",
        type: "music",
        description: "An introspective pop album exploring thoughts and emotions during sleepless nights.",
        genre: ["Pop"],
        releaseYear: 2022,
        creator: "Taylor Swift",
        rating: 8.5,
        ratingCount: 1000,
        poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ4Wogit-gyzFTueH-MEFFdPhb6aIkHRnnp0voEccCjA&s=10",
        trailerUrl: ""
    }
];

const seedDatabase = async () => {
    try {
        await connectDB();

        for (const item of sampleContents) {
            await Content.updateOne(
                {
                    title: item.title,
                    type: item.type
                },
                {
                    $set: item
                },
                {
                    upsert: true
                }
            );
        }

        console.log("CinemaKu sample data inserted successfully!");

    } catch (error) {
        console.error("Seed error:", error.message);
    } finally {
        await mongoose.disconnect();
        console.log("Database connection closed.");
    }
};

seedDatabase();
