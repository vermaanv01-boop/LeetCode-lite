const express = require("express");
const router = express.Router();
const protect = require("../middleWare/Auth");
const { submitCode , getUserSubmissions } = require("../controllers/submissionController");

router.post("/submit", protect, submitCode);
router.get("/user/:userId",protect, getUserSubmissions);

module.exports = router;