const express = require("express");
const router = express.Router();
const {
    PostMeeting,
    getMeeting
} = require("../controllers/MeetingController");
const { protect } = require("../middleware/authMiddleware");

router.post("/get", protect, getMeeting);
router.post("/call", protect, PostMeeting);

module.exports = router;
