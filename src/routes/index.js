const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const usersRouter = require("./usersRouter");
const productRouter = require("./productRouter");
const authRouter = require("./authRouter");

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter)
router.use("/users", usersRouter);
router.use("/products", productRouter);
router.use("/auth", authRouter);

module.exports = router;
