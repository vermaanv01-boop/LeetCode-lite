const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  getUserProfile,
  updateProfile,
  refreshAccessToken,
  logoutUser,
} = require('../Controllers/userController');
const { protect, adminOnly } = require('../middlewares/auth.middleware');

// ================= PUBLIC ROUTES =================
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

// ================= PROTECTED ROUTES =================
router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);
router.post("/logout", protect, logoutUser);

// ================= PUBLIC PROFILE =================
router.get("/profile/:id", getUserProfile);

// ================= ADMIN ROUTES =================
router.get("/", protect, adminOnly, getAllUsers);
router.delete("/:id", protect, adminOnly, deleteUser);
router.put("/:id/role", protect, adminOnly, updateUserRole);

module.exports = router;