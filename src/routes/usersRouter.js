const { Router } = require("express");
const router = Router();

const userController = require("../controllers/userController");

router.get("/", userController.getUsers);
router.put("/:id", userController.updateUserById);
router.get("/:id", userController.getUserById);
router.delete("/:id", userController.deleteUserById);

module.exports = router;
