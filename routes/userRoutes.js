const express = require("express");
const { getAllUsers, toggleFavorite, getFavorites, ChangePicture, deleteUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/",protect, getAllUsers);
router.post("/favorites", protect, getFavorites);
router.post("/toggleFavorite", protect, toggleFavorite);
router.post("/changePicture", protect, ChangePicture);
// router.delete("/deleteUser", deleteUser);

module.exports = router;
