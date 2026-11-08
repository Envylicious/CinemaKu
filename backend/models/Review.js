
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        content: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Content",
            required: true
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 10
        },

        comment: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

// Satu pengguna satu review
reviewSchema.index(
    { user: 1, content: 1 },
    { unique: true }
);

module.exports = mongoose.model("Review", reviewSchema);
