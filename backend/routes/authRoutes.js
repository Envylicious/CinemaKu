
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// REGISTER USER
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validasi input
        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Semua field wajib diisi"
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        // Validasi format email dan panjang password
        if (
            cleanName.length > 100 ||
            cleanEmail.length > 254 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
        ) {
            return res.status(400).json({
                message: "Nama atau email tidak valid"
            });
        }

        if (password.length < 8 || password.length > 128) {
            return res.status(400).json({
                message: "Password harus 8-128 karakter"
            });
        }

        // Cek email terdaftar
        const existingUser = await User.findOne({
            email: cleanEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email sudah terdaftar"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Simpan ke MongoDB
        const newUser = await User.create({
            name: cleanName,
            email: cleanEmail,
            password: hashedPassword
        });

        // Kirim respons
        return res.status(201).json({
            message: "Registrasi berhasil!",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email sudah terdaftar"
            });
        }

        console.error("Registration error:", error.message);

        return res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
});


// LOGIN USER
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validasi input
        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Email dan password wajib diisi"
            });
        }

        // Cek user berdasarkan email
        const user = await User.findOne({
            email: email.trim().toLowerCase()
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Email atau password salah"
            });
        }

        // Bandingkan password di MongoDB
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Email atau password salah"
            });
        }

        // Cek JWT Secret tersedia
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET belum dikonfigurasi");
        }

        // Buat JWT Token
        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1d"
            }
        );

        // Kirim respons login
        return res.status(200).json({
            message: "Login berhasil!",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            message: "Terjadi kesalahan pada server"
        });
    }
});


module.exports = router;
