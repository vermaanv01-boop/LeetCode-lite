const express = require('express');
const router = express.Router();
const {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
} = require('../Controllers/problemController');
const { protect, adminOnly } = require('../middleWare/Auth');

// ================= PUBLIC ROUTES =================
router.get("/", getAllProblems);
router.get("/:id", getProblemById);

// ================= ADMIN ONLY ROUTES =================
router.post("/", protect, adminOnly, createProblem);
router.put("/:id", protect, adminOnly, updateProblem);
router.delete("/:id", protect, adminOnly, deleteProblem);

module.exports = router;