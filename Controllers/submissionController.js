const Submission = require("../Models/submissionModel");
const Problem = require("../Models/Problem");

// ================= SUBMIT CODE =================
const submitCode = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    // Validation
    if (!problemId || !code || !language) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Optional: restrict languages
    const allowedLanguages = ["cpp", "java", "python", "javascript"];
    if (!allowedLanguages.includes(language.toLowerCase())) {
      return res.status(400).json({ message: "Unsupported language" });
    }

    // Check problem existence
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Create submission
    const submission = await Submission.create({
      user: req.user.id, // comes from auth middleware
      problem: problemId,
      code,
      language,
      status: "pending", // later updated by judge
    });

    // TODO: send to judge service / queue here

    return res.status(201).json({
      message: "Submission received",
      submissionId: submission._id,
      status: submission.status,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET LOGGED-IN USER SUBMISSIONS =================
const getUserSubmissions = async (req, res) => {
  try {
    // NEVER trust params for user identity
    const userId = req.user.id;

    // Pagination (basic but necessary)
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const submissions = await Submission.find({ user: userId })
      .populate("problem", "title difficulty")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      page,
      count: submissions.length,
      submissions,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitCode,
  getUserSubmissions,
};