const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");

// Rutas para productos
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post(
  "/",
  authMiddleware.protect,
  authMiddleware.adminOnly,
  productController.createProduct
);
router.put(
  "/:id",
  authMiddleware.protect,
  authMiddleware.adminOnly,
  productController.updateProduct
);
router.delete(
  "/:id",
  authMiddleware.protect,
  authMiddleware.adminOnly,
  productController.deleteProduct
);

module.exports = router;
