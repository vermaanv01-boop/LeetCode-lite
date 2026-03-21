const Submission = require("../Models/submissionModel");
const Problem = require("../Models/Problem");
const { evaluateSubmission } = require("../utils/evaluateSubmission");

// ================= SUBMIT CODE =================
const submitCode = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    // Validation
    if (!problemId || !code || !language) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const allowedLanguages = ["cpp", "java", "python", "javascript"];
    if (!allowedLanguages.includes(language.toLowerCase())) {
      return res.status(400).json({ message: "Unsupported language" });
    }

    // Check problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Create submission
    const submission = await Submission.create({
      user: req.user.id,
      problem: problemId,
      code,
      language,
      status: "pending",
    });

    // ================= CORE CHANGE STARTS HERE =================

    // Step 1: mark running
    submission.status = "running";
    await submission.save();

    // Step 2: evaluate code
    const result = await evaluateSubmission(problem, code, language);

    // Step 3: update submission
    submission.status = result.status;
    submission.result = result;
    await submission.save();

    // ================= CORE CHANGE ENDS HERE =================

    return res.status(201).json({
      message: "Submission evaluated",
      submissionId: submission._id,
      status: submission.status,
      result: submission.result,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET LOGGED-IN USER SUBMISSIONS =================
const getUserSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;

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