const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

// AUTH ROUTES
router
  .post("/signup", authController.signup)
  .get("/", userController.getAllUsers);
router.post("/login", authController.login);

router.use(authController.protect);

// USER ROUTES
router.put("/updateMe", userController.updateMe);

module.exports = router;