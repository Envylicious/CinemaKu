
const express = require("express");
const mongoose = require("mongoose");

const Review = require("../models/Review");
const Content = require("../models/Content");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get reviews
router.get("/:contentId", async (req, res) => {
    try {
        const { contentId } = req.params;

        if (!mongoose.isValidObjectId(contentId)) {
            return res.status(400).json({
                message: "ID konten tidak valid"
            });
        }

        const content = await Content.findById(contentId);

        if (!content) {
            return res.status(404).json({
                message: "Konten tidak ditemukan"
            });
        }

        const reviews = await Review.find({
            content: contentId
        })
            .populate("user", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Berhasil mengambil reviews",
            rating: content.rating,
            ratingCount: content.ratingCount,
            reviews
        });

    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            message: "Gagal mengambil reviews"
        });
    }
});


// Create/update review (butuh login)
router.post("/:contentId", protect, async (req, res) => {
    try {
        const { contentId } = req.params;
        const { rating, comment } = req.body;

        // Validasi ID
        if (!mongoose.isValidObjectId(contentId)) {
            return res.status(400).json({
                message: "ID konten tidak valid"
            });
        }

        // Validasi rating
        if (
            typeof rating !== "number" ||
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 10
        ) {
            return res.status(400).json({
                message: "Rating harus 1-10"
            });
        }

        if (
            comment !== undefined &&
            (typeof comment !== "string" || comment.length > 1000)
        ) {
            return res.status(400).json({
                message: "Komentar maksimal 1000 karakter"
            });
        }

        // Pastikan konten tersedia
        const content = await Content.findById(contentId);

        if (!content) {
            return res.status(404).json({
                message: "Konten tidak ditemukan"
            });
        }

        // Satu user hanya punya satu review per konten
        const review = await Review.findOneAndUpdate(
            {
                user: req.user._id,
                content: contentId
            },
            {
                $set: {
                    rating,
                    ...(comment !== undefined ? { comment } : {})
                },
                $setOnInsert: {
                    user: req.user._id,
                    content: contentId
                }
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );

        // Hitung ulang rating rata-rata
        const result = await Review.aggregate([
            {
                $match: {
                    content: new mongoose.Types.ObjectId(contentId)
                }
            },
            {
                $group: {
                    _id: "$content",
                    averageRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);

        const averageRating = result[0]?.averageRating || 0;
        const totalReviews = result[0]?.totalReviews || 0;

        // Simpan ringkasan rating ke Content
        await Content.findByIdAndUpdate(contentId, {
            rating: Math.round(averageRating * 10) / 10,
            ratingCount: totalReviews
        });

        res.status(200).json({
            message: "Rating dan review berhasil disimpan",
            review,
            averageRating: Math.round(averageRating * 10) / 10,
            ratingCount: totalReviews
        });

    } catch (error) {
        console.error("Review error:", error.message);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Review sedang diproses, silakan coba kembali"
            });
        }

        res.status(500).json({
            message: "Gagal menyimpan review"
        });
    }
});

module.exports = router;
