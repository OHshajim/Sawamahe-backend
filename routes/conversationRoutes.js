const express = require("express");
const router = express.Router();
const {
    createOrGetConversation,
    getUserConversations,
} = require("../controllers/conversationController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createOrGetConversation);
router.get("/", protect, getUserConversations);

module.exports = router;
