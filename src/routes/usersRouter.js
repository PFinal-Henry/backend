const { Router } = require("express");
const router = Router();

const userController = require("../controllers/userController");
const authController = require("../middlewares/authMiddleware");

router.get(
  "/",
  authController.protect,
  authController.adminOnly,
  userController.getUsers
);
router.put(
  "/:id",
  authController.protect,
  authController.adminOnly,
  userController.updateUserById
);
router.get("/:id", userController.getUserById);
router.delete(
  "/:id",
  authController.protect,
  authController.adminOnly,
  userController.deleteUserById
);

module.exports = router;
