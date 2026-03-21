const User = require("../Models/userModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate token (pass minimal data)
    const token = generateToken(user._id);

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Token
    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET USER PROFILE BY ID =================
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("solvedProblems")
      .populate("submissions");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET LOGGED-IN USER =================
const getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getProfile,
};