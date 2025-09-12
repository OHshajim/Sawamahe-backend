const express = require("express");
const router = express.Router();
const {
    sendMessage,
    getMessages,
    markMessageSeen,
} = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, sendMessage);
router.get("/:conversationId", protect, getMessages);
router.patch("/:id/seen", protect, markMessageSeen);

module.exports = router;
