const express = require("express");
const { getAllUsers, toggleFavorite, getFavorites, ChangePicture, deleteUser ,qualification } = require("../controllers/userController");
const {
  getAllUsers,
  toggleFavorite,
  getFavorites,
  ChangePicture,
  getWebData,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, getAllUsers);
router.post("/favorites", protect, getFavorites);
router.post("/toggleFavorite", protect, toggleFavorite);
router.post("/changePicture", protect, ChangePicture);
router.post("/qualification/set-price/:id", protect, qualification);
// router.delete("/deleteUser", deleteUser);
router.get("/webData/get", getWebData);

module.exports = router;
