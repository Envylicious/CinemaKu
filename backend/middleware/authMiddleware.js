
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        // Ambil token dari Authorization Header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Akses ditolak. Silakan login terlebih dahulu."
            });
        }

        const token = authHeader.split(" ")[1];

        // Verifikasi token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Cari user berdasarkan ID dalam token
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                message: "Pengguna tidak ditemukan."
            });
        }

        // Simpan informasi user ke request
        req.user = user;

        // Lanjutkan ke route berikutnya
        next();

    } catch (error) {
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            return res.status(401).json({
                message: "Token tidak valid atau sudah kedaluwarsa."
            });
        }

        console.error("Authentication error:", error.message);

        return res.status(500).json({
            message: "Terjadi kesalahan pada server."
        });
    }
};

module.exports = protect;
