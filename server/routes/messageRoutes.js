const express = require("express");
// Custom Imports
const authController = require("../controllers/authController");
const messageController = require("../controllers/messageController");

const router = express.Router();

// PROTECTED ROUTES
router.use(authController.protect);

// MESSAGE ROUTES
router.post("/", messageController.sendMessage);
router.get("/:chatId", messageController.getAllMessages);

module.exports = router;
