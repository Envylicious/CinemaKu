
const express = require("express");
const mongoose = require("mongoose");
const Content = require("../models/Content");

const router = express.Router();

// Check Contents, Search, and Filter
router.get("/", async (req, res) => {
    try {
        const { type, search, genre } = req.query;

        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(
            50,
            Math.max(1, parseInt(req.query.limit, 10) || 12)
        );

        const filter = {};

        // Filter berdasarkan jenis konten
        if (type) {
            if (!["movie", "series", "music"].includes(type)) {
                return res.status(400).json({
                    message: "Jenis konten tidak valid"
                });
            }

            filter.type = type;
        }

        // Filter berdasarkan genre
        if (genre) {
            filter.genre = genre;
        }

        // Pencarian judul dan deskripsi
        if (search && search.trim()) {
            const keyword = search.trim();

            filter.$or = [
                {
                    title: {
                        $regex: keyword,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: keyword,
                        $options: "i"
                    }
                }
            ];
        }

        const contents = await Content.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Content.countDocuments(filter);

        res.status(200).json({
            message: "Berhasil mengambil konten",
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            contents
        });

    } catch (error) {
        console.error("Get contents error:", error.message);

        res.status(500).json({
            message: "Gagal mengambil konten"
        });
    }
});


// Check Content Detail
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Validasi MongoDB
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "ID konten tidak valid"
            });
        }

        const content = await Content.findById(id);

        if (!content) {
            return res.status(404).json({
                message: "Konten tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Berhasil mengambil detail konten",
            content
        });

    } catch (error) {
        console.error("Get content detail error:", error.message);

        res.status(500).json({
            message: "Gagal mengambil detail konten"
        });
    }
});

module.exports = router;
