const Submission = require("../models/submissionModel");
const Problem = require("../models/problemModel");
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
    const problem = await Problem.findById(problemId).lean();
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Create submission (only once)
    const submission = await Submission.create({
      user: req.user.id,
      problem: problemId,
      code,
      language,
      status: "queued",
    });

    // 🔥 Background execution (non-blocking)
    process.nextTick(async () => {
      try {
        await Submission.findByIdAndUpdate(submission._id, {
          status: "running",
        });

        const result = await evaluateSubmission(problem, code, language);

        await Submission.findByIdAndUpdate(submission._id, {
          status: result.status,
          result,
        });

      } catch (err) {
        await Submission.findByIdAndUpdate(submission._id, {
          status: "error",
          result: { error: err.message },
        });
      }
    });

    // Immediate response
    return res.status(202).json({
      message: "Submission queued",
      submissionId: submission._id,
      status: submission.status,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET USER SUBMISSIONS =================
const getUserSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = 10;
    const skip = (page - 1) * limit;

    const submissions = await Submission.find({ user: userId })
      .populate("problem", "title difficulty")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // faster

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