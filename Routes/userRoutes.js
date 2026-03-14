const express = require('express')
const router = express.Router();
const userController = require('../Controllers/userController');
const { register } = require('module');

router.post("/register",userController.registerUser);
router.post("/login",userController.loginUser);
router.get("/:id",userController.getUserProfile);

module.exports = router;