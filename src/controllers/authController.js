const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Verificar si el usuario existe en la base de datos
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si la contraseña es correcta
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Generar token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Devolver el token y los datos del usuario
    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

const register = async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;

    // Verificar si el usuario ya existe en la base de datos
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear un nuevo usuario
    const newUser = new User({
      name,
      email,
      surname,
      password: hashedPassword,
    });

    // Guardar el usuario en la base de datos
    await newUser.save();

    // Generar token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Devolver el token y los datos del usuario
    res.json({ token, user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el usuario" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Verificar si el usuario existe en la base de datos
    const user = User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Generar token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Enviar el token al correo electrónico del usuario
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
    const message = `
            <h1>Has solicitado un restablecimiento de contraseña</h1>
            <p>Por favor haz clic en el siguiente enlace para restablecer tu contraseña</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `;
    try {
      await sendEmail({
        to: user.email,
        subject: "Restablecer contraseña",
        text: message,
      });

      res.json({ message: "Correo electrónico enviado" });
    } catch (error) {
      console.error(error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res
        .status(500)
        .json({ message: "Error al enviar el correo electrónico" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al restablecer la contraseña" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    // Verificar si el token es válido
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Token no válido" });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Actualizar la contraseña del usuario
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Generar token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Devolver el token y los datos del usuario
    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al restablecer la contraseña" });
  }
};

module.exports = { login, register };
