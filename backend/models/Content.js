
const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            required: true,
            enum: ["movie", "series", "music"]
        },

        description: {
            type: String,
            required: true
        },

        poster: {
            type: String,
            default: ""
        },

        genre: {
            type: [String],
            default: []
        },

        releaseYear: {
            type: Number,
            required: true
        },

        creator: {
            type: String,
            required: true
        },

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 10
        },

        ratingCount: {
            type: Number,
            default: 0,
            min: 0
        },

        trailerUrl: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

// Index untuk pencarian dan filtering
contentSchema.index({ title: "text", description: "text" });
contentSchema.index({ type: 1, releaseYear: -1 });

module.exports = mongoose.model("Content", contentSchema);
