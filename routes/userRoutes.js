const express = require("express");
const { getAllUsers, toggleFavorite, getFavorites, ChangePicture } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/",protect, getAllUsers);
router.post("/favorites", protect, getFavorites);
router.post("/toggleFavorite", protect, toggleFavorite);
router.post("/changePicture", protect, ChangePicture);

module.exports = router;
