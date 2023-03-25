const User = require("../models/user");

const jwt = require("jsonwebtoken");
require("dotenv").config();

const protect = async (req, res, next) => {
  try {
    // Obtener el token de autorización del encabezado de la solicitud
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "No se proporcionó un token de acceso" });
    }

    // Verificar el token con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar al usuario en la base de datos
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Añadir el usuario al objeto de solicitud
    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Token de acceso no válido" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Acceso denegado. Se requiere rol de administrador" });
  }
};

module.exports = { protect, adminOnly };
