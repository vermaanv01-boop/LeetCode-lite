const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {
    console.log("REGISTER API HIT");
    console.log("Request Body:", req.body);

    const { name, email, password ,mobile_number } = req.body;

    if (!name || !email || !password ||!mobile_number ) {
      console.log("Validation Failed: Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    console.log("User Exists Check:", userExists ? "YES" : "NO");

    if (userExists) {
      console.log("User already exists with email:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile_number,
    });

    console.log("User created:", user._id);

    const token = generateToken(user._id);
    console.log("Token generated");

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
    console.log("REGISTER ERROR:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {
    console.log("LOGIN API HIT");
    console.log("Request Body:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Validation Failed: Missing email/password");
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    console.log("User Found:", user ? "YES" : "NO");

    if (!user) {
      console.log("Login failed: User not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match:", isMatch);

    if (!isMatch) {
      console.log("Login failed: Incorrect password");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    console.log("Login successful, token generated");

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
    console.log("LOGIN ERROR:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET USER PROFILE BY ID =================
const getUserProfile = async (req, res) => {
  try {
    console.log("GET USER PROFILE API HIT");
    console.log("User ID:", req.params.id);

    const user = await User.findById(req.params.id)
      .populate("solvedProblems")
      .populate("submissions");

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User profile fetched");

    return res.status(200).json(user);

  } catch (error) {
    console.log("GET USER PROFILE ERROR:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET LOGGED-IN USER =================
const getProfile = async (req, res) => {
  try {
    console.log("GET LOGGED-IN USER API HIT");
    console.log("User from token:", req.user);

    return res.status(200).json({
      user: req.user,
    });

  } catch (error) {
    console.log("GET PROFILE ERROR:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getProfile,
};