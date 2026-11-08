
const express = require("express");
const mongoose = require("mongoose");

const protect = require("../middleware/authMiddleware");
const User = require("../models/User");
const Content = require("../models/Content");

const router = express.Router();

// Semua endpoint favorite terproteksi
router.use(protect);

// Get user favorites
router.get("/", async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate("favorites");

        res.status(200).json({
            message: "Berhasil mengambil favorites",
            favorites: user.favorites
        });

    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            message: "Gagal mengambil favorites"
        });
    }
});

// Add favorite
router.post("/:contentId", async (req, res) => {
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

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $addToSet: {
                    favorites: contentId
                }
            },
            {
                new: true
            }
        ).populate("favorites");

        res.status(200).json({
            message: "Konten berhasil ditambahkan ke favorites",
            favorites: user.favorites
        });

    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            message: "Gagal menambahkan favorite"
        });
    }
});

// Remove favorite
router.delete("/:contentId", async (req, res) => {
    try {
        const { contentId } = req.params;

        if (!mongoose.isValidObjectId(contentId)) {
            return res.status(400).json({
                message: "ID konten tidak valid"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $pull: {
                    favorites: contentId
                }
            },
            {
                new: true
            }
        ).populate("favorites");

        res.status(200).json({
            message: "Konten berhasil dihapus dari favorites",
            favorites: user.favorites
        });

    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            message: "Gagal menghapus favorite"
        });
    }
});

module.exports = router;
