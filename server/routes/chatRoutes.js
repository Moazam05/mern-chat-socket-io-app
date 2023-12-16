const express = require("express");
// Custom Imports
const authController = require("../controllers/authController");
const chatController = require("../controllers/chatController");

const router = express.Router();

router.use(authController.protect);

// CHAT ROUTES
router.route("/").post(chatController.createChat).get(chatController.getChats);
router.route("/:id").get(chatController.getChat);

// GROUP CHAT ROUTES
router.route("/group").post(chatController.createGroupChat);
router.route("/group/:id").put(chatController.renameGroupChat);
router.route("/group/:id/add").put(chatController.addToGroupChat);
router.route("/group/:id/remove").put(chatController.removeFromGroupChat);

module.exports = router;
