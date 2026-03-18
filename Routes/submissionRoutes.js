const express = require("express");
const router = express.Router();

const {submitCode} = require("../Controllers/submissionController");

router.post("/",submitCode);

module.exports = router;