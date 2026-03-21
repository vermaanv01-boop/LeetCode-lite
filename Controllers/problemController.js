const Problem = require("../Models/problemModel");

// ================= CREATE PROBLEM =================
const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      tags,
      constraints,
      examples,
      starterCode,
      testCases,
    } = req.body;

    // Validation
    if (!title || !description || !difficulty) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existingProblem = await Problem.findOne({ title });
    if (existingProblem) {
      return res.status(400).json({ message: "Problem already exists" });
    }

    const problem = await Problem.create({
      title,
      description,
      difficulty,
      tags,
      constraints,
      examples,
      starterCode,
      testCases,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      message: "Problem created successfully",
      problem,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL PROBLEMS =================
const getAllProblems = async (req, res) => {
  try {
    // Filters
    const { difficulty, tag, page = 1 } = req.query;

    const query = {};
    if (difficulty) query.difficulty = difficulty;
    if (tag) query.tags = tag;

    const limit = 10;
    const skip = (page - 1) * limit;

    const problems = await Problem.find(query)
      .select("title difficulty tags createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      page: Number(page),
      count: problems.length,
      problems,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET SINGLE PROBLEM =================
const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).select("-testCases");

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    return res.status(200).json(problem);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE PROBLEM =================
const updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Optional: restrict to creator/admin
    if (problem.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedProblem = await Problem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedProblem);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= DELETE PROBLEM =================
const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Restrict delete
    if (problem.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await problem.deleteOne();

    return res.status(200).json({ message: "Problem deleted successfully" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
};