
const express = require("express");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// GET USER PROFILE
router.get("/me", protect, (req, res) => {
    res.status(200).json({
        message: "Berhasil mengambil profil pengguna!",
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            favorites: req.user.favorites,
            createdAt: req.user.createdAt
        }
    });
});

module.exports = router;
