const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middlewares/authMiddleware");

const { login, register } = require("../controllers/authController");

// Rutas para autenticación
router.post("/login", login);
router.post("/register", register);

module.exports = router;
