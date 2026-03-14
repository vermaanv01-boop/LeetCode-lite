const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { configDotenv } = require("dotenv");
configDotenv();
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All field are Required",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User Already Registered",
      });
    }

    const user = await User.create({
      username,
      email,
      password,
    });
    return res.status(201).json({
      message: "User Created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expires: "7d",
    });
    res.json({
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserProfile = async (req,res) => {
    try {
     const user = await User.findById(req.params.id)
     .populate("solvedProblems")
     .populate("submissions");   
    } catch (err) {
         res.status(500).json({error:err.message})
    }
}
module.exports = { registerUser, loginUser , getUserProfile };
