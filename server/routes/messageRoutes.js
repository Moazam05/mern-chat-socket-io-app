const express = require("express");
const authController = require("../controllers/authController");
const messageController = require("../controllers/messageController");

const router = express.Router();

// PROTECTED ROUTES
router.use(authController.protect);

// MESSAGE ROUTES

router.post("/", messageController.sendMessage);
// router.get("/:id", messageController.getMessages);

module.exports = router;
