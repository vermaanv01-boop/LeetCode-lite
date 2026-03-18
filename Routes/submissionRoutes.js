const express = require("express");
const router = express.Router();

const {submitCode,getUserSubmissions} = require("../Controllers/submissionController");

router.post("/",submitCode);
router.get("/user/:userId", getUserSubmissions);

module.exports = router;